"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

type Product = { id: string; name: string; price: number; imageUrl: string | null; stock: number };

export default function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (product.stock === 0) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
        Ce produit est actuellement en rupture de stock.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-2.5 text-ink-muted hover:text-primary"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="p-2.5 text-ink-muted hover:text-primary"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition ${
          added ? "bg-green-600 text-white" : "bg-primary hover:bg-primary-dark text-white"
        }`}
      >
        {added ? (
          <>
            <Check size={16} /> Ajoute au panier
          </>
        ) : (
          <>
            <ShoppingCart size={16} /> Ajouter au panier
          </>
        )}
      </button>
    </div>
  );
}
