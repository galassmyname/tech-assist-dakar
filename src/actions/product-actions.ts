"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "./upload-actions";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorise");
}

type ProductImageInput = { url: string; publicId: string };

export async function getAdminProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { position: "asc" } } },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, category: true },
  });
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand?: string;
  categoryId: string;
  isAvailable: boolean;
  images: ProductImageInput[];
}) {
  await requireAdmin();

  if (!data.name || data.name.trim().length < 3) {
    return { error: "Le nom du produit est trop court." };
  }
  if (data.price <= 0) {
    return { error: "Le prix doit etre superieur a 0." };
  }
  if (!data.categoryId) {
    return { error: "Veuillez choisir une categorie." };
  }

  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const product = await prisma.product.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      brand: data.brand || null,
      categoryId: data.categoryId,
      isAvailable: data.isAvailable,
      images: {
        create: data.images.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          position: i,
        })),
      },
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  return { success: true, id: product.id };
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    brand?: string;
    categoryId: string;
    isAvailable: boolean;
    images: ProductImageInput[];
    removedPublicIds: string[];
  }
) {
  await requireAdmin();

  if (!data.name || data.name.trim().length < 3) {
    return { error: "Le nom du produit est trop court." };
  }
  if (data.price <= 0) {
    return { error: "Le prix doit etre superieur a 0." };
  }

  for (const publicId of data.removedPublicIds) {
    await deleteCloudinaryImage(publicId).catch(() => null);
  }
  if (data.removedPublicIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { publicId: { in: data.removedPublicIds }, productId: id },
    });
  }

  const existingCount = await prisma.productImage.count({ where: { productId: id } });
  const newImages = data.images.filter(
    (img) => !data.removedPublicIds.includes(img.publicId)
  );

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name.trim(),
      description: data.description,
      price: data.price,
      stock: data.stock,
      brand: data.brand || null,
      categoryId: data.categoryId,
      isAvailable: data.isAvailable,
    },
  });

  const imagesToCreate = newImages.filter(
    (img) => !img.publicId.startsWith("existing-")
  );
  if (imagesToCreate.length > 0) {
    await prisma.productImage.createMany({
      data: imagesToCreate.map((img, i) => ({
        url: img.url,
        publicId: img.publicId,
        productId: id,
        position: existingCount + i,
      })),
    });
  }

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath(`/produits/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) return { error: "Produit introuvable." };

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return {
      error:
        "Ce produit est lie a des commandes existantes et ne peut pas etre supprime. Desactivez-le plutot.",
    };
  }

  for (const img of product.images) {
    await deleteCloudinaryImage(img.publicId).catch(() => null);
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  return { success: true };
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isAvailable } });
  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  return { success: true };
}
