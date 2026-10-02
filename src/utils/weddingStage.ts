import { wedding } from '../data/wedding'

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

const BARAAT_START = new Date(
  wedding.date.iso,
).getTime()

const BARAAT_DAY_END = new Date(
  '2026-11-01T00:00:00+05:30',
).getTime()

const WALIMA_START = new Date(
  wedding.date.walimaIso,
).getTime()

const WALIMA_DAY_END = new Date(
  '2026-11-02T00:00:00+05:30',
).getTime()

export function getWeddingStage(
  date: Date,
): WeddingStageInfo {
  const currentTime = date.getTime()

  if (currentTime < BARAAT_START) {
    return {
      stage: 'upcoming',
      label: 'Counting Down',
      isWeddingDay: false,
      isWalimaDay: false,
    }
  }

  if (currentTime < BARAAT_DAY_END) {
    return {
      stage: 'baraat-day',
      label: 'Wedding Day',
      isWeddingDay: true,
      isWalimaDay: false,
    }
  }

  if (currentTime < WALIMA_START) {
    return {
      stage: 'walima-day',
      label: 'Dawat-e-Walima',
      isWeddingDay: false,
      isWalimaDay: true,
    }
  }

  if (currentTime < WALIMA_DAY_END) {
    return {
      stage: 'walima-celebration',
      label: 'Dawat-e-Walima',
      isWeddingDay: false,
      isWalimaDay: true,
    }
  }

  return {
    stage: 'after-event',
    label: 'Celebration',
    isWeddingDay: false,
    isWalimaDay: false,
  }
}