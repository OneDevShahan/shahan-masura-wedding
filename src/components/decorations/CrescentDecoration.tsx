export function CrescentDecoration({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="66" cy="60" r="32" fill="currentColor" fillOpacity="0.18" />
        <path
          d="M65 26C82 26 97 41 97 58C97 75 82 90 65 90C52 90 39 82 33 70C39 76 48 80 58 80C75 80 89 66 89 49C89 41 85 34 79 29C74 27 69 26 65 26Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
      </svg>
    </div>
  )
}
