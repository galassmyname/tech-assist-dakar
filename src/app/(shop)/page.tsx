import Link from "next/link";
import { getFeaturedProducts, getPublicCategories } from "@/actions/shop-actions";
import ProductCard from "@/components/shop/ProductCard";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tech-Assist Dakar — Ordinateurs, Smartphones & Accessoires Informatiques",
  description:
    "Boutique en ligne d'electronique a Dakar : ordinateurs, smartphones, disques durs, montres connectees, ecouteurs et bien plus. Livraison rapide au Senegal.",
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getPublicCategories(),
  ]);

  return (
    <div>
     <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Toute l'electronique dont vous avez besoin, a Dakar
          </h1>
          <p className="text-white/90 max-w-xl mx-auto mb-8">
            Ordinateurs, smartphones, montres connectees, ecouteurs, disques durs et bien plus — au meilleur prix, livres chez vous.
          </p>
          <Link
            href="/produits"
            className="inline-block bg-white text-primary font-medium rounded-full px-6 py-3 hover:bg-surface-muted transition"
          >
            Decouvrir les produits
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-ink mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="bg-white border-2 border-primary rounded-xl p-5 text-center hover:shadow-md transition"
            >
              <p className="font-medium text-ink text-sm">{cat.name}</p>
              <p className="text-xs text-ink-muted mt-1">{cat._count.products} produits</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-ink">Produits recents</h2>
          <Link href="/produits" className="text-sm text-primary font-medium hover:underline">
            Voir tout →
          </Link>
        </div>
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
      </section>
    </div>
  );
}
