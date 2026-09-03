"use client";

type FicheData = {
  name: string;
  description: string;
  category?: string;
  price: number;
  tax_rate: number;
  image_url?: string | null;
  warranty?: string | null;
};

export function ProductFichePreview({
  data,
  orgName,
}: {
  data: FicheData;
  orgName: string;
}) {
  const priceTTC = data.price * (1 + data.tax_rate / 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* En-tête entreprise */}
      <div className="bg-[#12211D] text-white px-5 py-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A536" strokeWidth="1.5">
            <path d="M12 3v4M12 17v4M6 12l-2.5 2.5M18 6l2.5-2.5M8.5 8.5L6 6" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50">Fiche produit</p>
          <p className="text-sm font-semibold">{orgName || "Votre entreprise"}</p>
        </div>
      </div>

      {/* Photo */}
      <div className="w-full aspect-video bg-gray-50 border-b border-gray-100">
        {data.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            Aucune photo
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Titre + catégorie */}
        <div>
          {data.category && (
            <p className="text-[11px] uppercase tracking-wide text-[#D9A536] font-semibold mb-1">
              {data.category}
            </p>
          )}
          <h2 className="text-xl font-bold text-gray-900">{data.name || "Nom du produit"}</h2>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
        )}

        {/* Bandeau prix + garantie */}
        <div className="rounded-xl border border-[#F4EDD3] bg-[#FAF7F2] px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Prix unité HT</p>
            <p className="text-2xl font-bold text-[#12211D]">
              {data.price.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-xs text-gray-400">
              {priceTTC.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA TTC
            </p>
          </div>
          {data.warranty && (
            <div className="rounded-lg bg-[#12211D] text-white text-center px-3 py-2.5 flex flex-col items-center gap-1 shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D9A536" strokeWidth="1.8">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <p className="text-[10px] uppercase tracking-wide leading-tight">
                Garantie<br />{data.warranty}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
