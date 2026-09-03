"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/app/actions/products";

const inputClass =
  "w-full mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400";

export function NewProductForm({ categories, orgName, orgId }: { categories: string[]; orgName: string; orgId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    tax_rate: 18,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createProductAction(form);
      router.push("/dashboard/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 sm:mb-6">
        Nouveau produit
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4" style={{ colorScheme: "light" }}>
        <div>
          <label className="text-sm text-gray-600">Nom</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            style={{ colorScheme: "light" }}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Catégorie</label>
          <input
            list="category-suggestions"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
            style={{ colorScheme: "light" }}
          />
          <datalist id="category-suggestions">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Prix (FCFA)</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className={inputClass}
              style={{ colorScheme: "light" }}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Taxe (%)</label>
            <input
              type="number"
              value={form.tax_rate}
              onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })}
              className={inputClass}
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-full py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}
