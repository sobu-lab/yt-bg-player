import { useState, type FormEvent } from 'react'
import { useAudioPlayer } from '../useAudioPlayer'
import { SeekBar } from './SeekBar'

interface Props {
  backendUrl: string
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function Player({ backendUrl }: Props) {
  const [inputUrl, setInputUrl] = useState('')
  const { state, load, play, pause, seek } = useAudioPlayer(backendUrl)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = inputUrl.trim()
    if (trimmed) load(trimmed)
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full pt-8">
      {/* URL入力 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="YouTube URL を貼り付け"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <button
          type="submit"
          disabled={state.loading || !inputUrl.trim()}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {state.loading ? '読込中…' : '読込'}
        </button>
      </form>

      {/* エラー */}
      {state.error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      {/* プレイヤー */}
      {state.track && (
        <div className="bg-gray-900 rounded-2xl p-5 flex flex-col gap-4">
          {/* タイトル */}
          <p className="text-base font-medium leading-snug line-clamp-2 text-white">
            {state.track.title}
          </p>

          {/* シークバー */}
          <SeekBar
            currentTime={state.currentTime}
            duration={state.duration}
            onSeek={seek}
          />

          {/* 時刻 */}
          <div className="flex justify-between text-xs text-gray-500 -mt-2">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>

          {/* 再生・一時停止 */}
          <div className="flex justify-center">
            <button
              onClick={state.playing ? pause : play}
              disabled={state.loading}
              aria-label={state.playing ? '一時停止' : '再生'}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              {state.playing ? (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-7 h-7 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 初期ガイド */}
      {!state.track && !state.loading && (
        <p className="text-center text-sm text-gray-600 mt-4">
          YouTube の URL を入力して読み込んでください
        </p>
      )}
    </div>
  )
}
