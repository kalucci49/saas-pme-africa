import { getCurrentOrganization } from "@/lib/auth/current-organization";
import * as productService from "@/lib/services/productService";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/products/EditProductForm";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getCurrentOrganization();
  const product = await productService.getProduct(id, org.id);

  if (!product) {
    notFound();
  }

  const categories = await productService.getCategories(org.id);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:py-8">
      <EditProductForm product={product} categories={categories} orgName={org.name} orgId={org.id} />
    </div>
  );
}
