import { weddingDates } from '../data/weddingConfig'

export type WeddingStage =
  | 'upcoming'
  | 'baraat-day'
  | 'walima-day'
  | 'walima-celebration'
  | 'after-event'

export type WeddingStageInfo = {
  stage: WeddingStage
  label: string
  isWeddingDay: boolean
  isWalimaDay: boolean
}

/**
 * Returns the start of the calendar day for a given ISO date.
 *
 * Example:
 * 2026-10-31T10:00:00+05:30
 * becomes
 * 2026-10-31T00:00:00+05:30
 *
 * The timezone offset from the configured date is preserved.
 */
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

function getNextDayStart(iso: string): number {
  const dayStart = getDayStart(iso)

  return dayStart + 24 * 60 * 60 * 1000
}

const BARAAT_DAY_START = getDayStart(
  weddingDates.baraat.iso,
)

const WALIMA_DAY_START = getDayStart(
  weddingDates.walima.iso,
)

const WALIMA_START = new Date(
  weddingDates.walima.iso,
).getTime()

const AFTER_EVENT_START = getNextDayStart(
  weddingDates.walima.iso,
)

export function getWeddingStage(
  date: Date,
): WeddingStageInfo {
  const currentTime = date.getTime()

  /**
   * Before the Baraat calendar day.
   */
  if (currentTime < BARAAT_DAY_START) {
    return {
      stage: 'upcoming',
      label: 'Counting Down',
      isWeddingDay: false,
      isWalimaDay: false,
    }
  }

  /**
   * Baraat date:
   * 12:00 AM until the next midnight.
   */
  if (currentTime < WALIMA_DAY_START) {
    return {
      stage: 'baraat-day',
      label: 'Wedding Day',
      isWeddingDay: true,
      isWalimaDay: false,
    }
  }

  /**
   * Walima date:
   * 12:00 AM until the configured Walima time.
   */
  if (currentTime < WALIMA_START) {
    return {
      stage: 'walima-day',
      label: 'Dawat-e-Walima',
      isWeddingDay: false,
      isWalimaDay: true,
    }
  }

  /**
   * Walima celebration:
   * Configured Walima time until midnight.
   */
  if (currentTime < AFTER_EVENT_START) {
    return {
      stage: 'walima-celebration',
      label: 'Dawat-e-Walima',
      isWeddingDay: false,
      isWalimaDay: true,
    }
  }

  /**
   * The day after Walima.
   */
  return {
    stage: 'after-event',
    label: 'Celebration',
    isWeddingDay: false,
    isWalimaDay: false,
  }
}
