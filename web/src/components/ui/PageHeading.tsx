import type { ReactNode } from 'react'

interface PageHeadingProps {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
  align?: 'left' | 'center'
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
}: PageHeadingProps) {
  return (
    <header
      className={
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'flex flex-col gap-5 md:flex-row md:items-end md:justify-between'
      }
    >
      <div className={align === 'center' ? '' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brand-primary)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.045em] text-[var(--text-primary)]">
          {title}
        </h1>
        <p
          className={`mt-4 text-[0.95rem] leading-7 text-[var(--text-secondary)] md:text-base ${
            align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl'
          }`}
        >
          {description}
        </p>
      </div>
      {action}
    </header>
  )
}
