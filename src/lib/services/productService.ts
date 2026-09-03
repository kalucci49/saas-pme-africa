import { createClient } from "@/lib/supabase/server";
import type { Product, ProductInput } from "@/types/product";

export async function listProducts(organizationId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name", { ascending: true });

  if (error) throw new Error(`Erreur chargement produits: ${error.message}`);
  return data ?? [];
}

export async function getProduct(id: string, organizationId: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function createProduct(
  input: ProductInput,
  organizationId: string
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      organization_id: organizationId,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();

  if (error) throw new Error(`Erreur création produit: ${error.message}`);
  return data;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
  organizationId: string
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select()
    .single();

  if (error) throw new Error(`Erreur mise à jour produit: ${error.message}`);
  return data;
}

export async function deactivateProduct(id: string, organizationId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) throw new Error(`Erreur désactivation produit: ${error.message}`);
}

export async function duplicateProduct(id: string, organizationId: string): Promise<Product> {
  const original = await getProduct(id, organizationId);
  if (!original) throw new Error("Produit introuvable");

  return createProduct(
    {
      name: `${original.name} (copie)`,
      description: original.description ?? undefined,
      category: original.category ?? undefined,
      price: original.price,
      tax_rate: original.tax_rate,
      image_url: original.image_url ?? undefined,
      is_active: true,
    },
    organizationId
  );
}

export async function getCategories(organizationId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("organization_id", organizationId)
    .not("category", "is", null);

  if (error || !data) return [];
  const unique = Array.from(new Set(data.map((d) => d.category as string).filter(Boolean)));
  return unique.sort((a, b) => a.localeCompare(b));
}
