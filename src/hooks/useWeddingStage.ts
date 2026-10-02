import { useEffect, useState } from 'react'
import {
  getWeddingStage,
  type WeddingStageInfo,
} from '../utils/weddingStage'
import { weddingDates } from '../data/weddingConfig'

type PreviewKey =
  | 'before'
  | 'baraat'
  | 'walima'
  | 'walima-evening'
  | 'after'

function getDayStart(iso: string): number {
  const match = iso.match(
    /^(\d{4}-\d{2}-\d{2})(?:T|$)/,
  )

  if (!match) {
    throw new Error(
      `Invalid wedding date: ${iso}`,
    )
  }

  const datePart = match[1]

  const timezoneMatch = iso.match(
    /([+-]\d{2}:\d{2}|Z)$/,
  )

  const timezone = timezoneMatch?.[1] ?? 'Z'

  return new Date(
    `${datePart}T00:00:00${timezone}`,
  ).getTime()
}

function formatPreviewDate(
  timestamp: number,
): Date {
  return new Date(timestamp)
}

function getPreviewDates(): Record<
  PreviewKey,
  Date
> {
  const baraatDayStart = getDayStart(
    weddingDates.baraat.iso,
  )

  const walimaDayStart = getDayStart(
    weddingDates.walima.iso,
  )

  const walimaStart = new Date(
    weddingDates.walima.iso,
  ).getTime()

  const beforeBaraat =
    baraatDayStart - 12 * 60 * 60 * 1000

  const afterWalima =
    walimaDayStart +
    24 * 60 * 60 * 1000 +
    12 * 60 * 60 * 1000

  return {
    before: formatPreviewDate(
      beforeBaraat,
    ),

    baraat: formatPreviewDate(
      baraatDayStart +
        12 * 60 * 60 * 1000,
    ),

    walima: formatPreviewDate(
      walimaDayStart +
        12 * 60 * 60 * 1000,
    ),

    'walima-evening': formatPreviewDate(
      walimaStart +
        60 * 60 * 1000,
    ),

    after: formatPreviewDate(
      afterWalima,
    ),
  }
}

function getPreviewDate(): Date | null {
  /**
   * Preview mode is available only
   * during local development.
   */
  if (import.meta.env.PROD) {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  const preview =
    new URLSearchParams(
      window.location.search,
    ).get('preview')

  if (!preview) {
    return null
  }

  const previewDates =
    getPreviewDates()

  const previewDate =
    previewDates[
      preview as PreviewKey
    ]

  if (!previewDate) {
    return null
  }

  return previewDate
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
        stage:
          getWeddingStage(currentDate),
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
