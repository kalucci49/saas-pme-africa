"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProductAction, deactivateProductAction } from "@/app/actions/products";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";
import { ProductFichePreview } from "@/components/products/ProductFichePreview";
import type { Product } from "@/types/product";

const inputClass =
  "w-full mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400";

type Tab = "edit" | "preview";

export function EditProductForm({
  product,
  categories,
  orgName,
  orgId,
}: {
  product: Product;
  categories: string[];
  orgName: string;
  orgId: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("edit");
  const [loading, setLoading] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(product.image_url);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description ?? "",
    category: product.category ?? "",
    price: product.price,
    tax_rate: product.tax_rate,
    warranty: product.warranty ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProductAction(product.id, { ...form, image_url: imageUrl ?? undefined });
      router.push("/dashboard/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    setDeactivating(true);
    try {
      await deactivateProductAction(product.id);
      router.push("/dashboard/products");
      router.refresh();
    } finally {
      setDeactivating(false);
      setConfirmOpen(false);
    }
  }

  const priceTTC = form.price * (1 + form.tax_rate / 100);

  return (
    <div>
      {/* Onglets — visibles uniquement sur mobile */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-full w-fit lg:hidden">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            tab === "edit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          Édition
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            tab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          Aperçu
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panneau édition */}
        <div className={tab === "edit" ? "block" : "hidden lg:block"}>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Modifier le produit
              </h1>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  product.is_active
                    ? "bg-green-500/20 text-green-300"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {product.is_active ? "Actif" : "Inactif"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" style={{ colorScheme: "light" }}>
              <ProductImageUpload organizationId={orgId} value={imageUrl} onChange={setImageUrl} />

              <div>
                <label className="text-sm text-gray-600">Nom du produit</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  style={{ colorScheme: "light" }}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                  style={{ colorScheme: "light" }}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Catégorie</label>
                <input
                  list="category-suggestions-edit"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                  style={{ colorScheme: "light" }}
                />
                <datalist id="category-suggestions-edit">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Prix HT (FCFA)</label>
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

              <div>
                <label className="text-sm text-gray-600">Garantie (optionnel)</label>
                <input
                  placeholder="ex : 2 ans"
                  value={form.warranty}
                  onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                  className={inputClass}
                  style={{ colorScheme: "light" }}
                />
              </div>

              {/* Bandeau prix mis en avant, façon fiche produit */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Prix TTC estimé</p>
                  <p className="text-lg font-bold text-gray-900">
                    {priceTTC.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Ajouté le {new Date(product.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-full py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100">
              {!confirmOpen ? (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  disabled={!product.is_active}
                  className="w-full text-sm font-medium text-red-600 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed py-2 transition"
                >
                  {product.is_active ? "Désactiver ce produit" : "Ce produit est déjà désactivé"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-sm text-gray-600">Confirmer la désactivation ?</p>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    disabled={deactivating}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
                  >
                    {deactivating ? "..." : "Confirmer"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panneau aperçu */}
        <div className={tab === "preview" ? "block" : "hidden lg:block"}>
          <div className="lg:sticky lg:top-6">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2 px-1 hidden lg:block">
              Aperçu en direct
            </p>
            <ProductFichePreview data={{ ...form, image_url: imageUrl }} orgName={orgName} />
          </div>
        </div>
      </div>
    </div>
  );
}
