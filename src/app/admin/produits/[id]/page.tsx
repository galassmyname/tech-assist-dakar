import { getCategories } from "@/actions/category-actions";
import { getProductById } from "@/actions/product-actions";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">Modifier le produit</h1>
      <ProductForm
        categories={categories}
        existingProduct={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stock: product.stock,
          brand: product.brand,
          categoryId: product.categoryId,
          isAvailable: product.isAvailable,
          images: product.images,
        }}
      />
    </div>
  );
}
