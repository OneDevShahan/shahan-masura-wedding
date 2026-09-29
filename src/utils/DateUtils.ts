export function formatWishDate(
  createdAt?: string | Date | null,
) {
  if (!createdAt) return ''

  const date =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date)

  const day = Number(
    parts.find(
      (part) => part.type === 'day',
    )?.value,
  )

  const month =
    parts.find(
      (part) => part.type === 'month',
    )?.value ?? ''

  const year =
    parts.find(
      (part) => part.type === 'year',
    )?.value ?? ''

  const time = new Intl.DateTimeFormat(
    'en-IN',
    {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  ).format(date)

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'

  return `${time} · ${day}${suffix} ${month} ${year}`
}