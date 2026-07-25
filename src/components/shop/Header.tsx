"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function Header({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/produits?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
       <Link href="/" className="flex items-center shrink-0">
          <img src="/logo/logo-tech-assist.png" alt="Tech-Assist Dakar" className="h-12 object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-ink-muted shrink-0">
          <Link href="/produits" className="hover:text-primary transition">Tous les produits</Link>
          {categories.slice(0, 4).map((cat) => (
            <Link key={cat.slug} href={`/categorie/${cat.slug}`} className="hover:text-primary transition">
              {cat.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md ml-auto">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full rounded-full border border-gray-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        <Link
          href="/panier"
          className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-muted transition shrink-0 ml-2"
        >
          <ShoppingCart size={20} className="text-ink" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-ink"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full rounded-full border border-gray-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-3 text-sm font-medium text-ink-muted">
            <Link href="/produits" onClick={() => setMenuOpen(false)}>Tous les produits</Link>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/categorie/${cat.slug}`} onClick={() => setMenuOpen(false)}>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
