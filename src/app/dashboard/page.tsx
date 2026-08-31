import { createClient } from '@/lib/supabase/server'
import { formatFCFA } from '@/lib/format'
import KpiCard from '@/components/dashboard/kpi-card'
import QuickActions from '@/components/dashboard/quick-actions'
import RecentInvoices from '@/components/dashboard/recent-invoices'

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const attentionItems = [
  { label: '3 factures échues depuis plus de 7 jours', amount: 320000, level: 'critique' as const, action: 'Relancer' },
  { label: 'Loyer en retard — Villa Cocody', level: 'critique' as const, action: 'Voir' },
  { label: 'Stock faible — Riz 25kg (2 restants)', level: 'attention' as const, action: 'Réapprovisionner' },
  { label: 'Contrat de bail arrivant à expiration dans 12 jours', level: 'attention' as const, action: 'Renouveler' },
]

const critiqueCount = attentionItems.filter((i) => i.level === 'critique').length
const attentionCount = attentionItems.length - critiqueCount
const impayesTotal = attentionItems.filter((i) => i.amount).reduce((s, i) => s + (i.amount ?? 0), 0)
const impayesFactures = attentionItems.filter((i) => i.amount).length

const kpis = [
  {
    label: "Chiffre d'affaires",
    value: formatFCFA(4250000),
    icon: <svg {...iconProps}><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 3 5-6" /></svg>,
    trend: { direction: 'up' as const, label: '+15% ce mois' },
  },
  {
    label: 'Trésorerie disponible',
    value: formatFCFA(1180000),
    icon: <svg {...iconProps}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1" /></svg>,
    trend: { direction: 'up' as const, label: '+4% ce mois' },
  },
  {
    label: 'Impayés',
    value: formatFCFA(impayesTotal),
    valueClassName: 'text-[#B3431E]',
    icon: <svg {...iconProps}><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-18Z" /></svg>,
    trend: { direction: 'down' as const, label: `${impayesFactures} facture${impayesFactures > 1 ? 's' : ''} en retard` },
  },
  {
    label: 'Nouveaux clients',
    value: '8',
    icon: <svg {...iconProps}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 8h5M18.5 5.5v5" /></svg>,
    trend: { direction: 'up' as const, label: '+2 ce mois' },
  },
  {
    label: 'Alertes actives',
    value: String(attentionItems.length),
    icon: <svg {...iconProps}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /><circle cx="12" cy="12" r="2.5" /></svg>,
    trend: { direction: 'down' as const, label: `${critiqueCount} critique${critiqueCount > 1 ? 's' : ''}` },
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organizations(name)')
    .eq('user_id', user?.id ?? '')
    .maybeSingle()

  const displayName =
    (membership as { organizations?: { name?: string } } | null)?.organizations?.name ??
    user?.email?.split('@')[0] ??
    ''

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#12211D]">
          Bienvenue{displayName ? `, ${displayName}` : ''}
        </h2>
        <p className="mt-1 font-[family-name:var(--font-body)] text-sm text-[#12211D]/60">
          Voici ce qui mérite votre attention aujourd&apos;hui.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="rounded-2xl border border-[#E4DFD3] bg-gradient-to-br from-white to-[#FAF7F2] p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12211D]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D9A536" strokeWidth="1.9">
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#12211D]">
                Centre de contrôle IA
              </h3>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#12211D]/50">
                {critiqueCount} critique{critiqueCount > 1 ? 's' : ''} · {attentionCount} à surveiller
              </p>
            </div>
          </div>
          {impayesTotal > 0 && (
            <div className="text-right">
              <p className="font-[family-name:var(--font-body)] text-xs text-[#12211D]/50">
                À récupérer ({impayesFactures} facture{impayesFactures > 1 ? 's' : ''})
              </p>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums text-[#B3431E]">
                {formatFCFA(impayesTotal)}
              </p>
            </div>
          )}
        </div>

        <ul className="divide-y divide-[#E4DFD3]">
          {attentionItems.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    item.level === 'critique' ? 'bg-[#B3431E]' : 'bg-[#D9A536]'
                  }`}
                />
                <span className="font-[family-name:var(--font-body)] text-sm text-[#12211D]">
                  {item.label}
                </span>
              </div>
              <button className="shrink-0 font-[family-name:var(--font-body)] text-xs font-semibold text-[#1B4B43] hover:underline">
                {item.action}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-[family-name:var(--font-body)] text-sm font-semibold text-[#12211D]/70">
          Actions rapides
        </h3>
        <QuickActions />
      </div>

      <RecentInvoices />
    </div>
  )
}
