import type { LucideIcon } from 'lucide-react'
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface StatusPanelProps {
  tone?: 'neutral' | 'error'
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function StatusPanel({
  tone = 'neutral',
  icon: Icon = tone === 'error' ? AlertCircle : Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: StatusPanelProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="flex min-h-48 flex-col items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-soft)] px-6 py-10 text-center"
    >
      <span
        className={`mb-4 grid size-11 place-items-center rounded-full ${
          tone === 'error'
            ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
            : 'bg-[var(--brand-mint)] text-[var(--brand-primary)]'
        }`}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" className="mt-5" onClick={onAction}>
          <RefreshCw aria-hidden="true" className="size-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
