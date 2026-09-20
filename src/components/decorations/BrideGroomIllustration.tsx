type BrideGroomIllustrationProps = {
  side: 'left' | 'right'
  className?: string
}

export function BrideGroomIllustration({ side, className = '' }: BrideGroomIllustrationProps) {
  const isLeft = side === 'left'

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 220 300" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="260" rx="70" ry="26" fill="rgba(0,0,0,0.12)" />
        <g transform={isLeft ? 'translate(10 10)' : 'translate(-10 10)'}>
          <path d="M80 80C80 51 103 28 132 28C161 28 184 51 184 80V100H80V80Z" fill="rgba(249,236,204,0.9)" />
          <path d="M97 84H170C176 84 182 89 182 95V210H85V95C85 89 91 84 97 84Z" fill="rgba(14,53,47,0.9)" />
          <path d="M112 101H155V146H112V101Z" fill="rgba(249,236,204,0.7)" />
          <circle cx="133" cy="98" r="34" fill="rgba(244,220,175,0.8)" />
          <path d="M90 180C95 146 117 130 133 130C149 130 171 146 176 180V210H90V180Z" fill="rgba(22,50,46,0.9)" />
          <path d="M68 214H198V230H68V214Z" fill="rgba(179,150,90,0.95)" />
          <path d="M130 150C144 150 156 162 156 176V210H104V176C104 162 116 150 130 150Z" fill="rgba(31,39,35,0.8)" />
          <path d="M118 168L107 152L90 165L99 188L118 168Z" fill="rgba(179,150,90,0.7)" />
          <path d="M146 168L157 152L174 165L165 188L146 168Z" fill="rgba(179,150,90,0.7)" />
        </g>
      </svg>
    </div>
  )
}
