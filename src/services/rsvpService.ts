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
}

export async function submitRSVP(data: RSVPData): Promise<RSVPResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 700))

  const trimmedName = data.name.trim()
  if (!trimmedName) {
    throw new Error('Please enter your name before sending the RSVP.')
  }

  const normalizedGuests = Math.max(1, Number(data.guests) || 1)

  return {
    success: true,
    status: data.attending,
    message:
      data.attending === 'yes'
        ? 'Thank you for joining us. We look forward to celebrating with you.'
        : 'Thank you for letting us know. Your duas and good wishes mean a lot to us.',
    displayName: trimmedName,
    guests: normalizedGuests,
  } as RSVPResult & { guests: number }
}
