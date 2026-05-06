import { useState } from 'react'
import { Player } from './components/Player'
import { Settings } from './components/Settings'

const DEFAULT_BACKEND = 'https://fraser-edge-respectively-limits.trycloudflare.com'
const STORAGE_KEY = 'yt-bg-backend-url'

export default function App() {
  const [backendUrl, setBackendUrl] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_BACKEND,
  )
  const [page, setPage] = useState<'player' | 'settings'>('player')

  const saveBackendUrl = (url: string) => {
    const trimmed = url.replace(/\/$/, '')
    localStorage.setItem(STORAGE_KEY, trimmed)
    setBackendUrl(trimmed)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <button
          onClick={() => setPage('player')}
          className="text-lg font-bold tracking-tight text-white"
        >
          YT BG Player
        </button>
        <button
          onClick={() => setPage(page === 'settings' ? 'player' : 'settings')}
          aria-label="設定"
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        {page === 'player' ? (
          <Player backendUrl={backendUrl} />
        ) : (
          <Settings
            backendUrl={backendUrl}
            onSave={(url: string) => {
              saveBackendUrl(url)
              setPage('player')
            }}
          />
        )}
      </main>
    </div>
  )
}
