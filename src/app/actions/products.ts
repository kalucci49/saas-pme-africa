"use server";

import { revalidatePath } from "next/cache";
import { getCurrentOrganization } from "@/lib/auth/current-organization";
import * as productService from "@/lib/services/productService";
import type { ProductInput } from "@/types/product";

export async function createProductAction(input: ProductInput) {
  const org = await getCurrentOrganization();
  const product = await productService.createProduct(input, org.id);
  revalidatePath("/dashboard/products");
  return product;
}

export async function updateProductAction(id: string, input: Partial<ProductInput>) {
  const org = await getCurrentOrganization();
  const product = await productService.updateProduct(id, input, org.id);
  revalidatePath("/dashboard/products");
  return product;
}

export async function deactivateProductAction(id: string) {
  const org = await getCurrentOrganization();
  await productService.deactivateProduct(id, org.id);
  revalidatePath("/dashboard/products");
}

export async function duplicateProductAction(id: string) {
  const org = await getCurrentOrganization();
  const product = await productService.duplicateProduct(id, org.id);
  revalidatePath("/dashboard/products");
  return product;
}
