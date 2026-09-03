"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, MoreVertical, Copy, Trash2, ArrowRight } from "lucide-react";

type QuoteStatus = "brouillon" | "envoye" | "accepte" | "refuse" | "expire";

const STATUS_ORDER: QuoteStatus[] = ["brouillon", "envoye", "accepte", "refuse", "expire"];
const STATUS_LABELS: Record<QuoteStatus, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
};
const STATUS_STYLES: Record<QuoteStatus, string> = {
  brouillon: "bg-[#EEECE7] text-muted",
  envoye: "bg-info-soft text-info",
  accepte: "bg-success-soft text-success",
  refuse: "bg-danger-soft text-danger",
  expire: "bg-[#EEECE7] text-muted line-through",
};

function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

type Quote = {
  id: string;
  number: string;
  client: string;
  issueDate: string;
  validUntil: string;
  amount: number;
  status: QuoteStatus;
};

const INITIAL_QUOTES: Quote[] = [
  { id: "1", number: "DEV-2026-0011", client: "Boutique Awa", issueDate: "2026-08-20", validUntil: "2026-09-05", amount: 180000, status: "envoye" },
  { id: "2", number: "DEV-2026-0012", client: "Nike Distribution CI", issueDate: "2026-08-22", validUntil: "2026-09-06", amount: 950000, status: "accepte" },
  { id: "3", number: "DEV-2026-0013", client: "Restaurant Le Baobab", issueDate: "2026-08-25", validUntil: "2026-09-10", amount: 60000, status: "brouillon" },
];

const FCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
const STORAGE_KEY = "faro_quotes";

function RowMenu({
  quote,
  onClose,
  onChangeStatus,
  onDuplicate,
  onConvert,
  onRequestRemove,
}: {
  quote: Quote;
  onClose: () => void;
  onChangeStatus: (status: QuoteStatus) => void;
  onDuplicate: () => void;
  onConvert: () => void;
  onRequestRemove: () => void;
}) {
  return (
    <div
      className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-xl border border-line bg-white shadow-lg"
      onMouseLeave={onClose}
    >
      {STATUS_ORDER.filter((s) => s !== quote.status).map((s) => (
        <button
          key={s}
          onClick={() => {
            onChangeStatus(s);
            onClose();
          }}
          className="flex w-full items-center px-3.5 py-2.5 text-left text-sm text-ink hover:bg-cream"
        >
          Marquer « {STATUS_LABELS[s]} »
        </button>
      ))}
      <div className="h-px bg-line" />
      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-ink hover:bg-cream"
      >
        <Copy size={15} className="text-muted" />
        Dupliquer
      </button>
      <button
        onClick={() => {
          onConvert();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-accent hover:bg-cream"
      >
        <ArrowRight size={15} />
        Convertir en facture
      </button>
      <div className="h-px bg-line" />
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

function ConfirmRemoveModal({ quote, onCancel, onConfirm }: { quote: Quote; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-ink">Supprimer {quote.number} ?</h3>
        <p className="mt-2 text-sm text-muted">Cette action est définitive et ne peut pas être annulée.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink hover:bg-cream">
            Annuler
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-danger px-3.5 py-2 text-sm font-medium text-white">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<Quote | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        setQuotes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  }, [quotes]);

  const handleChangeStatus = (id: string, status: QuoteStatus) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const handleDuplicate = (quote: Quote) => {
    const copy: Quote = { ...quote, id: crypto.randomUUID(), number: `${quote.number}-COPIE`, status: "brouillon" };
    setQuotes((prev) => [copy, ...prev]);
  };

  const handleConvert = (quote: Quote) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "faro_quote_to_convert",
        JSON.stringify({ client: quote.client, amount: quote.amount, note: `Converti depuis le devis ${quote.number}` })
      );
    }
    router.push("/dashboard/invoices/new?fromQuote=" + quote.number);
  };

  const handleConfirmRemove = () => {
    if (!pendingRemove) return;
    setQuotes((prev) => prev.filter((q) => q.id !== pendingRemove.id));
    setPendingRemove(null);
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[26px] font-semibold tracking-tight text-ink">Devis</h1>
            <p className="mt-1 text-sm text-muted-secondary">{quotes.length} devis enregistrés</p>
          </div>
          <Link
            href="/dashboard/quotes/new"
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-[11px] font-medium text-ink shadow-sm transition-all duration-150 active:scale-95 active:bg-ink active:text-white sm:w-auto"
          >
            <Plus size={12} />
            Nouveau devis
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white/60 py-14 text-center">
            <p className="text-sm text-muted-secondary">Aucun devis pour le moment</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {quotes.map((q) => (
              <div key={q.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{q.number}</p>
                    <p className="text-xs text-muted-secondary">{q.client}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={q.status} />
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === q.id ? null : q.id)}
                        className="rounded-lg p-1.5 text-muted-secondary hover:bg-[#EEECE7]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === q.id && (
                        <RowMenu
                          quote={q}
                          onClose={() => setOpenMenuId(null)}
                          onChangeStatus={(s) => handleChangeStatus(q.id, s)}
                          onDuplicate={() => handleDuplicate(q)}
                          onConvert={() => handleConvert(q)}
                          onRequestRemove={() => setPendingRemove(q)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#F0EDE3] pt-3 text-xs text-muted-secondary">
                  <span>Valide jusqu'au {new Date(q.validUntil).toLocaleDateString("fr-FR")}</span>
                  <span className="text-sm font-semibold tabular-nums text-ink">{FCFA(q.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingRemove && (
        <ConfirmRemoveModal quote={pendingRemove} onCancel={() => setPendingRemove(null)} onConfirm={handleConfirmRemove} />
      )}
    </div>
  );
}
