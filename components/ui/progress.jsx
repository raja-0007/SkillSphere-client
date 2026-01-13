import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const progressVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
        info: "bg-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Progress = React.forwardRef(({ className, value, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-muted transition-colors-smooth",
      className
    )}
    {...props}
  >
    <div
      className={cn(progressVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress, progressVariants }