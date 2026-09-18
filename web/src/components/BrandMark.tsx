import { Link } from 'react-router-dom'

export function BrandMark() {
  return (
    <Link
      to="/"
      aria-label="LAFISE, ir al inicio"
      className="group inline-flex items-baseline gap-2 rounded-md py-2 focus-visible:outline-offset-4"
    >
      <span className="text-[1.35rem] font-bold tracking-[-0.055em] text-[var(--brand-primary-dark)] transition-colors group-hover:text-[var(--brand-primary)]">
        LAFISE
      </span>
      <span className="text-[0.68rem] font-semibold tracking-[0.08em] text-[var(--brand-secondary)]">
        DIGITAL
      </span>
    </Link>
  )
}
