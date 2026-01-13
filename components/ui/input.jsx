import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground transition-colors-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring hover:border-ring/50",
        success: "border-success focus-visible:ring-success hover:border-success/70",
        warning: "border-warning focus-visible:ring-warning hover:border-warning/70",
        error: "border-error focus-visible:ring-error hover:border-error/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Input = React.forwardRef(({ className, type, variant, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// Label component for better form styling
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

// Form field wrapper for consistent spacing
const FormField = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  />
))
FormField.displayName = "FormField"

// Form message for validation feedback
const FormMessage = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const messageVariants = {
    default: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning", 
    error: "text-error",
  }
  
  return (
    <p
      ref={ref}
      className={cn("text-sm", messageVariants[variant], className)}
      {...props}
    />
  )
})
FormMessage.displayName = "FormMessage"

export { Input, Label, FormField, FormMessage, inputVariants }