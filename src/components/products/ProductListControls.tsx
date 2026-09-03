"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, Copy } from "lucide-react";
import type { Product } from "@/types/product";
import { duplicateProductAction } from "@/app/actions/products";
import { useRouter } from "next/navigation";

type SortKey = "name" | "price_asc" | "price_desc" | "recent";

export function ProductListControls({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [sort, setSort] = useState<SortKey>("name");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = products;

    if (!showInactive) {
      result = result.filter((p) => p.is_active);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "recent":
        sorted.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }
    return sorted;
  }, [products, query, showInactive, sort]);

  async function handleDuplicate(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setDuplicatingId(id);
    try {
      await duplicateProductAction(id);
      router.refresh();
    } finally {
      setDuplicatingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center text-gray-500 text-sm sm:text-base">
        Aucun produit pour l&apos;instant. Créez le premier.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit ou une catégorie..."
            className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
            style={{ colorScheme: "light" }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none rounded-lg border border-gray-200 bg-white pl-8 pr-8 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
              style={{ colorScheme: "light" }}
            >
              <option value="name">Nom (A-Z)</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="recent">Plus récents</option>
            </select>
            <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setShowInactive((v) => !v)}
            className={`shrink-0 whitespace-nowrap rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
              showInactive
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Inactifs
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
          Aucun résultat pour cette recherche.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/products/${p.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 hover:bg-gray-50 active:bg-gray-100 transition"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{p.name}</p>
                {p.category && (
                  <p className="text-sm text-gray-500 truncate">{p.category}</p>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {p.price.toLocaleString("fr-FR")} FCFA
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    p.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p.is_active ? "Actif" : "Inactif"}
                </span>
                <button
                  type="button"
                  aria-label="Dupliquer"
                  onClick={(e) => handleDuplicate(e, p.id)}
                  disabled={duplicatingId === p.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  <Copy size={15} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
