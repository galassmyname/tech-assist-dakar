"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isAvailable: true } } } } },
  });
}

export async function getPublicProducts(params: {
  search?: string;
  categorySlug?: string;
  page?: number;
  perPage?: number;
}) {
  const { search, categorySlug, page = 1, perPage = 12 } = params;

  const where = {
    isAvailable: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { brand: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, totalPages: Math.ceil(total / perPage) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isAvailable: true },
    include: { category: true, images: { orderBy: { position: "asc" } } },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, isAvailable: true, NOT: { id: excludeId } },
    include: { images: { take: 1 } },
    take: 4,
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isAvailable: true },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}
