import { getCategories } from "@/actions/category-actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
