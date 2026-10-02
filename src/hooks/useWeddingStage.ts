import { useEffect, useState } from 'react'
import {
  getWeddingStage,
  type WeddingStageInfo,
} from '../utils/weddingStage'

type PreviewKey =
  | 'before'
  | '31-oct'
  | '1-nov'
  | '1-nov-evening'
  | '2-nov'

const PREVIEW_DATES: Record<
  PreviewKey,
  string
> = {
  before: '2026-10-30T12:00:00+05:30',
  '31-oct':
    '2026-10-31T12:00:00+05:30',
  '1-nov':
    '2026-11-01T12:00:00+05:30',
  '1-nov-evening':
    '2026-11-01T19:00:00+05:30',
  '2-nov':
    '2026-11-02T12:00:00+05:30',
}

function getPreviewDate(): Date | null {
  // Preview mode is available only
  // during local development.
  if (import.meta.env.PROD) {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  const preview = new URLSearchParams(
    window.location.search,
  ).get('preview')

  if (!preview) {
    return null
  }

  const previewDate =
    PREVIEW_DATES[preview as PreviewKey]

  if (!previewDate) {
    return null
  }

  return new Date(previewDate)
}

export type WeddingClock = {
  stage: WeddingStageInfo
  currentDate: Date
  isPreview: boolean
}

export function useWeddingStage(): WeddingClock {
  const [clock, setClock] =
    useState<WeddingClock>(() => {
      const previewDate =
        getPreviewDate()

      const currentDate =
        previewDate ?? new Date()

      return {
        stage: getWeddingStage(currentDate),
        currentDate,
        isPreview:
          Boolean(previewDate),
      }
    })

  useEffect(() => {
    const updateStage = () => {
      const previewDate =
        getPreviewDate()

      const currentDate =
        previewDate ?? new Date()

      setClock({
        stage:
          getWeddingStage(currentDate),
        currentDate,
        isPreview:
          Boolean(previewDate),
      })
    }

    updateStage()

    const timer =
      window.setInterval(
        updateStage,
        60 * 1000,
      )

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return clock
}
