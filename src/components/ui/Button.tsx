import { Spinner } from "./Spinner"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  intent?: "primary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
}

const intents: Record<NonNullable<ButtonProps["intent"]>, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  outline: "border-2 border-brand text-brand hover:bg-brand-light",
  ghost:   "text-brand hover:bg-surface-section",
  danger:  "bg-red-600 text-white hover:bg-red-700",
}

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-[13px] px-4 py-1.5 rounded-lg",
  md: "text-[14px] px-6 py-2.5 rounded-xl",
  lg: "text-[15px] px-8 py-3.5 rounded-xl",
}

export function Button({
  loading = false,
  intent = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-colors
        ${intents[intent]}
        ${sizes[size]}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
