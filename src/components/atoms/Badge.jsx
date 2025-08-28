import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const badgeVariants = {
  variant: {
    default: "bg-primary-100 text-primary-700 border border-primary-200",
    secondary: "bg-secondary-100 text-secondary-700 border border-secondary-200",
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    error: "bg-red-100 text-red-700 border border-red-200"
  }
}

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants.variant[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge