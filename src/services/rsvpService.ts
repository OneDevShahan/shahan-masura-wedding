import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore'

import { initialWishes, type WishMessage } from '../data/wedding'
import { db } from '../lib/firebase'

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
    throw new Error(
      'Firebase is not configured yet. Add your Vite environment variables before using RSVP and wishes.',
    )
  }

  return db
}

const safeWishList = (
  list: WishMessage[] = initialWishes,
): WishMessage[] =>
  list.filter(
    (wish) =>
      wish &&
      typeof wish.name === 'string' &&
      typeof wish.text === 'string' &&
      wish.name.trim() &&
      wish.text.trim(),
  )

/* -------------------------------------------------------------------------- */
/* RSVP                                                                       */
/* -------------------------------------------------------------------------- */

export async function submitRSVP(
  data: RSVPData,
): Promise<RSVPResult> {
  const trimmedName = data.name.trim()

  if (!trimmedName) {
    throw new Error(
      'Please enter your name before sending the RSVP.',
    )
  }

  const normalizedGuests = Math.max(
    1,
    Number(data.guests) || 1,
  )

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

/**
 * Loads the RSVP count once.
 *
 * This intentionally does NOT use onSnapshot().
 * That prevents Firestore from opening a persistent realtime
 * connection, which avoids the QUIC/HTTP3 connection errors.
 */
export async function getRSVPCount(): Promise<number> {
  if (!db) {
    return 0
  }

  try {
    const snapshot = await getDocs(
      collection(db, 'rsvps'),
    )

    return snapshot.size
  } catch (error) {
    console.error(
      'Could not load RSVP count:',
      error,
    )

    return 0
  }
}

/* -------------------------------------------------------------------------- */
/* Wishes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Loads wishes once.
 *
 * No realtime listener is used.
 */
export async function getWishes(): Promise<WishMessage[]> {
  if (!db) {
    return safeWishList()
  }

  try {
    const firestore = ensureDb()

    const q = query(
      collection(firestore, 'wishes'),
      orderBy('createdAt', 'desc'),
    )

    const snapshot = await getDocs(q)

    const items = snapshot.docs.map((document) => {
    const data = document.data() as WishPayload

    return {
      name: String(data.name ?? 'Guest'),
      text: String(data.text ?? ''),
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt
            ? new Date(data.createdAt)
            : null,
    }
  })

    const validItems = items.filter(
      (wish) =>
        wish.name.trim() &&
        wish.text.trim(),
    )

    return validItems.length
      ? validItems
      : safeWishList()
  } catch (error) {
    console.error(
      'Could not load wishes:',
      error,
    )

    return safeWishList()
  }
}

export async function submitWish(
  data: {
    name: string
    text: string
  },
): Promise<void> {
  const trimmedName = data.name.trim()
  const trimmedText = data.text.trim()

  if (!trimmedName || !trimmedText) {
    throw new Error(
      'Please enter both your name and a wish before submitting.',
    )
  }

  const firestore = ensureDb()

  await addDoc(collection(firestore, 'wishes'), {
    name: trimmedName,
    text: trimmedText,
    createdAt: new Date().toISOString(),
  })
}

/* -------------------------------------------------------------------------- */
/* Visitor counter                                                            */
/* -------------------------------------------------------------------------- */

async function getVisitorIp(): Promise<string> {
  const response = await fetch(
    'https://api.ipify.org?format=json',
  )

  if (!response.ok) {
    throw new Error(
      'Could not determine visitor IP.',
    )
  }

  const data = (await response.json()) as {
    ip?: string
  }

  if (!data.ip) {
    throw new Error(
      'Could not determine visitor IP.',
    )
  }

  return data.ip
}

async function hashIp(
  ip: string,
): Promise<string> {
  if (
    typeof window === 'undefined' ||
    !window.crypto?.subtle
  ) {
    throw new Error(
      'Browser cryptography is not available.',
    )
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(ip)

  const hashBuffer =
    await window.crypto.subtle.digest(
      'SHA-256',
      data,
    )

  return Array.from(
    new Uint8Array(hashBuffer),
  )
    .map((byte) =>
      byte.toString(16).padStart(2, '0'),
    )
    .join('')
}

export async function registerVisitor(): Promise<number> {
  const firestore = ensureDb()

  const ip = await getVisitorIp()
  const ipHash = await hashIp(ip)

  const visitorRef = doc(
    firestore,
    'visitors',
    ipHash,
  )

  const statsRef = doc(
    firestore,
    'stats',
    'visitors',
  )

  const visitorSnapshot =
    await getDoc(visitorRef)

  if (!visitorSnapshot.exists()) {
    await setDoc(visitorRef, {
      firstSeen: new Date().toISOString(),
    })

    await setDoc(
      statsRef,
      {
        count: increment(1),
        updatedAt: new Date().toISOString(),
      },
      {
        merge: true,
      },
    )
  }

  const statsSnapshot =
    await getDoc(statsRef)

  return Number(
    statsSnapshot.data()?.count ?? 0,
  )
}