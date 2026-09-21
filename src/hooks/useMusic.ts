import { useEffect, useRef, useState } from 'react'

export function useMusic(src: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const ensureAudio = () => {
    if (!enabled || !src || typeof window === 'undefined') {
      return null
    }

    if (!audioRef.current) {
      const audio = new Audio(src)
      audio.loop = true
      audio.volume = 0.35
      audio.preload = 'auto'
      audio.crossOrigin = 'anonymous'

      const handleCanPlay = () => setIsReady(true)
      const handleError = () => {
        setIsReady(false)
        setIsPlaying(false)
      }
      const handlePause = () => setIsPlaying(false)
      const handlePlay = () => setIsPlaying(true)

      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('error', handleError)
      audio.addEventListener('pause', handlePause)
      audio.addEventListener('play', handlePlay)

      audioRef.current = audio
    }

    return audioRef.current
  }

  useEffect(() => {
    if (!enabled || !src || typeof window === 'undefined') {
      return
    }

    const audio = ensureAudio()
    if (!audio) {
      return
    }

    const storedPreference = window.sessionStorage.getItem('wedding-music')
    if (storedPreference === 'on') {
      setIsPlaying(true)
    }

    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
      setIsPlaying(false)
      setIsReady(false)
    }
  }, [enabled, src])

  const toggle = async () => {
    const audio = ensureAudio()
    if (!audio || !enabled || !src || typeof window === 'undefined') {
      return
    }

    if (audio.paused) {
      try {
        audio.load()
        await audio.play()
        setIsPlaying(true)
        window.sessionStorage.setItem('wedding-music', 'on')
      } catch (error) {
        console.warn('Audio playback failed on mobile:', error)
        setIsPlaying(false)
        window.sessionStorage.setItem('wedding-music', 'off')
      }
      return
    }

    audio.pause()
    setIsPlaying(false)
    window.sessionStorage.setItem('wedding-music', 'off')
  }

  return { isPlaying, isReady, toggle }
}
