import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/dashboard/shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role, organizations(name)')
    .eq('user_id', user.id)
    .maybeSingle()

  const orgName =
    (membership as { organizations?: { name?: string } } | null)?.organizations?.name ??
    'Votre entreprise'

  return (
    <DashboardShell userEmail={user.email ?? ''} orgName={orgName}>
      {children}
    </DashboardShell>
  )
}
