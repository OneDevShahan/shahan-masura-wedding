import { useEffect, useRef, useState } from 'react'

export function useMusic(src: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!enabled || !src || typeof window === 'undefined') {
      return
    }

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.35
    audio.preload = 'auto'
    audioRef.current = audio

    const handleCanPlay = () => setIsReady(true)
    const handleError = () => setIsReady(false)

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    const storedPreference = window.sessionStorage.getItem('wedding-music')
    if (storedPreference === 'on') {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }

    return () => {
      audio.pause()
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audioRef.current = null
    }
  }, [enabled, src])

  const toggle = async () => {
    if (!audioRef.current || !enabled || !src || typeof window === 'undefined') {
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      window.sessionStorage.setItem('wedding-music', 'off')
      return
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
      window.sessionStorage.setItem('wedding-music', 'on')
    } catch {
      setIsPlaying(false)
    }
  }

  return { isPlaying, isReady, toggle }
}
