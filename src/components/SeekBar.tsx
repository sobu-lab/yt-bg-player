import { type ChangeEvent } from 'react'

interface Props {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

export function SeekBar({ currentTime, duration, onSeek }: Props) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value))
  }

  return (
    <div className="relative w-full h-4 flex items-center">
      <div className="absolute inset-x-0 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={handleChange}
        className="absolute inset-x-0 w-full opacity-0 h-4 cursor-pointer"
        aria-label="シークバー"
      />
    </div>
  )
}
