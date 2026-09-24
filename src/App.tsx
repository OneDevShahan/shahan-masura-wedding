import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    CalendarClock,
    ChevronDown,
    ChevronUp,
    Clock3,
    Copy,
    Heart,
    MapPin,
    Menu,
    Share2,
    Sparkles,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { BrideGroomIllustration } from './components/decorations/BrideGroomIllustration'
import { Ornament } from './components/decorations/Ornament'
import { initialWishes, navItems, wedding, type WishMessage } from './data/wedding'
import { useCountdown } from './hooks/useCountdown'
import { useMusic } from './hooks/useMusic'
import { submitRSVP, submitWish, subscribeToRSVPs, subscribeToWishes } from './services/rsvpService'
import { getGoogleCalendarLink, getIcsContent } from './utils/calendar'
import { copyToClipboard, getWhatsAppShareUrl } from './utils/share'

type PaletteOption = {
  id: string
  name: string
  colors: {
    primary: string
    primaryDeep: string
    primarySoft: string
    secondary: string
    secondarySoft: string
    neutral: string
    neutralSoft: string
  }
}

const paletteOptions: PaletteOption[] = [
  {
    id: 'navy-gold',
    name: 'Navy & Gold',
    colors: {
      primary: '#1a2b44',
      primaryDeep: '#101b2d',
      primarySoft: '#324d72',
      secondary: '#d7b06c',
      secondarySoft: '#f5e9c8',
      neutral: '#f7f3ee',
      neutralSoft: '#e8eadf',
    },
  },
  {
    id: 'teal-coral',
    name: 'Teal & Coral',
    colors: {
      primary: '#0e4e4d',
      primaryDeep: '#0b2d2d',
      primarySoft: '#2a7b78',
      secondary: '#f48d6d',
      secondarySoft: '#f9d7c5',
      neutral: '#f8f5f1',
      neutralSoft: '#f1e5df',
    },
  },
  {
    id: 'plum-ivory',
    name: 'Plum & Ivory',
    colors: {
      primary: '#4d3245',
      primaryDeep: '#261b25',
      primarySoft: '#7c5c69',
      secondary: '#d4a867',
      secondarySoft: '#f2dfb4',
      neutral: '#f8f4f1',
      neutralSoft: '#efe3db',
    },
  },
  {
    id: 'charcoal-rose',
    name: 'Charcoal & Rose',
    colors: {
      primary: '#2a2d32',
      primaryDeep: '#17191c',
      primarySoft: '#5d6570',
      secondary: '#c8928b',
      secondarySoft: '#f0d6d2',
      neutral: '#f7f3ef',
      neutralSoft: '#ece4df',
    },
  },
  {
    id: 'sage-cream',
    name: 'Sage & Cream',
    colors: {
      primary: '#4b5f51',
      primaryDeep: '#24372e',
      primarySoft: '#7d9285',
      secondary: '#d0a56d',
      secondarySoft: '#f0ddbf',
      neutral: '#f8f5ee',
      neutralSoft: '#e8dfd1',
    },
  },
]

