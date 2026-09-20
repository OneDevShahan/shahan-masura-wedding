import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    CalendarClock,
    ChevronUp,
    Clock3,
    Copy,
    MapPin,
    Menu,
    Share2,
    Sparkles,
    Star,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BrideGroomIllustration } from './components/decorations/BrideGroomIllustration'
import { CrescentDecoration } from './components/decorations/CrescentDecoration'
import { IslamicPattern } from './components/decorations/IslamicPattern'
import { Ornament } from './components/decorations/Ornament'
import { initialWishes, navItems, wedding } from './data/wedding'
import { useCountdown } from './hooks/useCountdown'
import { useMusic } from './hooks/useMusic'
import { submitRSVP } from './services/rsvpService'
import { getGoogleCalendarLink, getIcsContent } from './utils/calendar'
import { copyToClipboard, getWhatsAppShareUrl } from './utils/share'

function App() {
  const [isOpened, setIsOpened] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no'>('yes')
  const [guests, setGuests] = useState(2)
  const [message, setMessage] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const [rsvpState, setRsvpState] = useState<{ success: boolean; message: string; name: string } | null>(null)
  const [wishes, setWishes] = useState(initialWishes)
  const [wishName, setWishName] = useState('')
  const [wishText, setWishText] = useState('')
  const [showTopButton, setShowTopButton] = useState(false)
  const [showWelcomeHint, setShowWelcomeHint] = useState(false)

  const countdown = useCountdown(wedding.date.iso)
  const music = useMusic(wedding.music.src, wedding.music.enabled)

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 260)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenInvitation = () => {
    setIsOpened(true)
    setShowWelcomeHint(true)

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

  const galleryCards = useMemo(
    () =>
      wedding.gallery.map((item, index) => ({
        ...item,
        id: `${item.title}-${index}`,
      })),
    [],
  )

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

  const addWish = () => {
    const cleanName = wishName.trim()
    const cleanText = wishText.trim()
    if (!cleanName || !cleanText) return

    setWishes((current) => [{ name: cleanName, text: cleanText }, ...current])
    setWishName('')
    setWishText('')
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#183f38_0%,#0d251f_35%,#071711_100%)] text-[#f7f2e7] antialiased selection:bg-[#d7b779]/30">
      <div className="fixed inset-0 opacity-60" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,183,121,0.08),transparent_40%)]" />
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#dcb974]/10 blur-3xl" />
      </div>

      <nav className="fixed inset-x-0 top-[calc(1rem+env(safe-area-inset-top))] z-40 mx-auto flex max-w-[calc(100%-1.5rem)] items-center justify-between rounded-full border border-[#d6bb7a]/30 bg-[#102d28]/80 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 md:max-w-xl md:px-4">
        <div className="hidden items-center gap-2 text-[#f1e2bb] md:flex">
          <Sparkles size={16} className="text-[#dcb974]" />
          <span className="text-[10px] uppercase tracking-[0.32em]">Invitation</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-[10px] tracking-[0.18em] text-[#f7f2e7]/70 transition hover:text-[#f7f2e7] md:text-[11px]">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40">
        <button type="button" aria-label="Open menu" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b46d]/40 bg-[#102d28]/80 text-[#f7f2e7] shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95" onClick={() => setMenuOpen((value) => !value)}>
          <Menu size={18} />
        </button>
      </div>

      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-3">
        <button type="button" aria-label={music.isPlaying ? 'Pause music' : 'Play music'} onClick={music.toggle} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b46d]/40 bg-[#102d28]/80 text-[#f7f2e7] shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95">
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
            className="fixed bottom-[calc(5.2rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#d8b46d]/40 bg-[#102d28]/85 text-[#f7f2e7] shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 md:h-12 md:w-12"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.96 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="fixed inset-x-4 top-20 z-50 rounded-[28px] border border-[#d8b46d]/40 bg-[#112d2b]/95 p-4 shadow-[0_22px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-[#d8b46d]">Menu</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="rounded-full border border-[#d8b46d]/30 bg-[#183932]/80 p-2 text-[#f7f2e7]">
                <X size={14} />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-full border border-[#d8b46d]/20 bg-[#183932]/60 px-3 py-2 text-sm text-[#f7f2e7] transition hover:bg-[#204a43]">
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="home" className="relative mx-auto max-w-6xl px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-6 md:pb-20 md:pt-20">
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-8">
          <div className="absolute inset-0 opacity-80" aria-hidden="true">
            <IslamicPattern className="absolute inset-x-0 top-0 h-56 w-full text-[#dcb974]/20" />
            <CrescentDecoration className="absolute right-10 top-20 h-20 w-20 text-[#dcb974]/40 md:h-28 md:w-28" />
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="relative w-full max-w-xl rounded-[2rem] border border-[#d5ba80]/30 bg-[#f5efe7]/90 p-5 text-[#1d3d36] shadow-[0_35px_90px_rgba(0,0,0,0.2)] md:p-8">
            <div className="absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-[#caa767] to-transparent" />
            <div className="absolute inset-x-8 bottom-4 h-px bg-gradient-to-r from-transparent via-[#caa767] to-transparent" />

            <div className="text-center">
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="font-[Georgia] text-[10px] tracking-[0.42em] text-[#21463f] md:text-[11px]">
                بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </motion.p>

              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-5 flex items-center justify-center gap-3 text-[#d2a95f]">
                <div className="h-px w-10 bg-[#d2a95f]/60" />
                <Star size={14} fill="currentColor" />
                <div className="h-px w-10 bg-[#d2a95f]/60" />
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-6 font-[Georgia] text-[2.3rem] leading-none tracking-[0.12em] text-[#1a312d] md:text-[4rem]">
                YOU&apos;RE INVITED
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }} className="mt-5 font-[Georgia] text-base tracking-[0.28em] text-[#2e4c45] md:text-xl">
                to the
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-5 font-[Georgia] text-3xl tracking-[0.08em] text-[#1f3a35] md:text-6xl">
                Nikah of
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.8 }} className="mt-6 space-y-1">
                <div className="font-[Georgia] text-[2.1rem] tracking-[0.08em] text-[#183a35] md:text-[4rem]">{wedding.groom.name}</div>
                <div className="text-xl text-[#c59a58] md:text-3xl">&</div>
                <div className="font-[Georgia] text-[2.1rem] tracking-[0.08em] text-[#183a35] md:text-[4rem]">{wedding.bride.name}</div>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.7 }} className="mt-8 text-xs uppercase tracking-[0.38em] text-[#1f3a35]/75 md:text-sm">
                {wedding.date.gregorian}
              </motion.p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                onClick={handleOpenInvitation}
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#caa767] bg-[#1d483f] px-6 py-3 text-sm font-medium tracking-[0.2em] text-[#f6f0e3] shadow-lg shadow-[#0e2d29]/20 transition"
              >
                Open Invitation
                <ArrowRight size={16} />
              </motion.button>

              <AnimatePresence>
                {showWelcomeHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d7b779]/40 bg-[#fffaf2]/90 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#173d38] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                  >
                    <span className="text-[#d19f52]">✦</span>
                    Welcome
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {isOpened && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24 pb-20 pt-4 md:space-y-28">
              <motion.section id="story" initial={{ opacity: 0, y: 32, filter: 'blur(10px)', scale: 0.98 }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="relative overflow-hidden rounded-[2rem] border border-[#d8b46d]/30 bg-[#f4f0e7]/90 p-5 text-[#1d3d36] shadow-[0_32px_70px_rgba(0,0,0,0.12)] md:p-10">
                <div className="absolute inset-0 opacity-50" aria-hidden="true">
                  <IslamicPattern className="absolute -left-10 top-10 h-48 w-48 text-[#d8b46d]/15" />
                  <IslamicPattern className="absolute -right-10 bottom-5 h-52 w-52 text-[#d8b46d]/12" />
                </div>

                <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center">
                  <BrideGroomIllustration side="left" className="hidden w-full max-w-[220px] justify-self-start lg:block" />
                  <div className="text-center">
                    <p className="font-[Georgia] text-[11px] uppercase tracking-[0.45em] text-[#20453f]">بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                    <div className="mt-7 flex items-center justify-center gap-3 text-[#d6b06a]">
                      <div className="h-px w-12 bg-[#d6b06a]/60" />
                      <Star size={14} fill="currentColor" />
                      <div className="h-px w-12 bg-[#d6b06a]/60" />
                    </div>
                    <h2 className="mt-7 font-[Georgia] text-3xl leading-tight text-[#1a302d] md:text-5xl">Together with our families,</h2>
                    <p className="mt-4 text-base leading-8 text-[#294d46] md:text-xl">we joyfully invite you to celebrate the Nikah of</p>
                    <p className="mt-5 font-[Georgia] text-4xl tracking-[0.08em] text-[#183a35] md:text-6xl">{wedding.groom.name} <span className="mx-2 text-[#c59a58]">&</span> {wedding.bride.name}</p>
                    <div className="mt-7 flex justify-center"><Ornament className="h-10 w-52 text-[#d3ae6b]" /></div>
                    <p className="mt-7 text-lg tracking-[0.3em] text-[#1f3a35] md:text-xl">{wedding.date.gregorian}</p>
                    <p className="mt-3 text-base text-[#355b54] md:text-lg">
                      {wedding.venue.name}
                      <span className="mx-2 text-[#d7b779]">•</span>
                      {wedding.venue.city}
                    </p>
                  </div>
                  <BrideGroomIllustration side="right" className="hidden w-full max-w-[220px] justify-self-end lg:block" />
                </div>
              </motion.section>

              <section className="relative">
                <div className="mb-8 text-center">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.5em] text-[#d7b779]">Qur’an</p>
                  <h3 className="mt-4 font-[Georgia] text-3xl text-[#f7f0e4] md:text-5xl">Blessing &amp; Guidance</h3>
                </div>
                <motion.div initial={{ opacity: 0, y: 28, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[2rem] border border-[#d8b46d]/25 bg-[#102d28]/60 p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-10">
                  <p className="font-[Georgia] text-lg leading-9 text-[#f6f0e3] md:text-2xl">“{wedding.quranVerse.translation}”</p>
                  <p className="mt-6 font-[Georgia] text-2xl text-[#d7b779]">{wedding.quranVerse.reference}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.32em] text-[#eae1cf]/80">{wedding.quranVerse.arabic}</p>
                </motion.div>
              </section>

              <section className="relative">
                <div className="mb-10 text-center">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.5em] text-[#d7b779]">Countdown</p>
                  <h3 className="mt-4 font-[Georgia] text-3xl text-[#f7f0e4] md:text-5xl">Counting Down To Our Big Day</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                  ].map((item) => (
                    <motion.div key={item.label} initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }} whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[1.5rem] border border-[#d7b779]/30 bg-[#f6efe3]/10 p-4 text-center shadow-lg backdrop-blur-sm md:p-6">
                      <motion.div key={`${item.label}-${item.value}`} initial={{ scale: 0.8, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="font-[Georgia] text-4xl text-[#f7f2e7] md:text-6xl">
                        {String(item.value).padStart(2, '0')}
                      </motion.div>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[#e9dac0] md:text-xs">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section id="events" className="relative">
                <div className="mb-10 text-center">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.5em] text-[#d7b779]">Events</p>
                  <h3 className="mt-4 font-[Georgia] text-3xl text-[#f7f0e4] md:text-5xl">Our Celebration</h3>
                </div>
                <div className="relative mx-auto max-w-3xl">
                  <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-[#d7b779] via-[#ddc58d] to-transparent md:left-1/2" />
                  <div className="space-y-8">
                    {wedding.events.map((event, index) => (
                      <motion.div key={event.name} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, filter: 'blur(12px)', scale: 0.98 }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="relative">
                        <div className="md:flex md:items-center md:justify-center">
                          <div className={`rounded-[1.5rem] border border-[#d7b779]/30 bg-[#f1efe8]/90 p-5 text-[#1d3d36] shadow-[0_25px_60px_rgba(0,0,0,0.12)] md:w-[42%] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173e39] text-[#f5e7c4]">
                                {index === 0 ? <CalendarClock size={18} /> : <Clock3 size={18} />}
                              </div>
                              <span className="font-[Georgia] text-2xl">{event.name}</span>
                            </div>
                            <p className="mt-5 text-xl font-medium text-[#1f3a35]">{event.time}</p>
                            <p className="mt-2 text-base text-[#375c55]">{event.date}</p>
                            <p className="mt-3 text-base text-[#375c55]">{event.venue}</p>
                            <p className="mt-4 text-sm leading-7 text-[#355950]">{event.description}</p>
                            <a href={wedding.venue.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d7b779]/40 bg-[#f2e8d6] px-4 py-2 text-sm text-[#1c3d38]">
                              View Location
                              <MapPin size={14} />
                            </a>
                          </div>
                        </div>
                        <div className="absolute left-2.5 top-8 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#d7b779] bg-[#163f39] md:left-1/2 md:-translate-x-1/2" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="venue" className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[2rem] border border-[#d8b46d]/25 bg-[#f2efe8]/90 p-5 text-[#1d3d36] shadow-[0_25px_60px_rgba(0,0,0,0.12)] md:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173f39] text-[#f5e7c4]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-[Georgia] text-[11px] uppercase tracking-[0.4em] text-[#d7b779]">Venue</p>
                      <h3 className="mt-2 font-[Georgia] text-3xl">Where We&apos;re Celebrating</h3>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#d7b779]/30 bg-[linear-gradient(135deg,#102d28,#244c45)] p-1">
                    <div className="flex h-56 items-center justify-center rounded-[1.2rem] bg-[radial-gradient(circle_at_center,#f0d8a6_0%,#d2ab68_25%,#27463f_60%,#112b28_100%)] text-[#f7f2e7] md:h-72">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <MapPin size={34} />
                        <p className="font-[Georgia] text-3xl">{wedding.venue.name}</p>
                        <p className="text-sm uppercase tracking-[0.28em]">Map Preview</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-[#d7b779]">Address</p>
                      <p className="mt-2 text-base text-[#1f3a35]">{wedding.venue.address}</p>
                      <p className="text-base text-[#1f3a35]">{wedding.venue.city}</p>
                      <p className="text-base text-[#1f3a35]">{wedding.venue.country}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.3em] text-[#d7b779]">Parking</p>
                      <p className="text-sm leading-6 text-[#2e4d48]">{wedding.venue.parking}</p>
                      <p className="text-sm uppercase tracking-[0.24em] text-[#d7b779]">Dress code</p>
                      <p className="text-sm leading-6 text-[#2e4d48]">{wedding.venue.dressCode}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={wedding.venue.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#183d37] px-5 py-3 text-sm tracking-[0.18em] text-[#f7f2e7] uppercase">
                      Get Directions
                    </a>
                    <a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d7b779]/40 bg-[#f2e8d6] px-5 py-3 text-sm tracking-[0.18em] text-[#1d3d36] uppercase">
                      Add to Calendar
                    </a>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[2rem] border border-[#d8b46d]/25 bg-[#102d28]/70 p-5 text-[#f7f2e7] shadow-[0_25px_60px_rgba(0,0,0,0.15)] md:p-8">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.4em] text-[#d7b779]">Share</p>
                  <h3 className="mt-3 font-[Georgia] text-3xl">Share Invitation</h3>
                  <div className="mt-8 space-y-3">
                    <button type="button" onClick={() => handleShare('whatsapp')} className="flex w-full items-center justify-between rounded-2xl border border-[#d7b779]/30 bg-[#f4ebdc]/10 px-4 py-3 text-left text-[#f7f2e7]">
                      <span className="flex items-center gap-3"><Share2 size={16} /> WhatsApp</span>
                      <ArrowRight size={16} />
                    </button>
                    <button type="button" onClick={() => handleShare('copy')} className="flex w-full items-center justify-between rounded-2xl border border-[#d7b779]/30 bg-[#f4ebdc]/10 px-4 py-3 text-left text-[#f7f2e7]">
                      <span className="flex items-center gap-3"><Copy size={16} /> Copy Link</span>
                      <ArrowRight size={16} />
                    </button>
                    <button type="button" onClick={() => handleShare('native')} className="flex w-full items-center justify-between rounded-2xl border border-[#d7b779]/30 bg-[#f4ebdc]/10 px-4 py-3 text-left text-[#f7f2e7]">
                      <span className="flex items-center gap-3"><Share2 size={16} /> Share</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  {shareStatus && <p className="mt-4 text-sm text-[#e8d8a8]">{shareStatus}</p>}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" onClick={() => window.open(calendarUrl, '_blank', 'noopener,noreferrer')} className="rounded-full border border-[#d7b779]/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f7f2e7]">
                      Google Calendar
                    </button>
                    <button type="button" onClick={handleIcsDownload} className="rounded-full border border-[#d7b779]/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f7f2e7]">
                      Download .ics
                    </button>
                  </div>
                </motion.div>
              </section>

              <section className="relative">
                <div className="mb-8 text-center">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.5em] text-[#d7b779]">Story</p>
                  <h3 className="mt-4 font-[Georgia] text-3xl text-[#f7f0e4] md:text-5xl">Our Story</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {galleryCards.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 26, filter: 'blur(10px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="group overflow-hidden rounded-[1.75rem] border border-[#d7b779]/25 bg-[#f1efe9]/90 shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
                      <div className="relative h-72 overflow-hidden" style={{ background: item.gradient }}>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8), transparent 40%)' }} />
                        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-[#fffaf4]">
                          <span className="font-[Georgia] text-2xl">{item.title}</span>
                          <span className="rounded-full border border-white/40 px-2 py-1 text-[10px] uppercase tracking-[0.2em]">Moments</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section id="rsvp" className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[2rem] border border-[#d8b46d]/25 bg-[#f0eee7]/90 p-5 text-[#1d3d36] shadow-[0_25px_60px_rgba(0,0,0,0.12)] md:p-8">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.4em] text-[#d7b779]">RSVP</p>
                  <h3 className="mt-3 font-[Georgia] text-3xl">Will You Join Us?</h3>
                  <p className="mt-4 text-base leading-7 text-[#325a53]">Your presence would make our celebration even more special. Kindly let us know if you&apos;ll be joining us.</p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label htmlFor="guestName" className="mb-2 block text-sm uppercase tracking-[0.22em] text-[#1d3d36]">Your Name</label>
                      <input id="guestName" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Enter your name" className="w-full rounded-2xl border border-[#d7b779]/35 bg-[#edf2ee]/70 px-4 py-3 text-base text-[#1d3d36] outline-none ring-0 placeholder:text-[#345d56]/60 focus:border-[#d7b779]" />
                    </div>

                    <div>
                      <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[#1d3d36]">Will you be attending?</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setAttending('yes')} className={`rounded-2xl border px-4 py-3 text-left text-base ${attending === 'yes' ? 'border-[#d7b779] bg-[#173f39] text-[#f8f2e6]' : 'border-[#d7b779]/35 bg-[#edf2ee]/70 text-[#1d3d36]'}`}>
                          ✓ Yes, I&apos;ll be there
                        </button>
                        <button type="button" onClick={() => setAttending('no')} className={`rounded-2xl border px-4 py-3 text-left text-base ${attending === 'no' ? 'border-[#d7b779] bg-[#173f39] text-[#f8f2e6]' : 'border-[#d7b779]/35 bg-[#edf2ee]/70 text-[#1d3d36]'}`}>
                          ✕ Sorry, I can&apos;t make it
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm uppercase tracking-[0.22em] text-[#1d3d36]">Number of Guests</p>
                      <div className="flex w-fit items-center rounded-full border border-[#d7b779]/35 bg-[#edf2ee]/70 p-2">
                        <button type="button" aria-label="Decrease guests" onClick={() => setGuests((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173f39] text-[#f8f2e6]">-</button>
                        <span className="w-12 text-center text-lg font-medium text-[#1d3d36]">{guests}</span>
                        <button type="button" aria-label="Increase guests" onClick={() => setGuests((value) => value + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173f39] text-[#f8f2e6]">+</button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm uppercase tracking-[0.22em] text-[#1d3d36]">Leave a message for the couple</label>
                      <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} placeholder="Your message..." className="w-full rounded-2xl border border-[#d7b779]/35 bg-[#edf2ee]/70 px-4 py-3 text-base text-[#1d3d36] outline-none placeholder:text-[#345d56]/60 focus:border-[#d7b779]" />
                    </div>

                    <button type="button" onClick={handleSubmitRSVP} className="inline-flex w-full items-center justify-center rounded-full bg-[#173f39] px-5 py-4 text-sm uppercase tracking-[0.24em] text-[#f7f2e7] shadow-lg shadow-[#0c2a27]/20 transition hover:translate-y-[-1px]">
                      Send RSVP
                    </button>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="rounded-[2rem] border border-[#d8b46d]/25 bg-[#102d28]/70 p-5 text-[#f7f2e7] shadow-[0_25px_60px_rgba(0,0,0,0.15)] md:p-8">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.4em] text-[#d7b779]">Guest Wishes</p>
                  <h3 className="mt-3 font-[Georgia] text-3xl">A Few Words From You</h3>
                  <div className="mt-6 space-y-3">
                    {wishes.map((wish) => (
                      <div key={`${wish.name}-${wish.text}`} className="rounded-[1.25rem] border border-[#d7b779]/25 bg-[#f4ebdc]/8 p-4 text-[#f7f2e7]">
                        <p className="text-base leading-7 text-[#f3ebda]">“{wish.text}”</p>
                        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#d7b779]">— {wish.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3">
                    <input value={wishName} onChange={(event) => setWishName(event.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-[#d7b779]/30 bg-[#f4ebdc]/10 px-4 py-3 text-base text-[#f7f2e7] placeholder:text-[#ecdcb4]/60" />
                    <textarea value={wishText} onChange={(event) => setWishText(event.target.value)} rows={3} placeholder="Leave a dua or message..." className="w-full rounded-2xl border border-[#d7b779]/30 bg-[#f4ebdc]/10 px-4 py-3 text-base text-[#f7f2e7] placeholder:text-[#ecdcb4]/60" />
                    <button type="button" onClick={addWish} className="inline-flex items-center gap-2 rounded-full border border-[#d7b779]/35 bg-[#f4ebdc]/10 px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#f7f2e7]">
                      Add Wish
                    </button>
                  </div>
                </motion.div>
              </section>

              <motion.section initial={{ opacity: 0, y: 28, filter: 'blur(12px)', scale: 0.97 }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} style={{ willChange: 'transform, opacity, filter' }} className="relative overflow-hidden rounded-[2rem] border border-[#d8b46d]/25 bg-[linear-gradient(135deg,#0d312d,#163f39_45%,#d9b978)] p-8 text-[#f7f2e7] shadow-[0_25px_60px_rgba(0,0,0,0.12)] md:p-12">
                <div className="absolute right-8 top-8 opacity-50" aria-hidden="true">
                  <CrescentDecoration className="h-20 w-20 text-[#f4e9d0]" />
                </div>
                <div className="relative text-center">
                  <p className="font-[Georgia] text-[11px] uppercase tracking-[0.5em] text-[#f2dfb0]">With Love</p>
                  <p className="mt-5 font-[Georgia] text-5xl leading-tight text-[#fffaf4] md:text-7xl">بَارَكَ ٱللّٰهُ لَنَا وَلَكُمْ</p>
                  <p className="mt-6 text-lg text-[#f0e3c7] md:text-2xl">With love and duas,</p>
                  <p className="mt-3 font-[Georgia] text-3xl text-[#fffaf4] md:text-5xl">{wedding.groom.name} <span className="mx-2 text-[#f0d89e]">&</span> {wedding.bride.name}</p>
                  <p className="mt-6 text-sm uppercase tracking-[0.45em] text-[#f0e3c7]">{wedding.date.gregorian}</p>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {rsvpState && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed inset-x-4 bottom-8 z-50 mx-auto max-w-md rounded-[1.5rem] border border-[#d8b46d]/30 bg-[#102d28]/90 p-4 text-[#f7f2e7] shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl text-[#f2dba0]">✓</p>
                  <h4 className="mt-2 font-[Georgia] text-2xl">Thank you, {rsvpState.name || 'friend'}!</h4>
                  <p className="mt-2 text-sm leading-6 text-[#f5efea]">{rsvpState.message}</p>
                </div>
                <button type="button" aria-label="Dismiss RSVP notification" onClick={() => setRsvpState(null)} className="rounded-full border border-[#d7b779]/30 p-2">
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
