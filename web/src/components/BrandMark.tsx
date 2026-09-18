import { Link } from 'react-router-dom'

export function BrandMark() {
  return (
    <Link
      to="/"
      aria-label="LAFISE, ir al inicio"
      className="group inline-flex items-baseline gap-1.5 rounded-md py-2 focus-visible:outline-offset-4"
    >
      <span className="text-[1.45rem] font-extrabold tracking-[-0.02em] text-[var(--brand-primary-deep)] transition-colors group-hover:text-[var(--brand-primary)]">
        LAFISE
      </span>
      <span className="text-[0.65rem] font-bold tracking-[0.18em] text-[var(--brand-secondary)]">
        DIGITAL
      </span>
    </Link>
  )
}
