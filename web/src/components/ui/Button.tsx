import { LoaderCircle } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/styles'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-primary)] text-white shadow-[0_10px_26px_rgba(0,157,78,0.2)] hover:-translate-y-0.5 hover:bg-[var(--brand-primary-dark)]',
  secondary:
    'border border-[var(--border)] bg-white text-[var(--brand-primary-dark)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-mint)]',
  ghost: 'bg-transparent text-[var(--brand-primary-dark)] hover:bg-[var(--brand-mint)]',
  danger:
    'bg-[var(--danger)] text-white shadow-[0_10px_26px_rgba(197,57,70,0.18)] hover:-translate-y-0.5 hover:bg-[var(--danger-dark)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-6 text-[0.95rem]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
