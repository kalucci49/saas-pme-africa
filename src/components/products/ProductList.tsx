"use client";

import type { Product } from "@/types/product";
import Link from "next/link";

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center text-gray-500 text-sm sm:text-base">
        Aucun produit pour l&apos;instant. Créez le premier.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
      {products.map((p) => (
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
          </div>
        </Link>
      ))}
    </div>
  );
}
