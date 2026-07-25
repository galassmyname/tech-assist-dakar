"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Category = { name: string; slug: string };

export default function Filters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("categorie");

  function setCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("categorie", slug);
    else params.delete("categorie");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={`text-sm px-3.5 py-1.5 rounded-full border transition ${
          !activeCategory
            ? "bg-primary text-white border-primary"
            : "border-gray-200 text-ink-muted hover:border-primary hover:text-primary"
        }`}
      >
        Toutes les categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setCategory(cat.slug)}
          className={`text-sm px-3.5 py-1.5 rounded-full border transition ${
            activeCategory === cat.slug
              ? "bg-primary text-white border-primary"
              : "border-gray-200 text-ink-muted hover:border-primary hover:text-primary"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
