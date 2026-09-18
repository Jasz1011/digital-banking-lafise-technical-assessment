import { Eye, EyeOff, WalletCards } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../lib/formatters'

interface BalanceCardProps {
  accountNumber: string
  balance: number
}

export function BalanceCard({ accountNumber, balance }: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true)
  const VisibilityIcon = isVisible ? EyeOff : Eye

  return (
    <section className="financial-card rounded-[var(--radius-xl)] p-6 text-white shadow-[var(--shadow-float)] sm:p-8 lg:p-10">
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/20">
            <WalletCards aria-hidden="true" className="size-5" />
          </span>
          <p className="text-sm font-semibold tracking-[-0.04em] text-white/92">LAFISE</p>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/72">Saldo disponible</p>
            <button
              type="button"
              onClick={() => setIsVisible((value) => !value)}
              className="grid size-8 place-items-center rounded-full text-white/70 transition hover:bg-white/12 hover:text-white"
              aria-label={isVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              <VisibilityIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="financial-number mt-2 min-h-14 text-[clamp(2.4rem,7vw,4.25rem)] font-semibold leading-none">
            {isVisible ? formatCurrency(balance) : 'C$ ••••••'}
          </p>
        </div>

        <div className="mt-10 border-t border-white/18 pt-5">
          <p className="text-xs text-white/60">Número de cuenta</p>
          <p className="mt-1 text-sm font-medium tracking-[0.065em] text-white/95 sm:text-base">
            {accountNumber}
          </p>
        </div>
      </div>
    </section>
  )
}
