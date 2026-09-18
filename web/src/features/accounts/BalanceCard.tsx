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
    <section className="financial-card relative mx-auto w-full max-w-[26rem] overflow-hidden rounded-2xl p-6 text-white shadow-2xl sm:p-7 md:max-w-none md:aspect-[2.1/1] md:rounded-[1.5rem] lg:p-9">
      <div className="relative z-10 flex h-full flex-col justify-between gap-6 md:gap-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <WalletCards aria-hidden="true" className="size-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/70">Cuenta LAFISE</p>
              <p className="font-semibold tracking-[0.06em] text-white/95">{accountNumber}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">LAFISE</span>
            <span className="text-[0.65rem] font-medium tracking-[0.1em] text-white/70">DIGITAL</span>
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/80">Saldo disponible</p>
            <button
              type="button"
              onClick={() => setIsVisible((value) => !value)}
              className="grid size-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white"
              aria-label={isVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              <VisibilityIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="financial-number mt-1 min-h-[3rem] text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-none tracking-tight text-white drop-shadow-sm">
            {isVisible ? formatCurrency(balance) : 'C$ ••••••'}
          </p>
        </div>
      </div>
    </section>
  )
}
