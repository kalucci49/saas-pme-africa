import { createClient } from "@/lib/supabase/server";

export async function getCurrentOrganization() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("current_organization_id, organizations(id, name, slug)")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile?.current_organization_id) {
    throw new Error("Aucune organisation active trouvée pour cet utilisateur");
  }

  const orgData = profile.organizations as unknown;
  const org = (Array.isArray(orgData) ? orgData[0] : orgData) as { id: string; name: string; slug: string } | null;

  return {
    id: profile.current_organization_id as string,
    name: org?.name ?? "",
    slug: org?.slug ?? "",
  };
}
