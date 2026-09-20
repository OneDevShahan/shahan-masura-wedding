export function getGoogleCalendarLink(dateIso: string, title: string, details: string, location: string) {
  const start = new Date(dateIso).toISOString().replace(/[-:]/g, '').replace('.000', '')
  const end = new Date(new Date(dateIso).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace('.000', '')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details,
    location,
    dates: `${start}/${end}`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function getIcsContent(dateIso: string, title: string, details: string, location: string) {
  const start = new Date(dateIso)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const toIcsDate = (value: Date) =>
    value
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@wedding-invite`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.join('\r\n')
}
