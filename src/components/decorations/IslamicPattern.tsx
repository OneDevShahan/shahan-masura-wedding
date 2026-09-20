export function IslamicPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none opacity-80 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.2">
          <path d="M100 16L100 184M16 100H184M52 52L148 148M148 52L52 148M35 100C35 62 62 35 100 35C138 35 165 62 165 100C165 138 138 165 100 165C62 165 35 138 35 100Z" />
          <path d="M100 42L122 100L100 158L78 100L100 42Z" />
          <path d="M42 100L100 78L158 100L100 122L42 100Z" />
        </g>
      </svg>
    </div>
  )
}
