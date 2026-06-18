interface SpinnerProps {
  size?: "sm" | "md" | "lg"
}

const sizes: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
}

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-brand-light border-t-brand`}
    />
  )
}
