"use client";

import Link from "next/link";
import { ImageOff, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
  }

  return (
    <Link
      href={`/produits/${product.slug}`}
     className="group bg-white rounded-xl border-2 border-primary overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-square bg-surface-muted relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted">
            <ImageOff size={32} />
          </div>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-medium px-2 py-1 rounded-full">
            Rupture de stock
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-ink-muted mb-1">{product.category}</p>
        <h3 className="font-medium text-ink text-sm line-clamp-2 mb-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary text-sm">
            {product.price.toLocaleString("fr-FR")} FCFA
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}
