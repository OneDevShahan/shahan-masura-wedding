import { useEffect, useState } from 'react'

export type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
  finished: boolean
}

export function useCountdown(
  targetDate: string,
  currentDate?: Date,
): CountdownState {
  const [timeLeft, setTimeLeft] =
    useState<CountdownState>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: false,
    })

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(
        targetDate,
      ).getTime()

      const now = currentDate
        ? currentDate.getTime()
        : Date.now()

      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          finished: true,
        })

        return
      }

      const totalSeconds = Math.floor(
        difference / 1000,
      )

      const days = Math.floor(
        totalSeconds / 86400,
      )

      const hours = Math.floor(
        (totalSeconds % 86400) / 3600,
      )

      const minutes = Math.floor(
        (totalSeconds % 3600) / 60,
      )

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

    // Preview dates are fixed, so there is
    // nothing to update every second.
    if (currentDate) {
      return
    }

    const timer = window.setInterval(
      updateCountdown,
      1000,
    )

    return () => {
      window.clearInterval(timer)
    }
  }, [targetDate, currentDate])

  return timeLeft
}
