import Link from "next/link";
import { getAdminProducts } from "@/actions/product-actions";
import ProductTable from "@/components/admin/ProductTable";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-ink">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>

      <ProductTable
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          stock: p.stock,
          isAvailable: p.isAvailable,
          category: p.category.name,
          imageUrl: p.images[0]?.url ?? null,
        }))}
      />
    </div>
  );
}
