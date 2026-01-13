import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-600 active:bg-primary-700 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-600 active:bg-secondary-700 shadow-sm",
        accent: "bg-accent text-accent-foreground hover:bg-accent-600 active:bg-accent-700 shadow-sm",
        success: "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 shadow-sm",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 shadow-sm",
        error: "bg-error text-error-foreground hover:bg-error/90 active:bg-error/80 shadow-sm",
        info: "bg-info text-info-foreground hover:bg-info/90 active:bg-info/80 shadow-sm",
        destructive: "bg-error text-error-foreground hover:bg-error/90 active:bg-error/80 shadow-sm",
        outline: "border border-input bg-white dark:bg-slate-900 hover:bg-muted hover:text-foreground active:bg-muted/80",
        ghost: "hover:bg-muted hover:text-foreground active:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-600 active:text-primary-700",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary-600 hover:to-secondary-600 shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }