'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navGroups = [
  {
    title: 'Principal',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: 'home' }],
  },
  {
    title: 'Ventes',
    items: [
      { href: '/dashboard/invoices', label: 'Ventes & Facturation', icon: 'receipt' },
      { href: '/dashboard/clients', label: 'Clients', icon: 'users' },
    ],
  },
  {
    title: 'Opérations',
    items: [
      { href: '/dashboard/catalog', label: 'Catalogue & Stock', icon: 'box' },
      { href: '/dashboard/purchases', label: 'Achats & Fournisseurs', icon: 'truck' },
    ],
  },
  {
    title: 'Pilotage',
    items: [
      { href: '/dashboard/treasury', label: 'Trésorerie & Dépenses', icon: 'wallet' },
      { href: '/dashboard/reports', label: 'Rapports', icon: 'chart' },
    ],
  },
  {
    title: 'Business',
    items: [
      { href: '/dashboard/properties', label: 'Immobilier', icon: 'building' },
      { href: '/dashboard/projects', label: 'Projets', icon: 'folder' },
    ],
  },
  {
    title: 'Intelligence',
    items: [{ href: '/dashboard/assistant', label: 'Assistant IA', icon: 'spark' }],
  },
]

function Icon({ name }: { name: string }) {
  const c = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'home':
      return <svg {...c}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>
    case 'receipt':
      return <svg {...c}><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-18Z" /><path d="M9 8h6M9 12h6" /></svg>
    case 'users':
      return <svg {...c}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M15.8 14.2c2.7.4 4.7 2.4 4.7 5.3" /></svg>
    case 'box':
      return <svg {...c}><path d="m3.5 8 8.5-4 8.5 4-8.5 4-8.5-4Z" /><path d="M3.5 8v8l8.5 4 8.5-4V8" /><path d="M12 12v8" /></svg>
    case 'truck':
      return <svg {...c}><path d="M2 7h11v9H2z" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="6.5" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
    case 'wallet':
      return <svg {...c}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1.2" /></svg>
    case 'chart':
      return <svg {...c}><path d="M4 20V10M12 20V4M20 20v-7" /></svg>
    case 'building':
      return <svg {...c}><rect x="4" y="3" width="10" height="18" /><path d="M14 8h6v13h-6" /><path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1" /></svg>
    case 'folder':
      return <svg {...c}><path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" /></svg>
    case 'spark':
      return <svg {...c}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /><circle cx="12" cy="12" r="2.5" /></svg>
    case 'menu':
      return <svg {...c}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'close':
      return <svg {...c}><path d="M6 6l12 12M18 6 6 18" /></svg>
    default:
      return null
  }
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#12211D" />
      <path d="M16 7 L21 22 L16 19 L11 22 Z" fill="#D9A536" />
    </svg>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-2">
        <Logo size={30} />
        <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-[#12211D]">
          Faro
        </span>
      </div>

      <nav className="mt-7 flex-1 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 px-3 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-wide text-[#12211D]/35">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-[family-name:var(--font-body)] text-[14px] transition ${
                      active
                        ? 'bg-[#12211D] font-semibold text-[#FAF7F2]'
                        : 'font-medium text-[#12211D]/60 hover:bg-[#12211D]/5 hover:text-[#12211D]'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#E4DFD3] pt-4">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 font-[family-name:var(--font-body)] text-[14px] font-medium text-[#12211D]/60 transition hover:bg-[#12211D]/5 hover:text-[#12211D]"
        >
          Paramètres
        </Link>
      </div>
    </>
  )
}

export default function DashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
  orgName?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const userName = userEmail.split('@')[0]

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E4DFD3] bg-[#FAF7F2] px-4 py-6 lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex w-72 flex-col bg-[#FAF7F2] px-4 py-6">
            <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-4 text-[#12211D]/50">
              <Icon name="close" />
            </button>
            <SidebarContent pathname={pathname} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[#E4DFD3] bg-white px-5 py-3.5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="shrink-0 text-[#12211D] lg:hidden">
              <Icon name="menu" />
            </button>

            <div className="flex min-w-0 items-center gap-2">
              <Logo size={26} />
              <span className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold text-[#12211D]">
                Faro
              </span>
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#FAF7F2]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12211D] font-[family-name:var(--font-body)] text-sm font-semibold text-[#FAF7F2]">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden font-[family-name:var(--font-body)] text-sm font-medium text-[#12211D] sm:inline">
                {userName}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#E4DFD3] bg-white p-1.5 shadow-lg">
                <p className="truncate px-2.5 py-2 font-[family-name:var(--font-body)] text-xs text-[#12211D]/50">
                  {userEmail}
                </p>
                <button
                  onClick={handleSignOut}
                  className="w-full rounded-md px-2.5 py-2 text-left font-[family-name:var(--font-body)] text-sm font-medium text-[#B3431E] transition hover:bg-[#FAF7F2]"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  )
}
