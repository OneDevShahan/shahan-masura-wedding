import type { CSSProperties } from 'react'

import type { PaletteOption } from '../components/Header'
import { wedding } from '../data/wedding'

/* -------------------------------------------------------------------------- */
/* General Utilities                                                          */
/* -------------------------------------------------------------------------- */

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

/* -------------------------------------------------------------------------- */
/* Date Utilities                                                             */
/* -------------------------------------------------------------------------- */

export function formatWishDate(date?: Date | null) {
  if (!date) {
    return ''
  }

  const day = date.getDate()

  const suffix =
    day >= 11 && day <= 13
      ? 'th'
      : day % 10 === 1
        ? 'st'
        : day % 10 === 2
          ? 'nd'
          : day % 10 === 3
            ? 'rd'
            : 'th'

  const datePart = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  })

  const timePart = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  })

  return `${day}${suffix} ${datePart.split(' ').slice(1).join(' ')} · ${timePart} IST`
}

/* -------------------------------------------------------------------------- */
/* Share Utilities                                                            */
/* -------------------------------------------------------------------------- */

export function getWeddingShareMessage() {
  return `${wedding.share.message} ${wedding.bride.name} & ${wedding.groom.name}`
}

export function getWhatsAppShareUrl(message: string) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export async function shareWeddingInvitation(
  type: 'whatsapp' | 'copy' | 'native',
) {
  const message = getWeddingShareMessage()
  const url = window.location.href

  if (type === 'whatsapp') {
    window.open(
      getWhatsAppShareUrl(`${message} ${url}`),
      '_blank',
      'noopener,noreferrer',
    )

    return 'WhatsApp share opened'
  }

  if (type === 'copy') {
    const copied = await copyToClipboard(`${message} ${url}`)

    return copied
      ? 'Invitation link copied'
      : 'Copy failed. Please try again.'
  }

  if (navigator.share) {
    await navigator.share({
      title: `${wedding.bride.name} & ${wedding.groom.name} Wedding Invitation`,
      text: message,
      url,
    })

    return 'Shared successfully'
  }

  return 'Your browser does not support native share.'
}

/* -------------------------------------------------------------------------- */
/* Calendar Utilities                                                         */
/* -------------------------------------------------------------------------- */

export function getGoogleCalendarLink(
  dateIso: string,
  title: string,
  details: string,
  location: string,
) {
  const start = new Date(dateIso)

  const end = new Date(start)
  end.setHours(end.getHours() + 3)

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

  const startDate = formatDate(start)
  const endDate = formatDate(end)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details,
    location,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function getIcsContent(
  dateIso: string,
  title: string,
  description: string,
  location: string,
) {
  const start = new Date(dateIso)

  const end = new Date(start)
  end.setHours(end.getHours() + 3)

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function createWeddingCalendarUrl() {
  return getGoogleCalendarLink(
    wedding.date.iso,
    `${wedding.bride.name} & ${wedding.groom.name} | Nikah Celebration`,
    'A beautiful evening of joy, faith, and celebration.',
    `${wedding.venue.name}, ${wedding.venue.address}, ${wedding.venue.city}, ${wedding.venue.country}`,
  )
}

export function downloadWeddingIcs() {
  const blob = new Blob(
    [
      getIcsContent(
        wedding.date.iso,
        'Nikah Celebration',
        'Wedding invitation event',
        `${wedding.venue.name}, ${wedding.venue.address}, ${wedding.venue.city}, ${wedding.venue.country}`,
      ),
    ],
    {
      type: 'text/calendar;charset=utf-8',
    },
  )

  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'wedding-invitation.ics'
  anchor.click()

  URL.revokeObjectURL(url)
}

/* -------------------------------------------------------------------------- */
/* Theme Utilities                                                            */
/* -------------------------------------------------------------------------- */

export function getThemeStyle(
  activePalette: PaletteOption,
): CSSProperties {
  return {
    '--brand-primary': activePalette.colors.primary,
    '--brand-primary-deep': activePalette.colors.primaryDeep,
    '--brand-primary-soft': activePalette.colors.primarySoft,
    '--brand-secondary': activePalette.colors.secondary,
    '--brand-secondary-soft': activePalette.colors.secondarySoft,
    '--brand-neutral': activePalette.colors.neutral,
    '--brand-neutral-soft': activePalette.colors.neutralSoft,

    '--surface-dark': activePalette.colors.primary,
    '--surface-dark-strong': activePalette.colors.primaryDeep,
    '--surface-light': activePalette.colors.neutral,
    '--surface-light-soft': activePalette.colors.neutralSoft,

    '--text-dark': activePalette.colors.primaryDeep,
    '--text-muted': activePalette.colors.primarySoft,
    '--text-light': activePalette.colors.neutral,
  } as CSSProperties
}

export function getPaletteFieldStyle(
  activePalette: PaletteOption,
): CSSProperties {
  return {
    backgroundColor: activePalette.colors.primary,
    borderColor: activePalette.colors.secondary,
    color: activePalette.colors.neutral,
  }
}