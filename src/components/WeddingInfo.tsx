import { AnimatePresence, motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { useState } from 'react'

type WeddingInfoProps = {
  rsvpCount: number
  wishesCount: number
  visitorCount: number
}

export default function WeddingInfo({
  rsvpCount,
  wishesCount,
  visitorCount,
}: WeddingInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeInfo = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Wedding information"
        aria-expanded={isOpen}
        className={`relative z-[60] flex h-[3.1rem] w-[3.1rem] shrink-0 items-center justify-center rounded-full border shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 ease-out active:scale-95 sm:h-12 sm:w-12 ${
          isOpen
            ? 'border-[var(--brand-secondary)] bg-[var(--brand-secondary)] text-[var(--brand-primary)]'
            : 'border-[var(--brand-secondary)] bg-[var(--brand-primary)]/90 text-[#f7f2e7] hover:scale-105'
        }`}
      >
        <Info size={18} strokeWidth={2} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close information"
              onClick={closeInfo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto fixed inset-0 z-[45] cursor-default bg-black/20 backdrop-blur-[2px] md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              className="pointer-events-auto fixed bottom-[calc(11rem+env(safe-area-inset-bottom))] left-4 right-6 z-[50] mx-auto max-h-[calc(100svh-12rem)] w-auto max-w-[300px] overflow-y-auto rounded-[1.35rem] border border-[var(--brand-secondary)]/30 bg-[var(--brand-primary-deep)]/95 p-4 text-[var(--brand-neutral)] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:bottom-[calc(11rem+env(safe-area-inset-bottom))] sm:left-auto sm:right-6 sm:mx-0 sm:w-[300px]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand-secondary)]">
                    Celebration
                  </p>

                  <p className="mt-1 font-[Georgia] text-lg text-[var(--brand-neutral)]">
                    A little something
                  </p>
                </div>

                <button
                  type="button"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    closeInfo()
                  }}
                  aria-label="Close information"
                  className="relative z-[60] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--brand-neutral)]/70 transition-all duration-200 hover:bg-white/5 hover:text-[var(--brand-neutral)] active:scale-90"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="space-y-2">
                <InfoRow label="RSVPs" value={rsvpCount} />
                <InfoRow label="Wishes" value={wishesCount} />
                <InfoRow label="Unique visitors" value={visitorCount} />
              </div>
              <div className="mt-5 pt-3">
                <div
                    className="
                    mb-3
                    h-px
                    w-full
                    bg-gradient-to-r
                    from-transparent
                    via-[var(--brand-secondary)]
                    to-transparent
                    opacity-70
                    "
                />

                <p className="text-center text-[11px] leading-relaxed text-[var(--brand-neutral)]/60">
                    Thank you for being a part of our celebration.
                </p>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

type InfoRowProps = {
  label: string
  value: number
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[var(--brand-secondary)]
                    bg-[var(--brand-secondary)]/[0.025]
                    px-4
                    py-3
                    shadow-[inset_0_0_18px_rgba(212,175,55,0.025)]
                    ">
      <span className="text-sm text-[var(--brand-neutral)]/65">
        {label}
      </span>

      <span className="font-[Georgia] text-lg text-[var(--brand-secondary)]">
        {value}
      </span>
    </div>
  )
}