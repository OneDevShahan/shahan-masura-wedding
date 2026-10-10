import { useEffect, useRef, useState } from 'react'

export function useMusic(src: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shouldResumeRef = useRef(false)
  const resumeAttemptRef = useRef(false)
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
      audio.setAttribute('playsinline', 'true')
      audio.setAttribute('webkit-playsinline', 'true')

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

    return () => {
      audio.pause()
      shouldResumeRef.current = false
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
      setIsPlaying(false)
      setIsReady(false)
    }
  }, [enabled, src])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleVisibilityOrFocus = () => {
      const audio = audioRef.current
      const isAway =
        document.visibilityState === 'hidden' || !document.hasFocus()

      if (isAway) {
        audio?.pause()
        return
      }

      if (
        !audio ||
        !shouldResumeRef.current ||
        !audio.paused ||
        resumeAttemptRef.current
      ) {
        return
      }

      resumeAttemptRef.current = true
      void audio.play().catch((error: unknown) => {
        setIsPlaying(false)
        console.warn('Audio could not resume automatically:', error)
      }).finally(() => {
        resumeAttemptRef.current = false
        if (!shouldResumeRef.current) {
          audio.pause()
        }
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityOrFocus)
    window.addEventListener('blur', handleVisibilityOrFocus)
    window.addEventListener('focus', handleVisibilityOrFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('blur', handleVisibilityOrFocus)
      window.removeEventListener('focus', handleVisibilityOrFocus)
    }
  }, [])

  const toggle = async () => {
    const audio = ensureAudio()
    if (!audio || !enabled || !src || typeof window === 'undefined') {
      return
    }

    if (audio.paused) {
      try {
        audio.load()
        shouldResumeRef.current = true
        await audio.play()
        setIsPlaying(true)
        window.sessionStorage.setItem('wedding-music', 'on')
      } catch (error) {
        shouldResumeRef.current = false
        console.warn('Audio playback failed on mobile:', error)
        setIsPlaying(false)
        window.sessionStorage.setItem('wedding-music', 'off')
      }
      return
    }

    shouldResumeRef.current = false
    audio.pause()
    setIsPlaying(false)
    window.sessionStorage.setItem('wedding-music', 'off')
  }

  return { isPlaying, isReady, toggle }
}
