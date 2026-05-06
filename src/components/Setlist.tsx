interface SetlistItem {
  seconds: number
  label: string
  timestamp: string
}

interface Props {
  items: SetlistItem[]
  currentTime: number
  onSelect: (seconds: number) => void
}

export function Setlist({ items, currentTime, onSelect }: Props) {
  if (items.length === 0) return null

  const activeIndex = items.reduce((best, item, i) => {
    return item.seconds <= currentTime ? i : best
  }, -1)

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <p className="text-xs text-gray-500 px-4 pt-3 pb-2 font-medium tracking-wide uppercase">
        セットリスト
      </p>
      <ul className="max-h-72 overflow-y-auto">
        {items.map((item, i) => (
          <li key={item.seconds}>
            <button
              onClick={() => onSelect(item.seconds)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-800 ${
                i === activeIndex
                  ? 'text-red-400 bg-gray-800'
                  : 'text-gray-300'
              }`}
            >
              <span className="text-xs text-gray-500 w-10 shrink-0 tabular-nums">
                {item.timestamp}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
