import { motion } from 'framer-motion'
import type { CountdownState } from '../../hooks/useCountdown'
import type { WeddingStage } from '../../utils/weddingStage'

type WeddingCountdownProps = {
  countdown: CountdownState
  stage: WeddingStage
}

const countdownItems = [
  {
    label: 'Days',
    key: 'days',
  },
  {
    label: 'Hours',
    key: 'hours',
  },
  {
    label: 'Minutes',
    key: 'minutes',
  },
  {
    label: 'Seconds',
    key: 'seconds',
  },
] as const

export default function WeddingCountdown({
  countdown,
  stage,
}: WeddingCountdownProps) {
  if (stage === 'baraat-day') {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{
            color: 'var(--brand-secondary)',
          }}
        >
          The day has arrived
        </p>

        <h3
          className="mt-3 font-[Georgia] text-3xl md:text-4xl"
          style={{
            color: 'var(--brand-neutral)',
          }}
        >
          Today is the day ✨
        </h3>

        <p
          className="mt-3 text-sm leading-6"
          style={{
            color: 'var(--brand-neutral-soft)',
          }}
        >
          With the blessings of Allah,
          our wedding celebration is
          happening today.
        </p>
      </div>
    )
  }

  if (stage === 'walima-day') {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{
            color: 'var(--brand-secondary)',
          }}
        >
          Today
        </p>

        <h3
          className="mt-3 font-[Georgia] text-3xl md:text-4xl"
          style={{
            color: 'var(--brand-neutral)',
          }}
        >
          Dawat-e-Walima
        </h3>

        <p
          className="mt-3 text-sm leading-6"
          style={{
            color: 'var(--brand-neutral-soft)',
          }}
        >
          We warmly welcome you to join
          us for the Walima celebration
          this evening.
        </p>
      </div>
    )
  }

  if (stage === 'walima-celebration') {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{
            color: 'var(--brand-secondary)',
          }}
        >
          Celebration
        </p>

        <h3
          className="mt-3 font-[Georgia] text-3xl md:text-4xl"
          style={{
            color: 'var(--brand-neutral)',
          }}
        >
          Dawat-e-Walima ✨
        </h3>

        <p
          className="mt-3 text-sm leading-6"
          style={{
            color: 'var(--brand-neutral-soft)',
          }}
        >
          The celebration is underway.
          Thank you for being part of our
          special day.
        </p>
      </div>
    )
  }

  if (stage === 'after-event') {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{
            color: 'var(--brand-secondary)',
          }}
        >
          With gratitude
        </p>

        <h3
          className="mt-3 font-[Georgia] text-3xl md:text-4xl"
          style={{
            color: 'var(--brand-neutral)',
          }}
        >
          The celebration continues
        </h3>

        <p
          className="mt-3 text-sm leading-6"
          style={{
            color: 'var(--brand-neutral-soft)',
          }}
        >
          JazakAllah Khair for your duas,
          love, and presence in our wedding
          journey.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {countdownItems.map(({ label, key }) => {
          const value = countdown[key]

          return (
            <motion.div
              key={label}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl border p-4 text-center backdrop-blur-sm"
              style={{
                borderColor:
                  'var(--brand-secondary)',
                backgroundColor:
                  'var(--brand-primary-deep)',
              }}
            >
              <p
                className="font-[Georgia] text-3xl md:text-4xl"
                style={{
                  color: 'var(--brand-neutral)',
                }}
              >
                {String(value).padStart(2, '0')}
              </p>

              <p
                className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em]"
                style={{
                  color: 'var(--brand-secondary)',
                }}
              >
                {label}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}