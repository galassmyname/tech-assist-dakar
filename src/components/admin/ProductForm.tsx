"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product-actions";
import ImageUploader, { UploadedImage } from "./ImageUploader";

type Category = { id: string; name: string };

type ExistingProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string | null;
  categoryId: string;
  isAvailable: boolean;
  images: { url: string; publicId: string }[];
};

export default function ProductForm({
  categories,
  existingProduct,
}: {
  categories: Category[];
  existingProduct?: ExistingProduct;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState(existingProduct?.name ?? "");
  const [description, setDescription] = useState(existingProduct?.description ?? "");
  const [price, setPrice] = useState(existingProduct?.price?.toString() ?? "");
  const [stock, setStock] = useState(existingProduct?.stock?.toString() ?? "0");
  const [brand, setBrand] = useState(existingProduct?.brand ?? "");
  const [categoryId, setCategoryId] = useState(existingProduct?.categoryId ?? "");
  const [isAvailable, setIsAvailable] = useState(existingProduct?.isAvailable ?? true);
  const [images, setImages] = useState<UploadedImage[]>(
    existingProduct?.images.map((img) => ({
      url: img.url,
      publicId: `existing-${img.publicId}`,
    })) ?? []
  );

  const originalPublicIds =
    existingProduct?.images.map((img) => img.publicId) ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Ajoutez au moins une image du produit.");
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    startTransition(async () => {
      if (existingProduct) {
        const currentPublicIds = images
          .filter((img) => img.publicId.startsWith("existing-"))
          .map((img) => img.publicId.replace("existing-", ""));
        const removedPublicIds = originalPublicIds.filter(
          (id) => !currentPublicIds.includes(id)
        );

        const result = await updateProduct(existingProduct.id, {
          name,
          description,
          price: parsedPrice,
          stock: parsedStock,
          brand,
          categoryId,
          isAvailable,
          images: images.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })),
          removedPublicIds,
        });

        if (result?.error) setError(result.error);
        else router.push("/admin/produits");
      } else {
        const result = await createProduct({
          name,
          description,
          price: parsedPrice,
          stock: parsedStock,
          brand,
          categoryId,
          isAvailable,
          images,
        });

        if (result?.error) setError(result.error);
        else router.push("/admin/produits");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm text-ink-muted mb-1">Images du produit</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div>
        <label className="block text-sm text-ink-muted mb-1">Nom du produit</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm text-ink-muted mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-muted mb-1">Prix (FCFA)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-muted mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min={0}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-muted mb-1">Marque (optionnel)</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-muted mb-1">Categorie</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choisir...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        Produit disponible a la vente
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary-dark text-white rounded-lg px-5 py-2.5 text-sm font-medium transition disabled:opacity-60"
        >
          {isPending ? "Enregistrement..." : existingProduct ? "Mettre a jour" : "Creer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="text-ink-muted hover:text-ink text-sm font-medium px-5 py-2.5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
