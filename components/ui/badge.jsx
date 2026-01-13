import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors-fast focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary-600",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-600",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent-600",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/90",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/90",
        error: "border-transparent bg-error text-error-foreground hover:bg-error/90",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/90",
        destructive: "border-transparent bg-error text-error-foreground hover:bg-error/90",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        muted: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs rounded-md",
        lg: "px-3 py-1 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({ className, variant, size, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }