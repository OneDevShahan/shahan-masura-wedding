import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import type { WeddingStage } from '../../utils/weddingStage'

type WeddingCelebrationProps = {
  stage: WeddingStage
  active: boolean
  celebrationColor: string
}

type WindowSize = {
  width: number
  height: number
}

const WEDDING_COLORS = [
  '#FF0000', // Red
  '#00A651', // Green
  '#FFD700', // Yellow
  '#0066FF', // Blue
  '#FF69B4', // Pink
  '#FFFFFF', // White
  '#FF8C00', // Orange
]

const WALIMA_COLORS = [
  '#FF0000',
  '#00A651',
  '#FFD700',
  '#0066FF',
  '#FF69B4',
  '#FFFFFF',
  '#FF8C00',
]

const BURST_INTERVAL = 10000

export default function WeddingCelebration({
  stage,
  active,
  celebrationColor,
}: WeddingCelebrationProps) {
  const [windowSize, setWindowSize] =
    useState<WindowSize>({
      width:
        typeof window !== 'undefined'
          ? window.innerWidth
          : 0,
      height:
        typeof window !== 'undefined'
          ? window.innerHeight
          : 0,
    })

  const [burstKey, setBurstKey] = useState(0)

  const isWeddingDay =
    stage === 'baraat-day'

  const isWalima =
    stage === 'walima-day' ||
    stage === 'walima-celebration'

  const celebrationEnabled =
    active &&
    (isWeddingDay || isWalima)

  /*
   * Keep confetti sized to the viewport.
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener(
      'resize',
      handleResize,
    )

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      )
    }
  }, [])

  /*
   * Start a new confetti burst every 10 seconds.
   *
   * We don't hide the previous burst.
   * The previous pieces are allowed to
   * naturally fall away.
   */
  useEffect(() => {
    if (!celebrationEnabled) {
      setBurstKey(0)
      return
    }

    setBurstKey(0)

    const timer = window.setInterval(() => {
      setBurstKey((previous) => previous + 1)
    }, BURST_INTERVAL)

    return () => {
      window.clearInterval(timer)
    }
  }, [celebrationEnabled])

  if (!celebrationEnabled) {
    return null
  }

  const baseColors = isWeddingDay
    ? WEDDING_COLORS
    : WALIMA_COLORS

  const colors = [
    ...baseColors,
    celebrationColor,
  ]

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    >
      <Confetti
        key={burstKey}
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={550}
        gravity={0.045}   
        wind={0.005}
        opacity={0.95}
        recycle={false}
        colors={colors}
      />
    </div>
  )
}
