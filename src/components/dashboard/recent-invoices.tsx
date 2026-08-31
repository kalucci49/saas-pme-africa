'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatFCFA, formatDate } from '@/lib/format'
import StatusBadge from '@/components/dashboard/status-badge'

type Invoice = {
  id: string
  client: string
  phone: string
  ref: string
  type: string
  amount: number
  date: string
  status: string
}

const initialInvoices: Invoice[] = [
  { id: '1', client: 'Boutique Awa', phone: '+225 07 01 23 45', ref: 'FAC-0042', type: 'Facture', amount: 185000, date: '2026-08-27', status: 'payée' },
  { id: '2', client: 'Nike Distribution CI', phone: '+225 05 44 12 09', ref: 'FAC-0041', type: 'Facture', amount: 940000, date: '2026-08-25', status: 'envoyée' },
  { id: '3', client: 'Restaurant Le Baobab', phone: '+225 01 88 76 32', ref: 'FAC-0038', type: 'Facture', amount: 62000, date: '2026-08-22', status: 'en retard' },
  { id: '4', client: 'Pharmacie Centrale', phone: '+225 07 90 11 22', ref: 'FAC-0037', type: 'Facture', amount: 410000, date: '2026-08-20', status: 'payée' },
  { id: '5', client: 'Atelier Coutures Fatou', phone: '+225 05 33 67 18', ref: 'DEV-0019', type: 'Devis', amount: 97000, date: '2026-08-18', status: 'brouillon' },
]

const statusOptions = ['payée', 'envoyée', 'en retard', 'brouillon']

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}

function RowMenu({
  invoice,
  onChangeStatus,
  onDelete,
}: {
  invoice: Invoice
  onChangeStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-[#12211D]/50 transition hover:bg-[#FAF7F2] hover:text-[#12211D]"
      >
        <DotsIcon />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-[#E4DFD3] bg-white p-1.5 shadow-lg">
            <p className="px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-wide text-[#12211D]/40">
              Changer le statut
            </p>
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChangeStatus(invoice.id, s)
                  setOpen(false)
                }}
                className="block w-full rounded-md px-2.5 py-1.5 text-left font-[family-name:var(--font-body)] text-sm capitalize text-[#12211D] transition hover:bg-[#FAF7F2]"
              >
                {s}
              </button>
            ))}
            <div className="my-1 h-px bg-[#E4DFD3]" />
            <button
              onClick={() => {
                onDelete(invoice.id)
                setOpen(false)
              }}
              className="block w-full rounded-md px-2.5 py-1.5 text-left font-[family-name:var(--font-body)] text-sm font-medium text-[#B3431E] transition hover:bg-[#FBE4DD]/50"
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function RecentInvoices() {
  const [invoices, setInvoices] = useState(initialInvoices)

  function handleChangeStatus(id: string, status: string) {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)))
  }

  function handleDelete(id: string) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  return (
    <div className="rounded-2xl border border-[#E4DFD3] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#12211D]">
          Factures récentes
        </h3>
        <Link
          href="/dashboard/invoices"
          className="rounded-full border border-[#12211D] px-3.5 py-1.5 font-[family-name:var(--font-body)] text-sm font-semibold text-[#12211D] transition-all duration-150 hover:bg-[#12211D] hover:text-[#FAF7F2] active:scale-95"
        >
          Voir tout
        </Link>
      </div>

      <div className="divide-y divide-[#E4DFD3] sm:hidden">
        {invoices.map((t) => (
          <div key={t.id} className="py-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#12211D]">
                {t.client}
              </span>
              <div className="flex items-center gap-1">
                <StatusBadge status={t.status} />
                <RowMenu invoice={t} onChangeStatus={handleChangeStatus} onDelete={handleDelete} />
              </div>
            </div>
            <p className="mt-0.5 font-[family-name:var(--font-body)] text-xs text-[#12211D]/45">{t.phone}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-[family-name:var(--font-body)] text-xs text-[#12211D]/50">
                {t.type} · {t.ref}
              </span>
              <span className="font-[family-name:var(--font-body)] text-sm tabular-nums text-[#12211D]/70">
                {formatFCFA(t.amount)}
              </span>
            </div>
            <p className="mt-0.5 font-[family-name:var(--font-body)] text-xs text-[#12211D]/40">
              {formatDate(t.date)}
            </p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left font-[family-name:var(--font-body)] text-sm">
          <thead>
            <tr className="border-b border-[#E4DFD3] text-[#12211D]/50">
              <th className="pb-2.5 font-medium">Client</th>
              <th className="pb-2.5 font-medium">Téléphone</th>
              <th className="pb-2.5 font-medium">Montant</th>
              <th className="pb-2.5 font-medium">Date</th>
              <th className="pb-2.5 font-medium">Statut</th>
              <th className="pb-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((t) => (
              <tr key={t.id} className="border-b border-[#E4DFD3] last:border-0">
                <td className="py-3.5">
                  <p className="font-medium text-[#12211D]">{t.client}</p>
                  <p className="text-xs text-[#12211D]/45">{t.type} · {t.ref}</p>
                </td>
                <td className="py-3.5 text-[#12211D]/70">{t.phone}</td>
                <td className="py-3.5 tabular-nums text-[#12211D]">{formatFCFA(t.amount)}</td>
                <td className="py-3.5 text-[#12211D]/60">{formatDate(t.date)}</td>
                <td className="py-3.5"><StatusBadge status={t.status} /></td>
                <td className="py-3.5 text-right">
                  <RowMenu invoice={t} onChangeStatus={handleChangeStatus} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
