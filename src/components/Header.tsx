import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Heart,
  House,
  MapPin,
  Palette,
  Sparkles,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { navItems } from '../data/wedding'

export type PaletteOption = {
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

export const paletteOptions: PaletteOption[] = [
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
      primary: '#3c3537',
      primaryDeep: '#211d1f',
      primarySoft: '#6e6265',
      secondary: '#d5a6a1',
      secondarySoft: '#f1d9d5',
      neutral: '#f8f4f0',
      neutralSoft: '#ece4df',
    },
  },
  {
    id: 'olive-champagne',
    name: 'Olive & Champagne',
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

const navIcons = {
  Home: House,
  Events: CalendarDays,
  Venue: MapPin,
  RSVP: ClipboardCheck,
  Wishes: Heart,
} as const

type HeaderProps = {
  activePalette: PaletteOption
  setActivePalette: Dispatch<SetStateAction<PaletteOption>>
  paletteMenuOpen: boolean
  setPaletteMenuOpen: Dispatch<SetStateAction<boolean>>
}

export default function Header({
  activePalette,
  setActivePalette,
  paletteMenuOpen,
  setPaletteMenuOpen,
}: HeaderProps) {
  return (
    <nav
      className="
        fixed
        inset-x-0
        top-[calc(1rem+env(safe-area-inset-top))]
        z-40
        mx-auto
        flex
        h-[5rem]
        max-w-[calc(100%-1.5rem)]
        items-center
        justify-between
        rounded-full
        border
        border-white/10
        bg-[var(--brand-primary-deep)]/90
        px-3
        shadow-[0_12px_28px_rgba(0,0,0,0.22)]
        backdrop-blur-xl
        transition-all
        duration-300
        sm:h-16
        md:h-16
        md:max-w-2xl
        md:px-5
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* Invitation / Logo                                                  */}
      {/* ------------------------------------------------------------------ */}

      <a
        href="#home"
        className="
          flex
          min-w-0
          flex-shrink-0
          items-center
          gap-2
          sm:gap-3
        "
      >
        <Sparkles
          size={20}
          className="text-[var(--brand-secondary)] sm:text-[22px]"
        />

        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-[var(--brand-secondary)]
            transition-transform
            duration-300
            ease-out
            hover:translate-x-1
            hover:scale-[1.1]
            sm:text-[10px]
            md:text-[11px]
          "
        >
          Invitation
        </span>
      </a>

      {/* ------------------------------------------------------------------ */}
      {/* Navigation Icons                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-1 items-center justify-evenly gap-1 sm:gap-2 md:gap-4">
        {navItems.map((item) => {
          const Icon =
            navIcons[item.label as keyof typeof navIcons]

          return (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="
                group
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[var(--brand-secondary)]
                transition-all
                duration-300
                ease-out
                hover:scale-110
                hover:bg-[var(--brand-secondary)]/10
              "
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />

              {/* Tooltip stays inside header */}
              <span
                className="
                  pointer-events-none
                  absolute
                  bottom-[calc(100%-0.35rem)]
                  left-1/2
                  z-[100]
                  -translate-x-1/2
                  translate-y-1
                  whitespace-nowrap
                  rounded-md
                  border
                  border-[var(--brand-secondary)]
                  bg-[var(--brand-primary-deep)]
                  px-2.5
                  py-1
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--brand-secondary)]
                  opacity-0
                  shadow-lg
                  transition-all
                  duration-200
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                {item.label}
              </span>
            </a>
          )
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Desktop Palette                                                     */}
      {/* ------------------------------------------------------------------ */}

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
            className="
              group
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--brand-secondary)]
              text-[var(--brand-secondary)]
              transition-all
              duration-300
              hover:scale-105
              hover:bg-[var(--brand-secondary)]/10
              focus:outline-none
            "
          >
            <Palette
              size={17}
              strokeWidth={2}
            />

            <ChevronDown
              size={11}
              className="
                absolute
                -right-0.5
                -bottom-0.5
                rounded-full
                bg-[var(--brand-primary-deep)]
              "
            />

            {/* Palette tooltip - same style as Home etc */}
            <span
              className="
                pointer-events-none
                absolute
                bottom-[calc(100%-0.35rem)]
                left-1/2
                z-[100]
                -translate-x-1/2
                translate-y-1
                whitespace-nowrap
                rounded-md
                border
                border-[var(--brand-secondary)]
                bg-[var(--brand-primary-deep)]
                px-2.5
                py-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--brand-secondary)]
                opacity-0
                shadow-lg
                transition-all
                duration-200
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              Palette
            </span>
          </button>

          <AnimatePresence>
            {paletteMenuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.18,
                  ease: 'easeOut',
                }}
                onMouseEnter={() =>
                  setPaletteMenuOpen(true)
                }
                onMouseLeave={() =>
                  setPaletteMenuOpen(false)
                }
                className="
                  absolute
                  right-0
                  top-[calc(100%+0.5rem)]
                  z-50
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--brand-secondary)]
                  bg-[var(--brand-primary-deep)]/95
                  p-2
                  shadow-[0_12px_24px_rgba(0,0,0,0.2)]
                  backdrop-blur-xl
                "
              >
                {paletteOptions.map((option) => (
                  <button
                    key={`desktop-${option.id}`}
                    type="button"
                    aria-label={`Switch to ${option.name} palette`}
                    onClick={() => {
                      setActivePalette(option)
                      setPaletteMenuOpen(false)
                    }}
                    title={option.name}
                    className="
                      h-5
                      w-5
                      shrink-0
                      rounded-full
                      border
                      border-white/50
                      transition
                      hover:scale-110
                    "
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${option.colors.secondary} 0%,
                        ${option.colors.primary} 100%
                      )`,
                      boxShadow:
                        activePalette.id === option.id
                          ? `0 0 0 2px ${option.colors.secondarySoft}`
                          : 'none',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Palette                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative md:hidden">
        <div
          onMouseEnter={() => setPaletteMenuOpen(true)}
          onMouseLeave={() => setPaletteMenuOpen(false)}
          onFocus={() => setPaletteMenuOpen(true)}
          onBlur={() => setPaletteMenuOpen(false)}
          className="group relative"
        >
          <button
            type="button"
            aria-label="Palette"
            title="Palette"
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--brand-secondary)]
              text-[var(--brand-secondary)]
              transition-all
              duration-300
              hover:scale-105
              hover:bg-[var(--brand-secondary)]/10
              focus:outline-none
              focus:ring-1
              focus:ring-[var(--brand-secondary)]/50
            "
          >
            <Palette
              size={17}
              strokeWidth={2}
            />

            <ChevronDown
              size={11}
              className="
                absolute
                -right-0.5
                -bottom-0.5
                rounded-full
                bg-[var(--brand-primary-deep)]
              "
            />

            {/* Mobile Palette tooltip */}
            <span
              className="
                pointer-events-none
                absolute
                bottom-[calc(100%-0.35rem)]
                left-1/2
                z-[100]
                -translate-x-1/2
                translate-y-1
                whitespace-nowrap
                rounded-md
                border
                border-[var(--brand-secondary)]
                bg-[var(--brand-primary-deep)]
                px-2.5
                py-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--brand-secondary)]
                opacity-0
                shadow-lg
                transition-all
                duration-200
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              Palette
            </span>
          </button>

          <AnimatePresence>
            {paletteMenuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.18,
                  ease: 'easeOut',
                }}
                onMouseEnter={() =>
                  setPaletteMenuOpen(true)
                }
                onMouseLeave={() =>
                  setPaletteMenuOpen(false)
                }
                className="
                  absolute
                  right-0
                  top-[calc(100%+0.5rem)]
                  z-50
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--brand-secondary)]
                  bg-[var(--brand-primary-deep)]/95
                  p-2
                  shadow-[0_12px_24px_rgba(0,0,0,0.2)]
                  backdrop-blur-xl
                "
              >
                {paletteOptions.map((option) => (
                  <button
                    key={`mobile-${option.id}`}
                    type="button"
                    aria-label={`Switch to ${option.name} palette`}
                    onClick={() => {
                      setActivePalette(option)
                      setPaletteMenuOpen(false)
                    }}
                    title={option.name}
                    className="
                      h-5
                      w-5
                      shrink-0
                      rounded-full
                      border
                      border-white/50
                      transition
                      hover:scale-110
                    "
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${option.colors.secondary} 0%,
                        ${option.colors.primary} 100%
                      )`,
                      boxShadow:
                        activePalette.id === option.id
                          ? `0 0 0 2px ${option.colors.secondarySoft}`
                          : 'none',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}