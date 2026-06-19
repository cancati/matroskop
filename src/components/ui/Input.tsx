import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-brand mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            {...props}
            className={`
              w-full border rounded-xl px-4 py-3 bg-white text-brand
              focus:outline-none focus:ring-2 transition-all text-[15px]
              placeholder:text-muted/60
              ${error
                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border-form-border focus:ring-brand/20 focus:border-brand"
              }
              ${rightElement ? "pr-12" : ""}
              ${className}
            `}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
