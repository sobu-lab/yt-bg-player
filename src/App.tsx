import { Player } from './components/Player'

const backendUrl = window.location.origin

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="flex items-center px-4 py-3 border-b border-gray-800">
        <span className="text-lg font-bold tracking-tight text-white">
          YT BG Player
        </span>
      </header>
      <main className="flex-1 flex flex-col">
        <Player backendUrl={backendUrl} />
      </main>
    </div>
  )
}
