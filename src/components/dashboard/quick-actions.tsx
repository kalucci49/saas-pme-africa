import Link from 'next/link'

const actions = [
  { href: '/dashboard/invoices/new', label: 'Nouvelle facture', icon: 'receipt' },
  { href: '/dashboard/quotes/new', label: 'Nouveau devis', icon: 'file' },
  { href: '/dashboard/clients/new', label: 'Nouveau client', icon: 'user' },
  { href: '/dashboard/treasury/new', label: 'Nouvelle dépense', icon: 'wallet' },
]

function Icon({ name }: { name: string }) {
  const c = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'receipt':
      return <svg {...c}><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-18Z" /><path d="M9 8h6M9 12h6" /></svg>
    case 'file':
      return <svg {...c}><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v4h4" /></svg>
    case 'user':
      return <svg {...c}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" /></svg>
    case 'wallet':
      return <svg {...c}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1.2" /></svg>
    default:
      return null
  }
}

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-2.5 rounded-xl border border-[#E4DFD3] bg-white px-4 py-3.5 font-[family-name:var(--font-body)] text-sm font-semibold text-[#12211D] transition hover:border-[#1B4B43] hover:bg-[#1B4B43]/5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12211D] text-[#D9A536]">
            <Icon name={action.icon} />
          </div>
          <span className="truncate">{action.label}</span>
        </Link>
      ))}
    </div>
  )
}