function App() {
  const [isOpened, setIsOpened] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no'>('yes')
  const [guests, setGuests] = useState(2)
  const [message, setMessage] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const [rsvpState, setRsvpState] = useState<{ success: boolean; message: string; name: string } | null>(null)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [wishes, setWishes] = useState<WishMessage[]>(initialWishes)
  const [wishName, setWishName] = useState('')
  const [wishText, setWishText] = useState('')
  const [showTopButton, setShowTopButton] = useState(false)
  const [showWelcomeHint, setShowWelcomeHint] = useState(false)
  const [invitationState, setInvitationState] = useState<'idle' | 'welcome'>('idle')
  const [activePalette, setActivePalette] = useState<PaletteOption>(paletteOptions[0])
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false)

  const countdown = useCountdown(wedding.date.iso)
  const music = useMusic(wedding.music.src, wedding.music.enabled)

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 260)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToRSVPs((count) => setRsvpCount(count))
    return () => unsubscribe?.()
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToWishes((items) => setWishes(items))
    return () => unsubscribe?.()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenInvitation = () => {
    setIsOpened(true)
    setInvitationState('welcome')
    setShowWelcomeHint(true)

    if (!music.isPlaying) {
      void music.toggle()
    }

    window.setTimeout(() => {
      setShowWelcomeHint(false)
    }, 1800)

    window.setTimeout(() => {
      const storySection = document.getElementById('story')
      if (!storySection) return

      const top = storySection.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: 'smooth' })
    }, 180)
  }

  const handleSubmitRSVP = async () => {
    const trimmedName = guestName.trim()
    if (!trimmedName) {
      setRsvpState({ success: false, name: '', message: 'Please enter your name before sending the RSVP.' })
      return
    }

    try {
      const result = await submitRSVP({
        name: trimmedName,
        attending,
        guests,
        message,
      })

      setRsvpState({
        success: true,
        name: result.displayName,
        message:
          result.status === 'yes'
            ? 'Thank you, ' + result.displayName + '! We look forward to celebrating with you.'
            : 'Thank you for letting us know. Your duas and good wishes mean a lot to us.',
      })
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setRsvpState({ success: false, name: '', message: messageText })
    }
  }

  const addWish = async () => {
    const cleanName = wishName.trim()
    const cleanText = wishText.trim()
    if (!cleanName || !cleanText) return

    try {
      await submitWish({ name: cleanName, text: cleanText })
      setWishName('')
      setWishText('')
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Could not save your wish. Please try again.'
      setRsvpState({ success: false, name: '', message: messageText })
    }
  }

  const handleShare = async (type: 'whatsapp' | 'copy' | 'native') => {
    const messageText = `${wedding.share.message} ${wedding.bride.name} & ${wedding.groom.name}`
    const url = window.location.href

    if (type === 'whatsapp') {
      window.open(getWhatsAppShareUrl(`${messageText} ${url}`), '_blank', 'noopener,noreferrer')
      setShareStatus('WhatsApp share opened')
      return
    }

    if (type === 'copy') {
      const copied = await copyToClipboard(`${messageText} ${url}`)
      setShareStatus(copied ? 'Invitation link copied' : 'Copy failed. Please try again.')
      return
    }

    if (navigator.share) {
      await navigator.share({ title: `${wedding.bride.name} & ${wedding.groom.name} Wedding Invitation`, text: messageText, url })
      setShareStatus('Shared successfully')
      return
    }

    setShareStatus('Your browser does not support native share.')
  }

  const calendarUrl = getGoogleCalendarLink(
    wedding.date.iso,
    `${wedding.bride.name} & ${wedding.groom.name} | Nikah Celebration`,
    'A beautiful evening of joy, faith, and celebration.',
    `${wedding.venue.name}, ${wedding.venue.address}, ${wedding.venue.city}, ${wedding.venue.country}`,
  )

  const handleIcsDownload = () => {
    const blob = new Blob(
      [
        getIcsContent(
          wedding.date.iso,
          'Nikah Celebration',
          'Wedding invitation event',
          `${wedding.venue.name}, ${wedding.venue.address}, ${wedding.venue.city}, ${wedding.venue.country}`,
        ),
      ],
      { type: 'text/calendar;charset=utf-8' },
    )

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'wedding-invitation.ics'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const themeStyle = {
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

  const paletteFieldStyle = {
    backgroundColor: activePalette.colors.primary,
    borderColor: activePalette.colors.secondary,
    color: activePalette.colors.neutral,
  } as CSSProperties

  return (
    <div style={themeStyle} className="min-h-screen bg-[radial-gradient(circle_at_top,var(--brand-primary-soft)_0%,var(--brand-primary)_35%,var(--brand-primary-deep)_100%)] text-[#f7f2e7] antialiased selection:bg-[var(--brand-secondary)]/30">
      <div className="fixed inset-0 opacity-60" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--brand-secondary)]/10 blur-3xl" />
      </div>

      <nav className="fixed inset-x-0 top-[calc(1rem+env(safe-area-inset-top))] z-40 mx-auto flex h-[5rem] max-w-[calc(100%-1.5rem)] items-center justify-between rounded-full border border-white/10 bg-[var(--brand-primary-deep)]/90 px-3 shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 sm:h-16 md:h-16 md:max-w-2xl md:px-5">
        <a href="#home" className="flex items-center gap-2 min-w-0 flex-shrink-0 sm:gap-3 md:flex">
          <Sparkles size={20} className="text-[var(--brand-secondary)] sm:text-[22px]" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-secondary)] transition-transform duration-300 ease-out hover:translate-x-1 hover:scale-[1.1] sm:text-[10px] md:text-[11px]">Invitation</span>
        </a>
        <div className="flex flex-1 items-center justify-evenly gap-1 sm:gap-2 md:gap-4">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-[8px] font-semibold tracking-[0.15em] text-[var(--brand-secondary)] transition-all duration-300 ease-out hover:scale-[1.1] hover:text-[var(--brand-secondary)] sm:text-[9px] md:text-[11px]">
              {item.label}
            </a>
          ))}
        </div>

        <div className="relative hidden items-center md:flex">
          <div
            onMouseEnter={() => setPaletteMenuOpen(true)}
            onMouseLeave={() => setPaletteMenuOpen(false)}
            onFocus={() => setPaletteMenuOpen(true)}
            onBlur={() => setPaletteMenuOpen(false)}
            className="relative"
          >
            <button
              type="button"
              aria-label="Palette options"
              className="flex items-center gap-2 rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] transition hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${activePalette.colors.primary} 0%, ${activePalette.colors.primarySoft} 100%)`,
                color: activePalette.colors.secondary,
              }}
            >
              <span>Palette</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {paletteMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onMouseEnter={() => setPaletteMenuOpen(true)}
                  onMouseLeave={() => setPaletteMenuOpen(false)}
                  className="absolute right-0 top-[calc(100%+0.75rem)] flex items-center gap-2 rounded-full border border-[var(--brand-secondary)]/30 p-2 shadow-[0_14px_28px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${activePalette.colors.primaryDeep} 0%, ${activePalette.colors.primary} 100%)`,
                  }}
                >
                  {paletteOptions.map((option) => (
                    <button
                      key={`hover-${option.id}`}
                      type="button"
                      aria-label={`Switch to ${option.name} palette`}
                      onClick={() => {
                        setActivePalette(option)
                        setPaletteMenuOpen(false)
                      }}
                      title={option.name}
                      className="h-5 w-5 rounded-full border border-white/50 transition hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${option.colors.secondary} 0%, ${option.colors.primary} 100%)`,
                        boxShadow: activePalette.id === option.id ? `0 0 0 2px ${option.colors.secondarySoft}` : 'none',
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative md:hidden">
          <div
            onMouseEnter={() => setPaletteMenuOpen(true)}
            onMouseLeave={() => setPaletteMenuOpen(false)}
            onFocus={() => setPaletteMenuOpen(true)}
            onBlur={() => setPaletteMenuOpen(false)}
            className="relative"
          >
            <button
              type="button"
              aria-label="Palette options"
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] transition hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${activePalette.colors.primary} 0%, ${activePalette.colors.primarySoft} 100%)`,
                color: activePalette.colors.secondary,
              }}
            >
              <span>Palette</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {paletteMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onMouseEnter={() => setPaletteMenuOpen(true)}
                  onMouseLeave={() => setPaletteMenuOpen(false)}
                  className="absolute right-0 top-[calc(100%+0.5rem)] flex items-center gap-2 rounded-full border border-[var(--brand-secondary)]/30 p-2 shadow-[0_12px_24px_rgba(0,0,0,0.15)] backdrop-blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${activePalette.colors.primaryDeep} 0%, ${activePalette.colors.primary} 100%)`,
                  }}
                >
                  {paletteOptions.map((option) => (
                    <button
                      key={`mobile-hover-${option.id}`}
                      type="button"
                      aria-label={`Switch to ${option.name} palette`}
                      onClick={() => {
                        setActivePalette(option)
                        setPaletteMenuOpen(false)
                      }}
                      title={option.name}
                      className="h-4 w-4 rounded-full border border-white/50 transition hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${option.colors.secondary} 0%, ${option.colors.primary} 100%)`,
                        boxShadow: activePalette.id === option.id ? `0 0 0 2px ${option.colors.secondarySoft}` : 'none',
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 flex items-center justify-center">
        <button type="button" aria-label="Open menu" className="flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)]/85 text-[#f7f2e7] shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 sm:h-12 sm:w-12" onClick={() => setMenuOpen((value) => !value)}>
          <Menu size={18} />
        </button>
      </div>

      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex items-center justify-center">
        <button type="button" aria-label={music.isPlaying ? 'Pause music' : 'Play music'} onClick={music.toggle} className="flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)]/90 text-[#f7f2e7] shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 sm:h-12 sm:w-12">
          {music.isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {showTopButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            type="button"
            aria-label="Scroll to top"
            onClick={scrollToTop}
            className="fixed bottom-[calc(5.2rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)]/85 text-[#f7f2e7] shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 md:h-12 md:w-12"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.96 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="fixed inset-x-4 top-20 z-50 rounded-[28px] border border-[var(--brand-secondary)]/30 bg-[var(--brand-primary-deep)]/95 p-4 shadow-[0_22px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-[var(--brand-secondary)]">Menu</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)]/80 p-2 text-[#f7f2e7]">
                <X size={14} />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)]/60 px-3 py-2 text-sm text-[#f7f2e7] transition hover:bg-[var(--brand-primary-soft)]">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)]/60 px-3 py-2">
              <button
                type="button"
                onClick={() => setPaletteMenuOpen((value) => !value)}
                className="flex w-full items-center justify-between gap-2 text-[10px] uppercase tracking-[0.26em] text-[var(--brand-secondary)]"
              >
                <span>Palette</span>
                <ChevronDown size={12} />
              </button>

              <AnimatePresence>
                {paletteMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 flex flex-wrap items-center gap-2 overflow-hidden"
                  >
                    {paletteOptions.map((option) => (
                      <button
                        key={`mobile-menu-${option.id}`}
                        type="button"
                        aria-label={`Switch to ${option.name} palette`}
                        onClick={() => { setActivePalette(option); setMenuOpen(false); setPaletteMenuOpen(false) }}
                        className={`h-4 w-4 rounded-full border-2 ${activePalette.id === option.id ? 'border-white' : 'border-white/40'}`}
                        style={{ background: `linear-gradient(135deg, ${option.colors.secondary} 0%, ${option.colors.primary} 100%)` }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="home" className="relative mx-auto max-w-6xl overflow-x-hidden px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-6 md:pb-20 md:pt-20">
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-8">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="relative w-full max-w-xl rounded-[2rem] border border-[var(--brand-secondary)]/30 bg-[var(--brand-primary-deep)]/95 p-4 text-[var(--brand-neutral)] shadow-[0_35px_90px_rgba(0,0,0,0.2)] sm:p-5 md:p-8">
            <div className="absolute inset-x-8 bottom-4 h-px bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />

            <div className="relative text-center">
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="font-[Georgia] font-bold text-[16px] tracking-[0.18em] text-[var(--brand-secondary)] sm:text-[20px] sm:tracking-[0.42em] md:text-[25px]">
                بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </motion.p>

              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-5 flex items-center justify-center">
                <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-6 font-[Georgia] text-[1.8rem] leading-none tracking-[0.08em] text-[var(--brand-secondary)] sm:text-[2.3rem] sm:tracking-[0.12em] md:text-[4rem]">
                YOU&apos;RE INVITED
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }} className="mt-4 font-[Georgia] text-base tracking-[0.28em] text-[var(--brand-neutral)]/80 md:mt-5 md:text-xl">
                to the
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-4 font-[Georgia] text-3xl tracking-[0.08em] text-[var(--brand-neutral)] md:mt-5 md:text-6xl">
                Nikah
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.8 }} className="mt-5 space-y-1 text-[var(--brand-neutral)] sm:mt-6">
                <div className="font-[Georgia] text-[1.7rem] tracking-[0.06em] text-[var(--brand-secondary)] sm:text-[2.1rem] md:text-[4rem]">{wedding.groom.name}</div>
                <div className="text-xl text-[var(--brand-neutral)] md:text-3xl">&</div>
                <div className="font-[Georgia] text-[1.7rem] tracking-[0.06em] text-[var(--brand-secondary)] sm:text-[2.1rem] md:text-[4rem]">{wedding.bride.name}</div>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.7 }} className="mt-6 text-[10px] uppercase tracking-[0.32em] font-bold text-white sm:text-xs md:mt-8 md:text-sm md:tracking-[0.38em]">
                {wedding.date.gregorian}
              </motion.p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                onClick={handleOpenInvitation}
                className="mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)] px-5 py-3 text-xs font-medium tracking-[0.18em] text-[#f6f0e3] shadow-lg shadow-black/20 transition sm:px-6 sm:text-sm sm:tracking-[0.2em] md:mt-8"
              >
                {invitationState === 'welcome' ? 'Welcome' : 'Open Invitation'}
                <ArrowRight size={16} />
              </motion.button>

              <AnimatePresence>
                {showWelcomeHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-secondary)]/40 bg-[#fffaf2]/90 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#173d38] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                  >
                    <span className="text-[var(--brand-secondary)]">✦</span>
                    Thank you — please scroll down
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {isOpened && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24 pb-20 pt-4 md:space-y-28">
              <motion.section id="story" initial={{ opacity: 0, y: 32, filter: 'blur(10px)', scale: 0.98 }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="relative overflow-hidden rounded-[2rem] border border-[var(--brand-secondary)]/30 bg-[var(--brand-neutral)]/95 p-5 text-[var(--brand-primary-deep)] shadow-[0_32px_70px_rgba(0,0,0,0.12)] md:p-10">
                <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center">
                  <BrideGroomIllustration side="left" className="hidden w-full max-w-[220px] justify-self-start lg:block" />
                  <div className="text-center">
                    <p className="font-[Georgia] font-bold text-[16px] uppercase tracking-[0.18em] text-[var(--brand-secondary)] sm:text-[20px] sm:tracking-[0.45em] md:text-[25px]">بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                    <div className="mt-7 flex items-center justify-center">
                      <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                    </div>
                    <h2 className="mt-7 font-[Georgia] text-3xl leading-tight text-[var(--brand-neutral)] md:text-5xl">Together with our families,</h2>
                    <p className="mt-4 text-base leading-8 text-[var(--brand-neutral)] md:text-xl">we joyfully invite you to celebrate the Nikah of</p>
                    <p className="mt-5 font-[Georgia] text-4xl tracking-[0.08em] text-[var(--brand-secondary)] md:text-6xl">{wedding.groom.name} <span className="mx-2 text-[var(--brand-neutral)]">&</span> {wedding.bride.name}</p>
                    <div className="mt-7 flex justify-center"><Ornament className="h-10 w-52 text-[var(--brand-secondary)]" /></div>
                    <p className="mt-7 text-lg tracking-[0.3em] font-bold text-white md:text-xl">{wedding.date.gregorian}</p>
                  </div>
                  <BrideGroomIllustration side="right" className="hidden w-full max-w-[220px] justify-self-end lg:block" />
                </div>
              </motion.section>

              <section className="relative">
                <div className="mb-10 text-center">
                  <h3 className="font-[Georgia] text-3xl text-[var(--brand-secondary)] md:text-5xl">Counting Down To Our Big Day</h3>
                  <div className="mt-4 flex justify-center">
                    <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                  ].map((item) => (
                    <motion.div key={item.label} initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }} whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[1.5rem] border border-[var(--brand-secondary)]/30 bg-[var(--brand-neutral)]/10 p-4 text-center shadow-lg backdrop-blur-sm md:p-6">
                      <motion.div key={`${item.label}-${item.value}`} initial={{ scale: 0.8, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="font-[Georgia] text-4xl text-[var(--brand-neutral)] md:text-6xl">
                        {String(item.value).padStart(2, '0')}
                      </motion.div>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[var(--brand-secondary)] md:text-xs">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section id="events" className="relative">
                <div className="mb-10 text-center">
                  <h3 className="font-[Georgia] text-3xl text-[var(--brand-secondary)] md:text-5xl">Events</h3>
                  <div className="mt-4 flex justify-center">
                    <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                  </div>
                </div>
                <div className="relative mx-auto max-w-3xl">
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[var(--brand-secondary)] via-[var(--brand-secondary)]/70 to-transparent md:block" />
                  <div className="space-y-8">
                    {wedding.events.map((event, index) => (
                      <motion.div key={event.name} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, filter: 'blur(12px)', scale: 0.98 }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="relative pl-0 md:pl-0">
                        <div className="md:flex md:items-center md:justify-center">
                          <div className={`rounded-[1.5rem] border border-[var(--brand-secondary)]/25 bg-[var(--brand-primary-deep)]/90 p-5 text-[var(--brand-neutral)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:w-[42%] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[var(--brand-neutral)]">
                                {index === 0 ? <CalendarClock size={18} /> : <Clock3 size={18} />}
                              </div>
                              <span className="font-[Georgia] text-2xl text-[var(--brand-secondary)]">{event.name}</span>
                            </div>
                            <p className="mt-5 text-xl font-bold text-[var(--brand-secondary)]">{event.time}</p>
                            <p className="mt-2 text-base font-bold text-[var(--brand-secondary)]">{event.date}</p>
                            <p className="mt-3 text-base text-[var(--brand-neutral)]/80">{event.venue}</p>
                            <p className="mt-4 text-sm leading-7 text-[var(--brand-neutral)]/80">{event.description}</p>
                            <a href={wedding.venue.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--brand-secondary)]/30 bg-[var(--brand-secondary-soft)] px-4 py-2 text-sm text-[var(--brand-primary-deep)]">
                              View Location
                              <MapPin size={14} />
                            </a>
                          </div>
                        </div>
                        <div className="absolute left-0 top-8 hidden h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--brand-secondary)] bg-[var(--brand-primary)] md:left-1/2 md:flex md:-translate-x-1/2" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="venue" className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="p-0 text-[var(--brand-neutral)]">
                  <div className="mb-5 flex items-center justify-center gap-3 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[var(--brand-neutral)]">
                      <MapPin size={18} />
                    </div>
                    <h3 className="font-[Georgia] text-3xl text-[var(--brand-secondary)]">Venue</h3>
                  </div>
                  <div className="mb-5 flex justify-center">
                    <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                  </div>

                  <div className="rounded-[1.5rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-primary-deep)]/35 p-4 md:p-5">
                    <p className="mb-4 text-left text-base leading-7 text-[var(--brand-neutral)]">We would be delighted to celebrate with you at this special gathering.</p>
                    <div className="flex h-56 items-center justify-center rounded-[1.2rem] bg-transparent text-[var(--brand-neutral)] md:h-72">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <MapPin size={34} className="text-[var(--brand-secondary)]" />
                        <p className="font-[Georgia] text-3xl text-[var(--brand-secondary)]">{wedding.venue.name}</p>
                        <p className="text-sm uppercase tracking-[0.28em] text-[var(--brand-neutral)]">Map Preview</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.1rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-primary)]/20 p-4">
                        <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Address</p>
                        <p className="mt-2 text-base text-[var(--brand-neutral)]">{wedding.venue.address}</p>
                        <p className="text-base text-[var(--brand-neutral)]">{wedding.venue.city}</p>
                        <p className="text-base text-[var(--brand-neutral)]">{wedding.venue.country}</p>
                      </div>
                      <div className="space-y-3 rounded-[1.1rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-primary)]/20 p-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Parking</p>
                          <p className="mt-2 text-sm leading-6 text-[var(--brand-neutral)]/80">{wedding.venue.parking}</p>
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-secondary)]">Dress code</p>
                          <p className="mt-2 text-sm leading-6 text-[var(--brand-neutral)]/80">{wedding.venue.dressCode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href={wedding.venue.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)] px-5 py-3 text-sm tracking-[0.18em] text-[var(--brand-neutral)] uppercase shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-neutral)]">
                        Get Directions
                      </a>
                      <a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-secondary-soft)] px-5 py-3 text-sm tracking-[0.18em] text-[var(--brand-primary-deep)] uppercase shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-secondary-soft)] hover:text-[var(--brand-primary-deep)]">
                        Add to Calendar
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="p-0 text-[var(--brand-neutral)]">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center gap-3">
                      <Share2 size={18} className="text-[var(--brand-neutral)]" />
                      <h3 className="font-[Georgia] text-3xl text-[var(--brand-secondary)]">Share Invitation</h3>
                    </div>
                    <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-primary)]/55 p-4 md:p-5">
                    <p className="mb-4 text-left text-base leading-7 text-[var(--brand-neutral)]">Help us spread the joy and share this beautiful moment with your loved ones.</p>
                    <div className="space-y-3">
                      <button type="button" onClick={() => handleShare('whatsapp')} className="flex w-full items-center justify-between rounded-2xl border border-[var(--brand-secondary)]/30 bg-[var(--brand-neutral)]/10 px-4 py-3 text-left text-[var(--brand-neutral)]">
                        <span className="flex items-center gap-3"><Share2 size={16} /> WhatsApp</span>
                        <ArrowRight size={16} />
                      </button>
                      <button type="button" onClick={() => handleShare('copy')} className="flex w-full items-center justify-between rounded-2xl border border-[var(--brand-secondary)]/30 bg-[var(--brand-neutral)]/10 px-4 py-3 text-left text-[var(--brand-neutral)]">
                        <span className="flex items-center gap-3"><Copy size={16} /> Copy Link</span>
                        <ArrowRight size={16} />
                      </button>
                      <button type="button" onClick={() => handleShare('native')} className="flex w-full items-center justify-between rounded-2xl border border-[var(--brand-secondary)]/30 bg-[var(--brand-neutral)]/10 px-4 py-3 text-left text-[var(--brand-neutral)]">
                        <span className="flex items-center gap-3"><Share2 size={16} /> Share</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    {shareStatus && <p className="mt-4 text-sm text-[var(--brand-secondary-soft)]">{shareStatus}</p>}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button type="button" onClick={() => window.open(calendarUrl, '_blank', 'noopener,noreferrer')} className="rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-neutral)]/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--brand-neutral)] shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-neutral)]/5 hover:text-[var(--brand-neutral)]">
                        Google Calendar
                      </button>
                      <button type="button" onClick={handleIcsDownload} className="rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-neutral)]/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--brand-neutral)] shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-neutral)]/5 hover:text-[var(--brand-neutral)]">
                        Download .ics
                      </button>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section id="rsvp" className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="p-0 text-[var(--brand-neutral)]">
                  <div className="mb-3 flex flex-col items-center gap-3 text-center">
                    <p className="flex items-center gap-3 font-[Georgia] text-xl uppercase tracking-[0.35em] text-[var(--brand-secondary)] md:text-2xl"><CalendarClock size={18} className="text-white" /><span>RSVP</span></p>
                    <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                  </div>

                  <div className="rounded-[1.5rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-neutral)]/95 p-4 md:p-6">
                    <p className="text-base leading-7 text-[var(--brand-neutral)]">Your presence would make our celebration even more special. Kindly let us know if you&apos;ll be joining us.</p>

                    <div className="mt-6 space-y-5">
                      <div className="rounded-[1rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-primary)]/5 p-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-[var(--brand-secondary)]">Current RSVP count</p>
                        <p className="mt-2 text-2xl font-[Georgia] text-[var(--brand-neutral)]">{rsvpCount}</p>
                      </div>

                      <div>
                        <label htmlFor="guestName" className="mb-2 block text-sm uppercase tracking-[0.22em] text-[var(--brand-neutral)]">Your Name</label>
                        <input id="guestName" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Enter your name" className="w-full rounded-2xl border px-4 py-3 text-base outline-none ring-0 placeholder:text-[var(--brand-primary-soft)] focus:border-[var(--brand-secondary)]" style={paletteFieldStyle} />
                      </div>

                      <div>
                        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[var(--brand-neutral)]">Will you be attending?</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setAttending('yes')} className="rounded-2xl border px-4 py-3 text-left text-base transition duration-200 hover:scale-[1.025]" style={attending === 'yes' ? { backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary, color: activePalette.colors.neutral } : { backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary, color: activePalette.colors.neutral }}>
                            ✓ Yes, I&apos;ll be there
                          </button>
                          <button type="button" onClick={() => setAttending('no')} className="rounded-2xl border px-4 py-3 text-left text-base transition duration-200 hover:scale-[1.025]" style={attending === 'no' ? { backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary, color: activePalette.colors.neutral } : { backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary, color: activePalette.colors.neutral }}>
                            ✕ Sorry, I can&apos;t make it
                          </button>
                        </div>
                      </div>

                      {attending === 'yes' && (
                        <div>
                          <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[var(--brand-neutral)]">Number of Guests</p>
                          <div className="flex w-fit items-center rounded-full border p-2" style={{ backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary }}>
                            <button type="button" aria-label="Decrease guests" onClick={() => setGuests((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border text-[var(--brand-neutral)]" style={{ backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary }}>-</button>
                            <span className="w-12 text-center text-lg font-medium" style={{ color: activePalette.colors.neutral }}>{guests}</span>
                            <button type="button" aria-label="Increase guests" onClick={() => setGuests((value) => value + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border text-[var(--brand-neutral)]" style={{ backgroundColor: activePalette.colors.primary, borderColor: activePalette.colors.secondary }}>+</button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="message" className="mb-2 block text-sm uppercase tracking-[0.22em] text-[var(--brand-neutral)]">Leave a message for the couple</label>
                        <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} placeholder="Your message..." className="w-full rounded-2xl border px-4 py-3 text-base outline-none placeholder:text-[var(--brand-primary-soft)] focus:border-[var(--brand-secondary)]" style={paletteFieldStyle} />
                      </div>

                      <button type="button" onClick={handleSubmitRSVP} className="inline-flex w-full items-center justify-center rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-primary)] px-5 py-4 text-sm uppercase tracking-[0.24em] text-[var(--brand-neutral)] shadow-lg shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-neutral)]">
                        Send RSVP
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="p-0 text-[var(--brand-neutral)]">
                  <div className="mb-3 flex flex-col items-center gap-3 text-center">
                    <p className="flex items-center gap-3 font-[Georgia] text-xl uppercase tracking-[0.35em] text-[var(--brand-secondary)] md:text-2xl"><Heart size={18} className="text-white" /><span>Guest wishes</span></p>
                    <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                  </div>

                  <div className="rounded-[1.5rem] border border-[var(--brand-secondary)]/15 bg-[var(--brand-primary)]/55 p-4 md:p-5">
                    <p className="mb-4 text-left text-base leading-7 text-[var(--brand-neutral)]">Your duas and words of love mean the world to us.</p>
                    <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                      {wishes.map((wish) => (
                        <div key={`${wish.name}-${wish.text}`} className="rounded-[1.25rem] border border-[var(--brand-secondary)]/25 bg-[var(--brand-neutral)]/8 p-4 text-[var(--brand-neutral)]">
                          <p className="text-base leading-7 text-[var(--brand-neutral)]">“{wish.text}”</p>
                          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--brand-secondary)]">— {wish.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 space-y-3">
                      <input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Your name" className="w-full rounded-2xl border px-4 py-3 text-base outline-none placeholder:text-[var(--brand-primary-soft)]" style={paletteFieldStyle} />
                      <textarea value={wishText} onChange={(event) => setWishText(event.target.value)} rows={3} placeholder="Leave a dua or message..." className="w-full rounded-2xl border px-4 py-3 text-base outline-none placeholder:text-[var(--brand-primary-soft)]" style={paletteFieldStyle} />
                      <button type="button" onClick={addWish} className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-secondary)] bg-[var(--brand-neutral)]/10 px-4 py-3 text-sm uppercase tracking-[0.22em] text-[var(--brand-neutral)] transition-all duration-300 ease-out hover:scale-[1.025] hover:border-[var(--brand-secondary)]">
                        Add Wish
                      </button>
                    </div>
                  </div>
                </motion.div>
              </section>

              <motion.section initial={{ opacity: 0, y: 28, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="relative overflow-hidden rounded-[2rem] border border-[var(--brand-secondary)]/35 bg-[var(--brand-primary-deep)]/95 p-8 text-[var(--brand-neutral)] shadow-[0_25px_60px_rgba(0,0,0,0.12)] md:p-12">
                <div className="relative text-center">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.5em] text-[var(--brand-secondary)]">With Love</p>
                  <p className="mt-5 font-[Georgia] text-5xl leading-tight text-[var(--brand-secondary)] md:text-7xl">بَارَكَ ٱللّٰهُ لَنَا وَلَكُمْ</p>
                  <p className="mt-6 text-lg text-[var(--brand-neutral)] md:text-2xl">With love and duas,</p>
                  <p className="mt-3 font-[Georgia] text-3xl text-[var(--brand-secondary)] md:text-5xl">{wedding.groom.name} <span className="mx-2 text-[var(--brand-neutral)]">&</span> {wedding.bride.name}</p>
                  <p className="mt-6 text-sm uppercase tracking-[0.45em] font-bold text-white">{wedding.date.gregorian}</p>
                </div>
                <div className="mt-10 flex items-center justify-center">
                  <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--brand-secondary)] to-transparent" />
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {rsvpState && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed inset-x-4 bottom-8 z-50 mx-auto max-w-md rounded-[1.5rem] border p-4 shadow-2xl backdrop-blur-xl"
              style={{
                backgroundColor: activePalette.colors.primaryDeep,
                borderColor: activePalette.colors.secondary,
                color: activePalette.colors.neutral,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl" style={{ color: activePalette.colors.secondary }}>✓</p>
                  <h4 className="mt-2 font-[Georgia] text-2xl" style={{ color: activePalette.colors.neutral }}>
                    Thank you, {rsvpState.name || 'friend'}!
                  </h4>
                  <p className="mt-2 text-sm leading-6" style={{ color: activePalette.colors.secondarySoft }}>{rsvpState.message}</p>
                </div>
                <button
                  type="button"
                  aria-label="Dismiss RSVP notification"
                  onClick={() => setRsvpState(null)}
                  className="rounded-full border p-2"
                  style={{ borderColor: activePalette.colors.secondary, color: activePalette.colors.neutral }}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
