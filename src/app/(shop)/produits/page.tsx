import { getPublicProducts, getPublicCategories } from "@/actions/shop-actions";
import ProductCard from "@/components/shop/ProductCard";
import Filters from "@/components/shop/Filters";
import Pagination from "@/components/shop/Pagination";
import { SearchX } from "lucide-react";

export const metadata = {
  title: "Tous les produits — Tech-Assist Dakar",
  description: "Parcourez notre catalogue complet : ordinateurs, smartphones, accessoires, composants et peripheriques electroniques a Dakar.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; page?: string }>;
}) {
  const { q, categorie, page } = await searchParams;
  const currentPage = parseInt(page ?? "1", 10);

  const [categories, { products, totalPages, total }] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ search: q, categorySlug: categorie, page: currentPage }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-ink mb-1">
        {q ? `Resultats pour "${q}"` : "Tous les produits"}
      </h1>
      <p className="text-sm text-ink-muted mb-6">{total} produit{total !== 1 ? "s" : ""} trouve{total !== 1 ? "s" : ""}</p>

      <div className="mb-8">
        <Filters categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <SearchX size={40} className="mx-auto text-ink-muted mb-3" />
          <p className="text-ink-muted">Aucun produit ne correspond a votre recherche.</p>
        </div>
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
