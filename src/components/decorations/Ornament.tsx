export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 40" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20H180" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="100" cy="20" r="5" fill="currentColor" opacity="0.9" />
        <circle cx="180" cy="20" r="4" fill="currentColor" opacity="0.8" />
        <path d="M34 8C46 16 54 20 64 20C54 20 46 24 34 32" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M136 8C148 16 156 20 166 20C156 20 148 24 136 32" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
    </div>
  )
}
