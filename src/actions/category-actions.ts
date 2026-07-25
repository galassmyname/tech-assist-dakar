"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  if (!name || name.trim().length < 2) {
    return { error: "Le nom de la categorie est invalide." };
  }

  const slug = slugify(name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Cette categorie existe deja." };
  }

  await prisma.category.create({ data: { name: name.trim(), slug } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  if (!name || name.trim().length < 2) {
    return { error: "Le nom de la categorie est invalide." };
  }

  const slug = slugify(name);

  const conflict = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (conflict) {
    return { error: "Une autre categorie utilise deja ce nom." };
  }

  await prisma.category.update({
    where: { id },
    data: { name: name.trim(), slug },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return {
      error: `Impossible de supprimer : ${productCount} produit(s) utilisent encore cette categorie.`,
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}
