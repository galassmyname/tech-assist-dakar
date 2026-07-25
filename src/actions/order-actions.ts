"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendOrderNotificationEmail } from "@/lib/notifications";

type OrderInput = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  items: { productId: string; quantity: number }[];
};

async function generateOrderReference() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: { createdAt: { gte: new Date(`${year}-01-01`) } },
  });
  const number = (count + 1).toString().padStart(4, "0");
  return `TAD-${year}-${number}`;
}

export async function createOrder(data: OrderInput) {
  if (!data.firstName?.trim() || data.firstName.trim().length < 2) {
    return { error: "Le prenom est requis." };
  }
  if (!data.lastName?.trim() || data.lastName.trim().length < 2) {
    return { error: "Le nom est requis." };
  }
  const phoneRegex = /^(\+221)?[7][0-8][0-9]{7}$/;
  if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
    return { error: "Numero de telephone invalide (format senegalais attendu)." };
  }
  if (!data.address?.trim() || data.address.trim().length < 5) {
    return { error: "L'adresse est requise." };
  }
  if (!data.city?.trim()) {
    return { error: "La ville est requise." };
  }
  if (!data.items || data.items.length === 0) {
    return { error: "Votre panier est vide." };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: data.items.map((i) => i.productId) } },
      });

      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Produit introuvable.`);
        }
        if (!product.isAvailable) {
          throw new Error(`"${product.name}" n'est plus disponible.`);
        }
        // Le stock est verifie ici mais pas encore decremente.
        // Il ne sera reellement decompte qu'au moment du passage en "Livree".
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour "${product.name}" (${product.stock} restant(s)).`);
        }

        const lineTotal = Number(product.price) * item.quantity;
        totalAmount += lineTotal;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
        });
      }

      const reference = await generateOrderReference();

      const newOrder = await tx.order.create({
        data: {
          reference,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phone: data.phone.trim(),
          address: data.address.trim(),
          city: data.city.trim(),
          totalAmount,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      return newOrder;
    });

    revalidatePath("/admin/commandes");

    // Notification email via Brevo (ne bloque jamais la commande si ca echoue)
    const itemsList = order.items
      .map((i) => `- ${i.productName} x${i.quantity}`)
      .join("\n");
    sendOrderNotificationEmail({
      reference: order.reference,
      customerName: `${order.firstName} ${order.lastName}`,
      phone: order.phone,
      city: order.city,
      address: order.address,
      itemsList,
      total: Number(order.totalAmount).toLocaleString("fr-FR"),
    });

    return { success: true, orderId: order.id, reference: order.reference };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Une erreur est survenue.";
    return { error: message };
  }
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function getAdminOrders(status?: string) {
  const session = await auth();
  if (!session) throw new Error("Non autorise");

  return prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(
  id: string,
  newStatus: "EN_ATTENTE" | "CONFIRMEE" | "LIVREE" | "ANNULEE"
) {
  const session = await auth();
  if (!session) throw new Error("Non autorise");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return { error: "Commande introuvable." };

  const wasLivree = order.status === "LIVREE";
  const becomesLivree = newStatus === "LIVREE";

  await prisma.$transaction(async (tx) => {
    // Passage vers "Livree" : on decompte le stock maintenant
    if (becomesLivree && !wasLivree) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // Si on revient en arriere depuis "Livree" (erreur de manipulation), on remet le stock
    if (!becomesLivree && wasLivree) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    await tx.order.update({ where: { id }, data: { status: newStatus } });
  });

  revalidatePath("/admin/commandes");
  revalidatePath("/produits");
  return { success: true };
}