import { useRef, useState, useCallback, useEffect } from 'react'

export interface TrackInfo {
  title: string
  duration: number
  audioUrl: string
  sourceUrl: string
}

interface AudioPlayerState {
  track: TrackInfo | null
  playing: boolean
  currentTime: number
  duration: number
  loading: boolean
  error: string | null
  downloadProgress: number | null
  downloadEta: number | null
}

export function useAudioPlayer(backendUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    track: null,
    playing: false,
    currentTime: 0,
    duration: 0,
    loading: false,
    error: null,
    downloadProgress: null,
    downloadEta: null,
  })

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'auto'
      audioRef.current.volume = 1.0
    }
    return audioRef.current
  }, [])

  // ダウンロード完了までポーリング（2秒間隔）
  const fetchAudioUrl = useCallback(
    async (
      youtubeUrl: string,
      onProgress?: (progress: number | null, eta: number | null) => void,
    ): Promise<TrackInfo> => {
      const endpoint = `${backendUrl}/audio-url?url=${encodeURIComponent(youtubeUrl)}`
      while (true) {
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`)
        const data = await res.json()
        if (data.status === 'done') {
          onProgress?.(null, null)
          return {
            title: data.title ?? '不明なタイトル',
            duration: data.duration ?? 0,
            audioUrl: data.url,
            sourceUrl: youtubeUrl,
          }
        }
        if (data.status === 'error') {
          throw new Error(data.error ?? 'ダウンロードエラー')
        }
        // pending → 進捗更新して2秒待って再試行
        onProgress?.(data.progress ?? null, data.eta ?? null)
        await new Promise((r) => setTimeout(r, 2000))
      }
    },
    [backendUrl],
  )

  const setupMediaSession = useCallback((track: TrackInfo) => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.title })
    const audio = getAudio()
    navigator.mediaSession.setActionHandler('play', () => audio.play())
    navigator.mediaSession.setActionHandler('pause', () => audio.pause())
    navigator.mediaSession.setActionHandler('seekbackward', (e) => {
      audio.currentTime = Math.max(0, audio.currentTime - (e.seekOffset ?? 10))
    })
    navigator.mediaSession.setActionHandler('seekforward', (e) => {
      audio.currentTime = Math.min(
        audio.duration,
        audio.currentTime + (e.seekOffset ?? 10),
      )
    })
  }, [getAudio])

  const load = useCallback(
    async (youtubeUrl: string) => {
      setState((s) => ({ ...s, loading: true, error: null, downloadProgress: null, downloadEta: null }))
      try {
        const track = await fetchAudioUrl(youtubeUrl, (progress, eta) => {
          setState((s) => ({ ...s, downloadProgress: progress, downloadEta: eta }))
        })
        const audio = getAudio()
        audio.src = track.audioUrl
        audio.load()
        setState((s) => ({
          ...s,
          track,
          loading: false,
          currentTime: 0,
          duration: track.duration,
          downloadProgress: null,
          downloadEta: null,
        }))
        setupMediaSession(track)
      } catch (e) {
        setState((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : '読み込みエラー',
        }))
      }
    },
    [fetchAudioUrl, getAudio, setupMediaSession],
  )

  const play = useCallback(async () => {
    const audio = getAudio()
    if (audio.error && state.track) {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const track = await fetchAudioUrl(state.track.sourceUrl)
        const savedTime = audio.currentTime
        audio.src = track.audioUrl
        audio.load()
        audio.currentTime = savedTime
        setupMediaSession(track)
        setState((s) => ({ ...s, track, loading: false }))
      } catch (e) {
        setState((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : '再取得エラー',
        }))
        return
      }
    }
    try {
      await audio.play()
    } catch {
      setState((s) => ({ ...s, error: '再生できませんでした' }))
    }
  }, [fetchAudioUrl, getAudio, setupMediaSession, state.track])

  const pause = useCallback(() => {
    getAudio().pause()
  }, [getAudio])

  const seek = useCallback(
    (time: number) => {
      const audio = getAudio()
      audio.currentTime = time
      setState((s) => ({ ...s, currentTime: time }))
    },
    [getAudio],
  )

  useEffect(() => {
    const audio = getAudio()

    const onPlay = () => setState((s) => ({ ...s, playing: true }))
    const onPause = () => setState((s) => ({ ...s, playing: false }))
    const onTimeUpdate = () =>
      setState((s) => ({ ...s, currentTime: audio.currentTime }))
    const onDurationChange = () =>
      setState((s) => ({ ...s, duration: audio.duration || s.duration }))
    const onEnded = () => setState((s) => ({ ...s, playing: false, currentTime: 0 }))
    const onError = () => {
      if (audio.src) {
        setState((s) => ({ ...s, playing: false, error: 'URL期限切れの可能性。再生ボタンで再取得します。' }))
      }
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [getAudio])

  return { state, load, play, pause, seek }
}
