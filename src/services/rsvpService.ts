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

export type VisitorLocation = {
  city: string
  region: string
  country: string
  countryCode: string
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

  await addDoc(
    collection(firestore, 'rsvps'),
    {
      name: trimmedName,
      attending: data.attending,
      guests: normalizedGuests,
      message: data.message.trim(),
      createdAt: new Date().toISOString(),
    },
  )

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
 * connection.
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
      const data =
        document.data() as WishPayload

      return {
        name: String(
          data.name ?? 'Guest',
        ),
        text: String(
          data.text ?? '',
        ),
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

  if (
    !trimmedName ||
    !trimmedText
  ) {
    throw new Error(
      'Please enter both your name and a wish before submitting.',
    )
  }

  const firestore = ensureDb()

  await addDoc(
    collection(firestore, 'wishes'),
    {
      name: trimmedName,
      text: trimmedText,
      createdAt:
        new Date().toISOString(),
    },
  )
}

/* -------------------------------------------------------------------------- */
/* Visitor counter                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Gets the visitor's public IP address.
 *
 * The actual IP is never stored in Firestore.
 */
async function getVisitorIp(): Promise<string> {
  const response = await fetch(
    'https://api.ipify.org?format=json',
  )

  if (!response.ok) {
    throw new Error(
      'Could not determine visitor IP.',
    )
  }

  const data =
    (await response.json()) as {
      ip?: string
    }

  if (!data.ip) {
    throw new Error(
      'Could not determine visitor IP.',
    )
  }

  return data.ip
}

/**
 * Gets approximate location from the public IP.
 *
 * This is IP-based geolocation.
 * It does NOT provide an exact address.
 */
async function getVisitorLocation(
  ip: string,
): Promise<VisitorLocation> {
  const response = await fetch(
    `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
  )

  if (!response.ok) {
    throw new Error(
      'Could not determine visitor location.',
    )
  }

  const data =
    (await response.json()) as {
      city?: string
      region?: string
      country_name?: string
      country_code?: string
    }

  return {
    city:
      data.city?.trim() ||
      'Unknown',

    region:
      data.region?.trim() ||
      'Unknown',

    country:
      data.country_name?.trim() ||
      'Unknown',

    countryCode:
      data.country_code?.trim() ||
      'Unknown',
  }
}

/**
 * Creates a SHA-256 hash of the visitor IP.
 *
 * The actual IP address is NOT stored.
 */
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

  const encoder =
    new TextEncoder()

  const data =
    encoder.encode(ip)

  const hashBuffer =
    await window.crypto.subtle.digest(
      'SHA-256',
      data,
    )

  return Array.from(
    new Uint8Array(hashBuffer),
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
}

/**
 * Registers a unique visitor.
 *
 * New visitor:
 *
 * visitors/{ipHash}
 *   ├── firstSeen
 *   └── location
 *        ├── city
 *        ├── region
 *        ├── country
 *        └── countryCode
 *
 * Existing visitors are NOT updated.
 */
export async function registerVisitor(): Promise<number> {
  const firestore =
    ensureDb()

  const ip =
    await getVisitorIp()

  const ipHash =
    await hashIp(ip)

  const visitorRef =
    doc(
      firestore,
      'visitors',
      ipHash,
    )

  const statsRef =
    doc(
      firestore,
      'stats',
      'visitors',
    )

  const visitorSnapshot =
    await getDoc(visitorRef)

  let location:
    | VisitorLocation
    | null = null

  try {
    location =
      await getVisitorLocation(ip)
  } catch (error) {
    console.warn(
      'Could not determine visitor location:',
      error,
    )
  }

  /*
   * Only CREATE new visitor documents.
   *
   * Existing visitors are not updated.
   */
  if (
    !visitorSnapshot.exists()
  ) {
    await setDoc(
      visitorRef,
      {
        firstSeen:
          new Date().toISOString(),

        ...(location
          ? {
              location,
            }
          : {}),
      },
    )

    await setDoc(
      statsRef,
      {
        count:
          increment(1),

        updatedAt:
          new Date().toISOString(),
      },
      {
        merge: true,
      },
    )
  }

  const statsSnapshot =
    await getDoc(statsRef)

  return Number(
    statsSnapshot
      .data()
      ?.count ?? 0,
  )
}

/**
 * Loads locations stored against visitor documents.
 *
 * Duplicate locations are removed.
 */
export async function getVisitorLocations(): Promise<
  VisitorLocation[]
> {
  if (!db) {
    return []
  }

  try {
    const firestore =
      ensureDb()

    const snapshot =
      await getDocs(
        collection(
          firestore,
          'visitors',
        ),
      )

    const locations:
      VisitorLocation[] = []

    snapshot.forEach(
      (document) => {
        const data =
          document.data()

        const location =
          data.location as
            | Partial<VisitorLocation>
            | undefined

        if (!location) {
          return
        }

        const city =
          String(
            location.city ?? '',
          ).trim()

        const region =
          String(
            location.region ?? '',
          ).trim()

        const country =
          String(
            location.country ?? '',
          ).trim()

        const countryCode =
          String(
            location.countryCode ??
              '',
          ).trim()

        if (
          !city &&
          !region &&
          !country
        ) {
          return
        }

        locations.push({
          city:
            city || 'Unknown',

          region:
            region || 'Unknown',

          country:
            country || 'Unknown',

          countryCode:
            countryCode ||
            'Unknown',
        })
      },
    )

    /*
     * Remove duplicate locations.
     */
    const uniqueLocations =
      Array.from(
        new Map(
          locations.map(
            (location) => [
              [
                location.city,
                location.region,
                location.country,
              ].join('|'),
              location,
            ],
          ),
        ).values(),
      )

    return uniqueLocations
  } catch (error) {
    console.error(
      'Could not load visitor locations:',
      error,
    )

    return []
  }
}