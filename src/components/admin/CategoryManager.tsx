"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/actions/category-actions";
import { Pencil, Trash2, Plus, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("name", newName);

    startTransition(async () => {
      const result = await createCategory(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setNewName("");
        window.location.reload();
      }
    });
  }

  function handleUpdate(id: string) {
    setError("");
    const formData = new FormData();
    formData.append("name", editName);

    startTransition(async () => {
      const result = await updateCategory(id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setEditingId(null);
        window.location.reload();
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer cette categorie ?")) return;
    setError("");

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) {
        setError(result.error);
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nouvelle categorie..."
          required
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
        {categories.length === 0 && (
          <p className="p-5 text-sm text-ink-muted text-center">Aucune categorie pour l'instant.</p>
        )}

        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4">
            {editingId === cat.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  disabled={isPending}
                  className="text-primary text-sm font-medium px-2"
                >
                  Sauver
                </button>
                <button onClick={() => setEditingId(null)} className="text-ink-muted p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-medium text-ink text-sm">{cat.name}</p>
                  <p className="text-xs text-ink-muted">
                    {cat.productCount} produit{cat.productCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditName(cat.name);
                    }}
                    className="p-2 text-ink-muted hover:text-primary hover:bg-surface-muted rounded-lg transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={isPending}
                    className="p-2 text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
