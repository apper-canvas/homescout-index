import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const buttonVariants = {
  variant: {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:from-primary-600 hover:to-primary-700",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 border border-secondary-300 hover:from-secondary-200 hover:to-secondary-300",
    outline: "border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50",
    ghost: "text-primary-600 hover:bg-primary-50",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:from-accent-600 hover:to-accent-700"
  },
  size: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
}

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-[1.02] active:scale-[0.98]",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button