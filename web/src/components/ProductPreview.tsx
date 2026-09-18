import { ArrowDownLeft, ArrowUpRight, Eye, Plus, WalletCards } from 'lucide-react'

export function ProductPreview() {
  return (
    <div className="product-orbit" aria-hidden="true">
      <div className="product-phone">
        <div className="product-phone-notch" />
        <div className="product-screen">
          <div className="product-balance">
            <div className="flex items-center justify-between">
              <span className="text-[0.56rem] font-medium text-white/75">Mi cuenta</span>
              <Eye className="size-3 text-white/75" />
            </div>
            <p className="mt-4 text-[0.55rem] text-white/70">Saldo disponible</p>
            <p className="financial-number mt-1 text-xl font-semibold text-white">C$ ••••••</p>
            <p className="mt-3 text-[0.5rem] tracking-[0.09em] text-white/65">•••• ••••</p>
          </div>

          <div className="-mt-5 flex justify-center gap-5">
            <div className="product-quick-action">
              <span><Plus className="size-3.5" /></span>
              <small>Depositar</small>
            </div>
            <div className="product-quick-action">
              <span><ArrowUpRight className="size-3.5" /></span>
              <small>Retirar</small>
            </div>
          </div>

          <div className="mt-6 px-4">
            <div className="flex items-center justify-between">
              <p className="text-[0.58rem] font-semibold text-[var(--text-primary)]">Movimientos</p>
              <WalletCards className="size-3 text-[var(--brand-secondary)]" />
            </div>
            <div className="mt-3 grid gap-2.5">
              <div className="product-movement">
                <span className="bg-[var(--success-soft)] text-[var(--success)]">
                  <ArrowDownLeft className="size-3" />
                </span>
                <div><b>Depósito</b><i>Hoy</i></div>
                <em>+ C$</em>
              </div>
              <div className="product-movement">
                <span className="bg-[var(--cyan-soft)] text-[var(--brand-blue)]">
                  <ArrowUpRight className="size-3" />
                </span>
                <div><b>Retiro</b><i>Ayer</i></div>
                <em>− C$</em>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-float product-float-left">
        <span className="bg-[var(--brand-mint)] text-[var(--brand-primary)]"><Plus className="size-4" /></span>
        <p><b>Depositar</b><small>En pocos pasos</small></p>
      </div>
      <div className="product-float product-float-right">
        <span className="bg-[var(--cyan-soft)] text-[var(--brand-blue)]"><WalletCards className="size-4" /></span>
        <p><b>Tu cuenta</b><small>Siempre a la vista</small></p>
      </div>
    </div>
  )
}
