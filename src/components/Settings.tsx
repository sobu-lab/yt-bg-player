import { useState, type FormEvent } from 'react'

interface Props {
  backendUrl: string
  onSave: (url: string) => void
}

export function Settings({ backendUrl, onSave }: Props) {
  const [value, setValue] = useState(backendUrl)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim().replace(/\/$/, '')
    if (trimmed) onSave(trimmed)
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full pt-8">
      <h2 className="text-lg font-semibold text-white">設定</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">バックエンド URL</label>
          <input
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://example.trycloudflare.com"
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <p className="text-xs text-gray-600">
            Cloudflare Tunnel の URL を変更できます。末尾のスラッシュは不要です。
          </p>
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start"
        >
          保存してプレイヤーに戻る
        </button>
      </form>
    </div>
  )
}
