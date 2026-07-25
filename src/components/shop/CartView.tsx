"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartView() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={40} className="mx-auto text-ink-muted mb-3" />
        <p className="text-ink-muted mb-4">Votre panier est vide.</p>
        <Link
          href="/produits"
          className="inline-block bg-primary hover:bg-primary-dark text-white rounded-lg px-5 py-2.5 text-sm font-medium transition"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-lg bg-surface-muted overflow-hidden shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink text-sm truncate">{item.name}</p>
              <p className="text-primary font-semibold text-sm mt-0.5">
                {item.price.toLocaleString("fr-FR")} FCFA
              </p>
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg shrink-0">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="p-2 text-ink-muted hover:text-primary"
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))
                }
                className="p-2 text-ink-muted hover:text-primary"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="p-2 text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5 h-fit">
        <h2 className="font-medium text-ink mb-4">Resume</h2>
        <div className="flex items-center justify-between text-sm text-ink-muted mb-2">
          <span>Sous-total</span>
          <span>{total().toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div className="flex items-center justify-between font-semibold text-ink text-base pt-3 mt-3 border-t border-gray-100">
          <span>Total</span>
          <span className="text-primary">{total().toLocaleString("fr-FR")} FCFA</span>
        </div>

        <button
          onClick={() => router.push("/commande")}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-3 text-sm font-medium mt-5 transition"
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
}
