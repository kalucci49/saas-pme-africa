"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  Send,
  Save,
  Info,
  Eye,
  EyeOff,Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Données fictives — remplace par ton fetch Supabase (clients de l'organisation,
// prochain numéro depuis organization_settings, infos de l'organisation)
// ---------------------------------------------------------------------------
const CLIENTS = [
  "Boutique Awa",
  "Nike Distribution CI",
  "Restaurant Le Baobab",
  "Pharmacie Centrale",
  "Atelier Coutures Fatou",
];

const NEXT_INVOICE_NUMBER = "FAC-2026-0037";
const TVA_RATE = 0.18;

const ORG = {
  name: "Faro SARL",
  email: "contact@faro.ci",
  city: "Abidjan, Côte d'Ivoire",
};

type LineItem = {
  id: string;
  description: string;
  amount: number;
};

function newLine(): LineItem {
  return { id: crypto.randomUUID(), description: "", amount: 0 };
}

const FCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function formatDateLong(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

const UNITES = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

function centainesEnLettres(n: number): string {
  if (n === 0) return "";
  if (n < 20) return UNITES[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    if (d === 7 || d === 9) {
      return DIZAINES[d - 1] + "-" + UNITES[10 + u];
    }
    return DIZAINES[d] + (u > 0 ? (u === 1 && d !== 8 ? "-et-un" : "-" + UNITES[u]) : "");
  }
  const c = Math.floor(n / 100);
  const reste = n % 100;
  const prefix = c === 1 ? "cent" : UNITES[c] + " cent";
  return prefix + (reste > 0 ? " " + centainesEnLettres(reste) : c > 1 ? "s" : "");
}

function nombreEnLettres(n: number): string {
  if (n === 0) return "zéro";
  const milliards = Math.floor(n / 1000000000);
  const millions = Math.floor((n % 1000000000) / 1000000);
  const milliers = Math.floor((n % 1000000) / 1000);
  const reste = n % 1000;
  const parts: string[] = [];
  if (milliards > 0) parts.push((milliards === 1 ? "un" : centainesEnLettres(milliards)) + " milliard" + (milliards > 1 ? "s" : ""));
  if (millions > 0) parts.push((millions === 1 ? "un" : centainesEnLettres(millions)) + " million" + (millions > 1 ? "s" : ""));
  if (milliers > 0) parts.push(milliers === 1 ? "mille" : centainesEnLettres(milliers) + " mille");
  if (reste > 0) parts.push(centainesEnLettres(reste));
  return parts.join(" ");
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Brouillon: "bg-amber-50 text-amber-700 ring-amber-200",
    Payée: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "En attente": "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${styles[status] ?? styles.Brouillon}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function InvoicePreview({
  orgName,
  orgAddress,
  orgPhone,
  orgIfu,
  orgRccm,
  orgIce,
  clientName,
  issueDate,
  dueDate,
  lines,
  subtotal,
  tva,
  total,
  note,
}: {
  orgName: string;
  orgAddress: string;
  orgPhone: string;
  orgIfu: string;
  orgRccm: string;
  orgIce: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  lines: LineItem[];
  subtotal: number;
  tva: number;
  total: number;
  note: string;
}) {
  const filledLines = lines.filter((l) => l.description.trim() !== "" || l.amount > 0);

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/50 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg">
            {orgName ? orgName.charAt(0) : "?"}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-ink sm:text-2xl">FACTURE</h2>
            <p className="mt-0.5 truncate text-xs text-gray-400">{orgName || "Votre entreprise"}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
          <p className="text-sm font-semibold tabular-nums text-ink">{NEXT_INVOICE_NUMBER}</p>
          <StatusBadge status="Brouillon" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-y border-gray-100 py-3 text-[11px] sm:grid-cols-3">
        <div>
          <p className="text-gray-400">Date d'émission</p>
          <p className="mt-0.5 font-medium text-ink">{formatDateLong(issueDate)}</p>
        </div>
        <div>
          <p className="text-gray-400">Date d'échéance</p>
          <p className="mt-0.5 font-medium text-ink">{formatDateLong(dueDate)}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-gray-400">Mode de paiement</p>
          <p className="mt-0.5 font-medium text-ink">Virement / Mobile Money</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Émetteur</p>
          <p className="mt-1.5 text-sm font-semibold text-ink">{orgName || "—"}</p>
          {orgAddress && <p className="mt-0.5 text-xs text-muted">{orgAddress}</p>}
          {orgPhone && <p className="text-xs text-muted">{orgPhone}</p>}
          <div className="mt-2 space-y-0.5 text-[11px] text-gray-400">
            {orgIfu && <p>IFU : {orgIfu}</p>}
            {orgRccm && <p>N° RCCM : {orgRccm}</p>}
            {orgIce && <p>ICE : {orgIce}</p>}
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Client</p>
          <p className="mt-1.5 text-sm font-semibold text-ink">{clientName || "Sélectionner un client"}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">Désignation</th>
                <th className="px-3 py-2.5 text-right">Qté</th>
                <th className="px-3 py-2.5 text-right">PU HT</th>
                <th className="px-3 py-2.5 text-right">TVA</th>
                <th className="px-3 py-2.5 text-right">Montant HT</th>
              </tr>
            </thead>
            <tbody>
              {filledLines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-xs text-gray-300">
                    Aucune ligne renseignée
                  </td>
                </tr>
              ) : (
                filledLines.map((l, i) => (
                  <tr key={l.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-3 py-3 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-3 py-3 text-ink">{l.description || "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">1</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">{FCFA(l.amount)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">{TVA_RATE * 100}%</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-ink">{FCFA(l.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 ml-auto flex max-w-[280px] flex-col gap-2">
        <div className="flex justify-between text-xs text-muted">
          <span>Total HT</span>
          <span className="tabular-nums">{FCFA(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Total TVA (18%)</span>
          <span className="tabular-nums">{FCFA(tva)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white">
          <span className="text-sm font-medium">Total TTC</span>
          <span className="text-base font-semibold tabular-nums">{FCFA(total)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-gray-50/60 p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Arrêté en lettres</p>
        <p className="mt-1 text-xs capitalize italic leading-relaxed text-ink">
          {nombreEnLettres(Math.round(total))} francs CFA toutes taxes comprises
        </p>
      </div>

      {note.trim() !== "" && (
        <p className="mt-5 text-xs italic leading-relaxed text-muted">{note}</p>
      )}
    </div>
  );
}

function SendConfirm({
  clientName,
  onCancel,
  onConfirm,
  isSending,
}: {
  clientName: string;
  onCancel: () => void;
  isSending: boolean;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-info-soft text-info">
            <Info size={16} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink">Envoyer la facture ?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              La facture sera envoyée par email à <span className="font-medium text-ink">{clientName}</span> et
              passera au statut &quot;Envoyée&quot;. Cette action déclenche un envoi réel.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted hover:bg-cream">
<button onClick={onConfirm} disabled={isSending} className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white hover:bg-ink-hover disabled:opacity-60">
    {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
      {isSending ? "Envoi..." : "Confirmer l&apos;envoi"}
      </button>
            Confirmer l&apos;envoi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  const [client, setClient] = useState("");
  const [issueDate, setIssueDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(addDaysISO(15));
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<LineItem[]>([newLine()]);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [orgName, setOrgName] = useState(ORG.name);
  const [orgAddress, setOrgAddress] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgIfu, setOrgIfu] = useState("");
  const [orgRccm, setOrgRccm] = useState("");
  const [orgIce, setOrgIce] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("faro_org_name") : null;
    if (saved) setOrgName(saved);
    if (typeof window !== "undefined") {
      setOrgAddress(localStorage.getItem("faro_org_address") || "");
      setOrgPhone(localStorage.getItem("faro_org_phone") || "");
      setOrgIfu(localStorage.getItem("faro_org_ifu") || "");
      setOrgRccm(localStorage.getItem("faro_org_rccm") || "");
      setOrgIce(localStorage.getItem("faro_org_ice") || "");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("faro_org_name", orgName);
  }, [orgName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("faro_org_address", orgAddress);
    localStorage.setItem("faro_org_phone", orgPhone);
    localStorage.setItem("faro_org_ifu", orgIfu);
    localStorage.setItem("faro_org_rccm", orgRccm);
    localStorage.setItem("faro_org_ice", orgIce);
  }, [orgAddress, orgPhone, orgIfu, orgRccm, orgIce]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromQuote = params.get("fromQuote");
    if (!fromQuote) return;
    const raw = localStorage.getItem("faro_quote_to_convert");
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as { client?: string; amount?: number; note?: string };
      if (data.client) setClient(data.client);
      if (data.note) setNote(data.note);
      setLines([
        {
          id: crypto.randomUUID(),
          description: data.note || ("Converti depuis le devis " + fromQuote),
          amount: data.amount || 0,
        },
      ]);
    } catch {}
    localStorage.removeItem("faro_quote_to_convert");
  }, []);

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };
  const addLine = () => setLines((prev) => [...prev, newLine()]);
  const removeLine = (id: string) => setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.amount, 0), [lines]);
  const tva = subtotal * TVA_RATE;
  const total = subtotal + tva;

  const canSubmit = client.trim() !== "" && lines.some((l) => l.description.trim() !== "" && l.amount > 0);

  const handleSaveDraft = () => {
    setSavedMessage("Brouillon enregistré.");
    setTimeout(() => setSavedMessage(null), 3000);
  };
  const handleSend = () => {
      setIsSending(true);
          setTimeout(() => {
                setIsSending(false);
                      setShowSendConfirm(false);
                            setSavedMessage("Facture envoyée à " + client + ".");
                                  setTimeout(() => setSavedMessage(null), 3000);
                                      }, 800);
                                        };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-[26px] font-semibold tracking-tight text-ink">Nouvelle facture</h1>
            <p className="mt-1 text-sm text-[#8A8577]">Numéro {NEXT_INVOICE_NUMBER}</p>
  
          </div>
          <button
            onClick={() => setShowPreviewMobile((v) => !v)}
            className="flex shrink-0 items-center justify-center gap-1.5 self-start rounded-md border border-line bg-white px-2.5 py-1.5 text-[11px] font-medium text-ink shadow-sm transition-all duration-150 hover:bg-ink hover:text-white active:scale-95 lg:hidden"
          >
            {showPreviewMobile ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPreviewMobile ? "Masquer l'aperçu" : "Voir l'aperçu"}
          </button>
        </div>

        {showPreviewMobile && (
          <div className="mb-5 lg:hidden">
            <InvoicePreview
              orgName={orgName}
            orgAddress={orgAddress}
            orgPhone={orgPhone}
            orgIfu={orgIfu}
            orgRccm={orgRccm}
            orgIce={orgIce}
              clientName={client}
              issueDate={issueDate}
              dueDate={dueDate}
              lines={lines}
              subtotal={subtotal}
              tva={tva}
              total={total}
              note={note}
            />
          </div>
        )}

        {savedMessage && (
          <div className="mb-4 rounded-xl bg-success-soft px-4 py-3 text-sm font-medium text-success">
            {savedMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_420px]">
          {/* Colonne formulaire */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <div className="mb-5 rounded-2xl border border-line bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-ink">Émetteur</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Nom de l'entreprise" className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink sm:col-span-2" />
                <input value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} placeholder="Adresse" className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink sm:col-span-2" />
                <input value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} placeholder="Téléphone" className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink" />
                <input value={orgIfu} onChange={(e) => setOrgIfu(e.target.value)} placeholder="IFU" className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink" />
                <input value={orgRccm} onChange={(e) => setOrgRccm(e.target.value)} placeholder="N° RCCM" className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink" />
                <input value={orgIce} onChange={(e) => setOrgIce(e.target.value)} placeholder="ICE" className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Client</label>
                  <div className="relative">
                    <select
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-line bg-white py-2.5 pl-3 pr-9 text-sm text-ink outline-none focus:border-ink"
                    >
                      <option value="">Sélectionner...</option>
                      {CLIENTS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A093]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Date d&apos;émission</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white py-2.5 px-3 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Date d&apos;échéance</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white py-2.5 px-3 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-ink">Lignes de facture</h2>

              <div className="mt-3 hidden grid-cols-[1fr_140px_32px] gap-2 px-1 text-xs font-medium text-[#8A8577] sm:grid">
                <span>Description</span>
                <span className="text-right">Montant</span>
                <span />
              </div>

              <div className="mt-2 flex flex-col gap-2.5">
                {lines.map((line) => (
                  <div key={line.id} className="grid grid-cols-1 gap-2 rounded-xl border border-[#F0EDE3] p-2.5 sm:grid-cols-[1fr_140px_32px] sm:items-center sm:border-0 sm:p-0">
                    <input
                      value={line.description}
                      onChange={(e) => updateLine(line.id, { description: e.target.value })}
                      placeholder="Description de l'article ou du service"
                      className="rounded-lg border border-line bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-ink"
                    />
                    <input
                      type="number"
                      min={0}
                      value={line.amount}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateLine(line.id, { amount: Number(e.target.value) })}
                      placeholder="Montant"
                      className="rounded-lg border border-line bg-white px-2.5 py-2 text-right text-sm text-ink outline-none focus:border-ink"
                    />
                    <button
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length === 1}
                      className="flex items-center gap-1.5 self-end rounded-lg p-1.5 text-[#A6A093] hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#A6A093] sm:self-auto"
                    >
                      <Trash2 size={15} />
                      <span className="text-xs font-medium sm:hidden">Supprimer la ligne</span>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addLine}
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-xs font-medium text-muted hover:bg-cream"
              >
                <Plus size={14} />
                Ajouter une ligne
              </button>

              <div className="mt-5 ml-auto flex max-w-xs flex-col gap-1.5 border-t border-[#F0EDE3] pt-4">
                <div className="flex justify-between text-sm text-muted">
                  <span>Sous-total</span>
                  <span className="tabular-nums">{FCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted">
                  <span>TVA (18%)</span>
                  <span className="tabular-nums">{FCFA(tva)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-[#F0EDE3] pt-1.5 text-base font-semibold text-ink">
                  <span>Total TTC</span>
                  <span className="tabular-nums">{FCFA(total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <label className="mb-1.5 block text-xs font-medium text-muted">Note ou condition de paiement (optionnel)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Ex. Paiement à réception, virement uniquement..."
                className="w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                onClick={handleSaveDraft}
                disabled={!canSubmit}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save size={15} />
                Sauvegarder comme brouillon
              </button>
              <button
                onClick={() => setShowSendConfirm(true)}
                disabled={!canSubmit}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
                Envoyer
              </button>
            </div>
          </div>

          {/* Colonne aperçu — visible uniquement sur desktop (version mobile au-dessus) */}
          <div className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
            <InvoicePreview
              orgName={orgName}
            orgAddress={orgAddress}
            orgPhone={orgPhone}
            orgIfu={orgIfu}
            orgRccm={orgRccm}
            orgIce={orgIce}
              clientName={client}
              issueDate={issueDate}
              dueDate={dueDate}
              lines={lines}
              subtotal={subtotal}
              tva={tva}
              total={total}
              note={note}
            />
          </div>
        </div>
      </div>

      {showSendConfirm && (
        <SendConfirm clientName={client} onCancel={() => setShowSendConfirm(false)} onConfirm={handleSend} />isSending={isSending}
      )}
    </div>
  );
}
