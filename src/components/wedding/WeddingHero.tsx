import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { WeddingStage } from '../../utils/weddingStage'
import { wedding } from '../../data/wedding'

type WeddingHeroProps = {
  stage: WeddingStage
  onOpenInvitation: () => void
}

export default function WeddingHero({
  stage,
  onOpenInvitation,
}: WeddingHeroProps) {
  const isPast = stage === 'after-event'

  const isWeddingDay = stage === 'baraat-day'

  const isWalima =
    stage === 'walima-day' ||
    stage === 'walima-celebration'

  if (isPast) {
    return (
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 text-center"
      >
        <div className="relative z-10 mx-auto max-w-2xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.4em]"
            style={{
              color: 'var(--brand-secondary)',
            }}
          >
            Alhamdulillah
          </p>

          <h1
            className="mt-5 font-[Georgia] text-5xl leading-tight md:text-7xl"
            style={{
              color: 'var(--brand-neutral)',
            }}
          >
            A beautiful
            <br />
            beginning
          </h1>

          <p
            className="mx-auto mt-6 max-w-lg text-sm leading-7"
            style={{
              color: 'var(--brand-neutral-soft)',
            }}
          >
            Thank you for being part of
            Masura Farheen & Shahan Ahmad's
            wedding journey. May Allah fill
            their life together with barakah,
            love, mercy, and peace.
          </p>

          <div
            className="mx-auto mt-8 h-px w-24"
            style={{
              backgroundColor:
                'var(--brand-secondary)',
            }}
          />
        </div>
      </section>
    )
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 text-center"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <p
          className="text-sm tracking-[0.35em]"
          style={{
            color: 'var(--brand-secondary)',
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        <p
          className="mt-8 text-xs font-semibold uppercase tracking-[0.4em]"
          style={{
            color: 'var(--brand-secondary)',
          }}
        >
          {isWeddingDay
            ? 'Wedding Day'
            : isWalima
              ? 'Dawat-e-Walima'
              : "You're Invited"}
        </p>

        <h1
          className="mt-5 font-[Georgia] text-5xl leading-tight md:text-7xl"
          style={{
            color: 'var(--brand-neutral)',
          }}
        >
          Masura Farheen

          <span
            className="my-2 block text-2xl italic md:text-3xl"
            style={{
              color: 'var(--brand-secondary)',
            }}
          >
            &
          </span>

          Shahan Ahmad
        </h1>

        <p
          className="mt-6 text-lg"
          style={{
            color: 'var(--brand-neutral-soft)',
          }}
        >
          {isWeddingDay
            ? 'Today we begin a beautiful journey together.'
            : isWalima
              ? wedding.date.secondDay
              : wedding.date.gregorian}
        </p>

        {!isWeddingDay && !isWalima && (
          <motion.button
            type="button"
            onClick={onOpenInvitation}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
            style={{
              backgroundColor:
                'var(--brand-secondary)',
              color:
                'var(--brand-primary-deep)',
            }}
          >
            Open Invitation

            <ArrowRight size={16} />
          </motion.button>
        )}

        {isWeddingDay && (
          <p
            className="mt-8 text-sm leading-7"
            style={{
              color:
                'var(--brand-neutral-soft)',
            }}
          >
            Welcome to our wedding
            celebration. We are grateful to
            have you with us.
          </p>
        )}

        {isWalima && (
          <p
            className="mt-8 text-sm leading-7"
            style={{
              color:
                'var(--brand-neutral-soft)',
            }}
          >
            We warmly welcome you to
            celebrate the Walima with us.
          </p>
        )}
      </div>
    </section>
  )
}