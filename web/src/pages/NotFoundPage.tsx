import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 text-center">
      <div>
        <p className="financial-number text-7xl font-semibold text-[var(--brand-primary)]">404</p>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">Esta página no está disponible</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          Revisa la dirección o vuelve al inicio.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white hover:bg-[var(--brand-primary-dark)]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
