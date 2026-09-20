import { useEffect, useState } from 'react'

export type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
  finished: boolean
}

export function useCountdown(targetDate: string): CountdownState {
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  })

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(targetDate).getTime()
      const now = Date.now()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: true })
        return
      }

      const totalSeconds = Math.floor(difference / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        finished: false,
      })
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(timer)
  }, [targetDate])

  return timeLeft
}
