export function getWhatsAppShareUrl(message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/?text=${encoded}`
}

export async function copyToClipboard(value: string) {
  if (typeof navigator === 'undefined') {
    return false
  }

  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}
