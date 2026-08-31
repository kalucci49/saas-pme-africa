const styles: Record<string, string> = {
  'payée': 'bg-[#1B4B43]/10 text-[#123B33]',
  'encaissé': 'bg-[#1B4B43]/10 text-[#123B33]',
  'envoyée': 'bg-[#D9A536]/15 text-[#8A5A12]',
  'en attente': 'bg-[#D9A536]/15 text-[#8A5A12]',
  'brouillon': 'bg-[#12211D]/8 text-[#5C594F]',
  'en retard': 'bg-[#B3431E]/12 text-[#B3431E]',
  'impayée': 'bg-[#B3431E]/12 text-[#B3431E]',
}

export default function StatusBadge({ status }: { status: string }) {
  const cls = styles[status.toLowerCase()] ?? 'bg-[#12211D]/8 text-[#5C594F]'
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 font-[family-name:var(--font-body)] text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  )
}
