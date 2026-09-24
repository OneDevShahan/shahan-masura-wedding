import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'

import { db } from '../lib/firebase'
import { initialWishes, type WishMessage } from '../data/wedding'

export type RSVPStatus = 'yes' | 'no'

export type RSVPData = {
  name: string
  attending: RSVPStatus
  guests: number
  message: string
}

export type RSVPResult = {
  success: boolean
  status: RSVPStatus
  message: string
  displayName: string
  totalGuests?: number
}

export type WishPayload = {
  name: string
  text: string
  createdAt?: Timestamp | Date | string | null
}

const ensureDb = () => {
  if (!db) {
    throw new Error('Firebase is not configured yet. Add your Vite environment variables before using RSVP and wishes.')
  }

  return db
}

const safeWishList = (list: WishMessage[] = initialWishes): WishMessage[] =>
  list.filter((wish) => wish && typeof wish.name === 'string' && typeof wish.text === 'string' && wish.name.trim() && wish.text.trim())

export async function submitRSVP(data: RSVPData): Promise<RSVPResult> {
  const trimmedName = data.name.trim()
  if (!trimmedName) {
    throw new Error('Please enter your name before sending the RSVP.')
  }

  const normalizedGuests = Math.max(1, Number(data.guests) || 1)
  const firestore = ensureDb()

  await addDoc(collection(firestore, 'rsvps'), {
    name: trimmedName,
    attending: data.attending,
    guests: normalizedGuests,
    message: data.message.trim(),
    createdAt: new Date().toISOString(),
  })

  return {
    success: true,
    status: data.attending,
    message:
      data.attending === 'yes'
        ? 'Thank you for joining us. We look forward to celebrating with you.'
        : 'Thank you for letting us know. Your duas and good wishes mean a lot to us.',
    displayName: trimmedName,
    totalGuests: normalizedGuests,
  }
}

export function subscribeToRSVPs(
  callback: (count: number) => void,
): Unsubscribe | undefined {
  if (!db) {
    callback(0)
    return undefined
  }

  const q = query(collection(db, 'rsvps'))

  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.size)
    },
    () => {
      callback(0)
    },
  )
}

export function subscribeToWishes(
  callback: (items: WishMessage[]) => void,
): Unsubscribe | undefined {
  if (!db) {
    callback(safeWishList())
    return undefined
  }

  const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'))

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data() as WishPayload

        return {
          name: String(data.name ?? 'Guest'),
          text: String(data.text ?? ''),
        }
      })

      callback(items.filter((wish) => wish.name.trim() && wish.text.trim()).length ? items : safeWishList())
    },
    () => {
      callback(safeWishList())
    },
  )
}

export async function submitWish(data: { name: string; text: string }): Promise<void> {
  const trimmedName = data.name.trim()
  const trimmedText = data.text.trim()

  if (!trimmedName || !trimmedText) {
    throw new Error('Please enter both your name and a wish before submitting.')
  }

  const firestore = ensureDb()

  await addDoc(collection(firestore, 'wishes'), {
    name: trimmedName,
    text: trimmedText,
    createdAt: new Date().toISOString(),
  })
}
