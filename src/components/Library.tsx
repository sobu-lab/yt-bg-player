export interface LibraryItem {
  job_id: string
  title: string
  duration: number
  source_url: string
  audio_url: string
  setlist: { seconds: number; label: string; timestamp: string }[]
}

interface Props {
  items: LibraryItem[]
  currentJobId: string | null
  onPlay: (item: LibraryItem) => void
  onDelete: (jobId: string) => void
}

function formatDuration(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return ''
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function Library({ items, currentJobId, onPlay, onDelete }: Props) {
  if (items.length === 0) return null

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <p className="text-xs text-gray-500 px-4 pt-3 pb-2 font-medium tracking-wide uppercase">
        ライブラリ
      </p>
      <ul>
        {items.map((item) => {
          const active = item.job_id === currentJobId
          return (
            <li
              key={item.job_id}
              className={`flex items-center gap-2 px-4 py-2.5 transition-colors ${active ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <button onClick={() => onPlay(item)} className="flex-1 text-left min-w-0">
                <p className={`text-sm truncate ${active ? 'text-red-400' : 'text-gray-200'}`}>
                  {item.title || '不明なタイトル'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDuration(item.duration)}
                  {item.setlist.length > 0 && (
                    <span className="ml-2 text-gray-600">{item.setlist.length} 曲</span>
                  )}
                </p>
              </button>
              <button
                onClick={() => onDelete(item.job_id)}
                className="shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1"
                aria-label="削除"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
