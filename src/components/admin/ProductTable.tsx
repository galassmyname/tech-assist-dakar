"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, ImageOff } from "lucide-react";
import { deleteProduct, toggleProductAvailability } from "@/actions/product-actions";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  category: string;
  imageUrl: string | null;
};

export default function ProductTable({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit definitivement ?")) return;
    setError("");

    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result?.error) setError(result.error);
      else setProducts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  function handleToggle(id: string, current: boolean) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !current } : p))
    );
    startTransition(async () => {
      await toggleProductAvailability(id, !current);
    });
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-ink-muted text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Produit</th>
              <th className="text-left px-4 py-3 font-medium">Categorie</th>
              <th className="text-left px-4 py-3 font-medium">Prix</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium">Statut</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-ink-muted">
                        <ImageOff size={16} />
                      </div>
                    )}
                    <span className="font-medium text-ink">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                <td className="px-4 py-3 text-ink">{p.price.toLocaleString("fr-FR")} FCFA</td>
                <td className="px-4 py-3 text-ink">{p.stock}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(p.id, p.isAvailable)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition ${
                      p.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.isAvailable ? "Disponible" : "Indisponible"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/produits/${p.id}`}
                      className="p-2 text-ink-muted hover:text-primary hover:bg-surface-muted rounded-lg transition"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={isPending}
                      className="p-2 text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">
                  Aucun produit pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
