"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FileText,
  TrendingUp,
  AlertTriangle,
  Wallet,
  MoreVertical,
  Eye,
  RefreshCw,
  Copy,
  Trash2,
  ChevronLeft,
  X,
} from "lucide-react";

type InvoiceStatus =
  | "brouillon"
  | "envoyee"
  | "vue"
  | "partiellement_payee"
  | "payee"
  | "en_retard"
  | "annulee";

type Invoice = {
  id: string;
  number: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  paidAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
};

const INITIAL_INVOICES: Invoice[] = [
  { id: "1", number: "FAC-2026-0031", client: "Boutique Awa", issueDate: "2026-08-05", dueDate: "2026-08-20", amount: 250000, status: "payee" },
  { id: "2", number: "FAC-2026-0032", client: "Nike Distribution CI", issueDate: "2026-08-10", dueDate: "2026-08-25", amount: 1840000, status: "en_retard" },
  { id: "3", number: "FAC-2026-0033", client: "Restaurant Le Baobab", issueDate: "2026-08-15", dueDate: "2026-08-30", amount: 95000, status: "envoyee" },
  { id: "4", number: "FAC-2026-0034", client: "Pharmacie Centrale", issueDate: "2026-08-18", dueDate: "2026-09-02", amount: 620000, status: "vue" },
  { id: "5", number: "FAC-2026-0035", client: "Atelier Coutures Fatou", issueDate: "2026-08-20", dueDate: "2026-09-04", amount: 97000, status: "partiellement_payee" },
  { id: "6", number: "FAC-2026-0036", client: "Boutique Awa", issueDate: "2026-08-22", dueDate: "2026-09-06", amount: 340000, status: "brouillon" },
  { id: "7", number: "FAC-2026-0030", client: "Nike Distribution CI", issueDate: "2026-07-28", dueDate: "2026-08-12", amount: 410000, status: "annulee" },
];

const FCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  vue: "Vue",
  partiellement_payee: "Partiellement payée",
  payee: "Payée",
  en_retard: "En retard",
  annulee: "Annulée",
};
const STATUS_ORDER: InvoiceStatus[] = ["brouillon", "envoyee", "vue", "partiellement_payee", "payee", "en_retard", "annulee"];

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    brouillon: "bg-[#EEECE7] text-muted",
    envoyee: "bg-info-soft text-info",
    vue: "bg-accent-soft text-accent",
    partiellement_payee: "bg-warning-soft text-warning",
    payee: "bg-success-soft text-success",
    en_retard: "bg-danger-soft text-danger",
    annulee: "bg-[#EEECE7] text-muted line-through",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone = "default",
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
  onClick?: () => void;
}) {
  const toneStyles = {
    default: { border: "border-line", bg: "bg-white", icon: "text-[#8A8577]", value: "text-ink" },
    success: { border: "border-success/30", bg: "bg-success-soft", icon: "text-success", value: "text-ink" },
    danger: { border: "border-danger/30", bg: "bg-danger-soft", icon: "text-danger", value: "text-ink" },
  }[tone];
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-transform duration-150 active:scale-[0.96] ${toneStyles.border} ${toneStyles.bg}`}
    >
      <div className={`flex items-center gap-2 ${toneStyles.icon}`}>
        <Icon size={15} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`mt-2 text-xl font-semibold ${toneStyles.value}`}>{value}</div>
    </button>
  );
}

const FILTERS: { key: "tous" | InvoiceStatus; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "brouillon", label: "Brouillon" },
  { key: "envoyee", label: "Envoyée" },
  { key: "payee", label: "Payée" },
  { key: "en_retard", label: "En retard" },
];

function RowMenu({
  invoice,
  onClose,
  onPreview,
  onDuplicate,
  onChangeStatus,
  onRequestRemove,
}: {
  invoice: Invoice;
  onClose: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onChangeStatus: (status: InvoiceStatus) => void;
  onRequestRemove: () => void;
}) {
  const [statusOpen, setStatusOpen] = useState(false);

  if (statusOpen) {
    return (
      <div className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
        <button
          onClick={() => setStatusOpen(false)}
          className="flex w-full items-center gap-2 border-b border-[#EEEBE3] px-3.5 py-2.5 text-left text-xs font-medium text-muted hover:bg-cream"
        >
          <ChevronLeft size={14} />
          Retour
        </button>
        {STATUS_ORDER.filter((s) => s !== invoice.status && s !== "vue").map((s) => (
          <button
            key={s}
            onClick={() => {
              onChangeStatus(s);
              onClose();
            }}
            className="flex w-full items-center px-3.5 py-2.5 text-left text-sm text-ink hover:bg-cream"
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-xl border border-line bg-white shadow-lg"
      onMouseLeave={onClose}
    >
      <button
        onClick={() => {
          onPreview();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink hover:bg-cream"
      >
        <Eye size={15} className="text-[#8A8577]" />
        Aperçu
      </button>
      <button
        onClick={() => setStatusOpen(true)}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink hover:bg-cream"
      >
        <RefreshCw size={15} className="text-[#8A8577]" />
        Changer le statut
      </button>
      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink hover:bg-cream"
      >
        <Copy size={15} className="text-[#8A8577]" />
        Dupliquer
      </button>
      <div className="h-px bg-[#EEEBE3]" />
      <button
        onClick={() => {
          onRequestRemove();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-danger hover:bg-danger-soft"
      >
        <Trash2 size={15} />
        Supprimer
      </button>
    </div>
  );
}

function PreviewModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">{invoice.number}</h3>
            <p className="mt-0.5 text-sm text-muted">{invoice.client}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#A6A093] hover:bg-cream">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2 rounded-xl bg-cream p-3.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Émission</span>
            <span className="text-ink">{formatDate(invoice.issueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Échéance</span>
            <span className="text-ink">{formatDate(invoice.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Montant</span>
            <span className="font-semibold tabular-nums text-ink">{FCFA(invoice.amount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Statut</span>
            <StatusBadge status={invoice.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ invoice, onCancel, onConfirm }: { invoice: Invoice; onCancel: () => void; onConfirm: (paidAmount: number, method: string, date: string) => void }) {
  const [amount, setAmount] = useState(String(invoice.amount));
  const [method, setMethod] = useState("Virement bancaire");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-ink">Enregistrer le paiement</h3>
        <p className="mt-1 text-xs text-muted">Facture {invoice.number} — {invoice.client}</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Montant reçu (FCFA)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Méthode de paiement</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            >
              <option>Virement bancaire</option>
              <option>Espèces</option>
              <option>Carte bancaire</option>
              <option>Mobile Money</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Date du paiement</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink hover:bg-cream">
            Annuler
          </button>
          <button
            onClick={() => onConfirm(Number(amount) || 0, method, date)}
            className="rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-transform active:scale-95"
          >
            Confirmer le paiement
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRemoveModal({
  invoice,
  onCancel,
  onConfirm,
}: {
  invoice: Invoice;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-ink">Supprimer {invoice.number} ?</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Cette action est définitive et ne peut pas être annulée.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted hover:bg-cream">
            Annuler
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-danger px-3.5 py-2 text-sm font-medium text-white hover:bg-[#7C2B18]">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"tous" | InvoiceStatus>("tous");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [pendingRemove, setPendingRemove] = useState<Invoice | null>(null);
  const [pendingPayment, setPendingPayment] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return invoices.filter((inv) => {
      const matchesQuery = inv.client.toLowerCase().includes(q) || inv.number.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "tous" || inv.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [invoices, query, statusFilter]);

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = invoices.filter((i) => i.status === "payee").reduce((s, i) => s + i.amount, 0);
  const totalLate = invoices.filter((i) => i.status === "en_retard").reduce((s, i) => s + i.amount, 0);

  const handleChangeStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const handleRecordPayment = (id: string, paidAmount: number, paymentMethod: string, paymentDate: string) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: "payee", paidAmount, paymentMethod, paymentDate } : i)));
    setPendingPayment(null);
  };

  const handleDuplicate = (invoice: Invoice) => {
    const copy: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      number: `${invoice.number}-COPIE`,
      status: "brouillon",
    };
    setInvoices((prev) => [copy, ...prev]);
  };

  const handleConfirmRemove = () => {
    if (!pendingRemove) return;
    setInvoices((prev) => prev.filter((i) => i.id !== pendingRemove.id));
    setPendingRemove(null);
  };

  return (
    <div className="min-h-screen bg-cream pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-[26px] font-semibold tracking-tight text-ink">Factures</h1>
            <p className="mt-1 text-sm text-[#8A8577]">{invoices.length} factures enregistrées</p>
          </div>
          <Link
            href="/dashboard/invoices/new"
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-2 text-[11px] font-medium text-ink shadow-sm transition-all duration-150 active:scale-95 active:bg-ink active:text-white sm:w-auto sm:py-1.5"
          >
            <Plus size={12} />
            Nouvelle facture
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard icon={TrendingUp} label="Total facturé" value={FCFA(totalBilled)} />
          <SummaryCard icon={Wallet} label="Total encaissé" value={FCFA(totalCollected)} tone="success" />
          <SummaryCard icon={AlertTriangle} label="En retard" value={FCFA(totalLate)} tone="danger" />
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A093]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un client ou un numéro..."
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder-[#A6A093] outline-none focus:border-ink"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 active:scale-95 ${
                  statusFilter === f.key ? "bg-ink text-white" : "border border-line bg-white text-muted hover:bg-[#EEECE3]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-line bg-white/60 py-14 text-center">
            <FileText size={28} className="text-[#C7C1AF]" />
            <p className="mt-3 text-sm font-medium text-ink">Aucune facture ne correspond</p>
            <p className="mt-1 text-xs text-[#8A8577]">Essaie un autre nom ou change le filtre de statut.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-line bg-white sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EEEBE3] text-left text-xs font-medium text-[#8A8577]">
                  <th className="px-4 py-3 font-medium">Numéro</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Émission</th>
                  <th className="px-4 py-3 font-medium">Échéance</th>
                  <th className="px-4 py-3 text-right font-medium">Montant</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#F3F1EA] last:border-0 hover:bg-[#FAF8F3]">
                    <td className="px-4 py-3.5 font-medium text-ink">{inv.number}</td>
                    <td className="px-4 py-3.5 text-muted">{inv.client}</td>
                    <td className="px-4 py-3.5 text-muted">{formatDate(inv.issueDate)}</td>
                    <td className="px-4 py-3.5 text-muted">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums font-medium text-ink">{FCFA(inv.amount)}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="relative px-4 py-3.5">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                        className="rounded-lg p-1.5 text-[#A6A093] hover:bg-[#EEECE3] hover:text-ink"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === inv.id && (
                        <RowMenu
                          invoice={inv}
                          onClose={() => setOpenMenuId(null)}
                          onPreview={() => setPreviewInvoice(inv)}
                          onDuplicate={() => handleDuplicate(inv)}
                          onChangeStatus={(status) => {
                      if (status === "payee") {
                        setPendingPayment(inv);
                      } else {
                        handleChangeStatus(inv.id, status);
                      }
                    }}
                          onRequestRemove={() => setPendingRemove(inv)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-5 flex flex-col gap-2.5 sm:hidden">
            {filtered.map((inv) => (
              <div key={inv.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-ink">{inv.number}</div>
                    <div className="text-xs text-[#8A8577]">{inv.client}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={inv.status} />
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                        className="rounded-lg p-1.5 text-[#A6A093] hover:bg-[#EEECE3]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === inv.id && (
                        <RowMenu
                          invoice={inv}
                          onClose={() => setOpenMenuId(null)}
                          onPreview={() => setPreviewInvoice(inv)}
                          onDuplicate={() => handleDuplicate(inv)}
                          onChangeStatus={(status) => {
                      if (status === "payee") {
                        setPendingPayment(inv);
                      } else {
                        handleChangeStatus(inv.id, status);
                      }
                    }}
                          onRequestRemove={() => setPendingRemove(inv)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#F3F1EA] pt-3 text-xs text-[#8A8577]">
                  <span>Échéance {formatDate(inv.dueDate)}</span>
                  <span className="text-sm font-semibold tabular-nums text-ink">{FCFA(inv.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewInvoice && <PreviewModal invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />}
      {pendingRemove && (
        <ConfirmRemoveModal invoice={pendingRemove} onCancel={() => setPendingRemove(null)} onConfirm={handleConfirmRemove} />
      )}

      {pendingPayment && (
        <PaymentModal
          invoice={pendingPayment}
          onCancel={() => setPendingPayment(null)}
          onConfirm={(paidAmount, method, date) => handleRecordPayment(pendingPayment.id, paidAmount, method, date)}
        />
      )}
    </div>
  );
}
