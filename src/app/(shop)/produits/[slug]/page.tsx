import { getProductBySlug, getRelatedProducts } from "@/actions/shop-actions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/shop/ProductGallery";
import AddToCartPanel from "@/components/shop/AddToCartPanel";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description = product.description.slice(0, 155);

  return {
    title: `${product.name} — Tech-Assist Dakar`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: product.brand ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: Number(product.price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs text-ink-muted mb-6 flex gap-1.5">
        <Link href="/" className="hover:text-primary">Accueil</Link> /
        <Link href={`/categorie/${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </Link> /
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={product.images.map((i) => i.url)} productName={product.name} />

        <div>
          <p className="text-sm text-primary font-medium mb-2">{product.category.name}</p>
          <h1 className="text-2xl font-semibold text-ink mb-3">{product.name}</h1>
          {product.brand && (
            <p className="text-sm text-ink-muted mb-4">Marque : {product.brand}</p>
          )}
          <p className="text-3xl font-bold text-primary mb-6">
            {Number(product.price).toLocaleString("fr-FR")} FCFA
          </p>

          <AddToCartPanel
            product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              imageUrl: product.images[0]?.url ?? null,
              stock: product.stock,
            }}
          />

          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="font-medium text-ink mb-2">Description</h2>
            <p className="text-sm text-ink-muted whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-ink mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: Number(p.price),
                  imageUrl: p.images[0]?.url ?? null,
                  category: product.category.name,
                  stock: p.stock,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
