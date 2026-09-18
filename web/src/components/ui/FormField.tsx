import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { cn } from '../../lib/styles'

interface FieldFrameProps {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

function FieldFrame({ id, label, error, hint, children }: FieldFrameProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="grid gap-2.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p
          id={descriptionId}
          className={cn(
            'text-xs leading-5',
            error ? 'text-[var(--danger)]' : 'text-[var(--text-tertiary)]',
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  )
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  hint?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, error, hint, className, ...props }, ref) => (
    <FieldFrame id={id} label={label} error={error} hint={hint}>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          'min-h-13 w-full rounded-2xl border bg-white px-4 text-[0.95rem] text-[var(--text-primary)] transition placeholder:text-[var(--text-placeholder)] hover:border-[var(--border-strong)] focus:border-[var(--brand-secondary)] focus:ring-4 focus:ring-[var(--focus-ring)] focus:outline-none',
          error ? 'border-[var(--danger)]' : 'border-[var(--border)]',
          className,
        )}
        {...props}
      />
    </FieldFrame>
  ),
)

InputField.displayName = 'InputField'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  error?: string
  hint?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, error, hint, className, children, ...props }, ref) => (
    <FieldFrame id={id} label={label} error={error} hint={hint}>
      <select
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          'min-h-13 w-full rounded-2xl border bg-white px-4 text-[0.95rem] text-[var(--text-primary)] transition hover:border-[var(--border-strong)] focus:border-[var(--brand-secondary)] focus:ring-4 focus:ring-[var(--focus-ring)] focus:outline-none',
          error ? 'border-[var(--danger)]' : 'border-[var(--border)]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </FieldFrame>
  ),
)

SelectField.displayName = 'SelectField'
