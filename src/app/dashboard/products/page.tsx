import { getCurrentOrganization } from "@/lib/auth/current-organization";
import * as productService from "@/lib/services/productService";
import { ProductListControls } from "@/components/products/ProductListControls";
import Link from "next/link";

export default async function ProductsPage() {
  const org = await getCurrentOrganization();
  const products = await productService.listProducts(org.id);

  const activeCount = products.filter((p) => p.is_active).length;
  const avgPrice =
    products.length > 0
      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
      : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:py-8">
      <div className="mb-2 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:gap-3">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Produits &amp; services
        </h1>
        <Link
          href="/dashboard/products/new"
          className="flex items-center justify-center w-full rounded-full border border-gray-900 bg-white text-gray-900 px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-50 active:bg-black active:text-white active:scale-95 sm:w-auto sm:px-5"
        >
          + Nouveau produit
        </Link>
      </div>

      {products.length > 0 && (
        <p className="text-sm text-gray-500 mb-6">
          {activeCount} produit{activeCount > 1 ? "s" : ""} actif{activeCount > 1 ? "s" : ""} ·
          Prix moyen {avgPrice.toLocaleString("fr-FR")} FCFA
        </p>
      )}

      <ProductListControls products={products} />
    </div>
  );
}
