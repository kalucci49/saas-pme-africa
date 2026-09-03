import { getCurrentOrganization } from "@/lib/auth/current-organization";
import * as productService from "@/lib/services/productService";
import { NewProductForm } from "@/components/products/NewProductForm";

export default async function NewProductPage() {
  const org = await getCurrentOrganization();
  const categories = await productService.getCategories(org.id);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:py-8">
      <NewProductForm categories={categories} orgName={org.name} orgId={org.id} />
    </div>
  );
}
