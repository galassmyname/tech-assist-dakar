import { prisma } from "@/lib/prisma";
import { getPublicProducts, getPublicCategories } from "@/actions/shop-actions";
import ProductCard from "@/components/shop/ProductCard";
import Filters from "@/components/shop/Filters";
import Pagination from "@/components/shop/Pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  return {
    title: `${category.name} — Tech-Assist Dakar`,
    description: `Decouvrez notre selection de ${category.name.toLowerCase()} disponibles a Dakar. Livraison rapide, prix competitifs.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page ?? "1", 10);

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [categories, { products, totalPages, total }] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ categorySlug: slug, page: currentPage }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-ink mb-1">{category.name}</h1>
      <p className="text-sm text-ink-muted mb-6">{total} produit{total !== 1 ? "s" : ""}</p>

      <div className="mb-8">
        <Filters categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />
      </div>

      {products.length === 0 ? (
        <p className="text-center py-20 text-ink-muted">Aucun produit dans cette categorie pour le moment.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: Number(p.price),
                  imageUrl: p.images[0]?.url ?? null,
                  category: p.category.name,
                  stock: p.stock,
                }}
              />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
