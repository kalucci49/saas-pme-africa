export default function KpiCard({
  label,
  value,
  icon,
  trend,
  valueClassName,
}: {
  label: string
  value: string
  icon: React.ReactNode
  trend?: { direction: 'up' | 'down'; label: string }
  valueClassName?: string
}) {
  return (
    <button
      type="button"
      className="w-full rounded-2xl border border-[#E4DFD3] bg-white p-6 text-left transition-transform duration-150 active:scale-[0.97]"
    >
      <div className="flex items-center justify-between">
        <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#12211D]/70">
          {label}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F2] text-[#12211D]">
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 font-[family-name:var(--font-display)] text-[26px] font-semibold tabular-nums ${
          valueClassName ?? 'text-[#12211D]'
        }`}
      >
        {value}
      </p>

      {trend && (
        <div
          className={`mt-2 inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-xs font-semibold ${
            trend.direction === 'up' ? 'text-[#1B4B43]' : 'text-[#B3431E]'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            {trend.direction === 'up' ? (
              <path d="M6 18 18 6M18 6H9M18 6v9" />
            ) : (
              <path d="M6 6l12 12M18 18H9M18 18V9" />
            )}
          </svg>
          {trend.label}
        </div>
      )}
    </button>
  )
}
