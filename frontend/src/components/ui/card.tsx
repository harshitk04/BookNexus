import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: "scale" | "shadow" | "both"
    animationProps?: {
      initial?: Record<string, unknown>
      animate?: Record<string, unknown>
      transition?: Record<string, unknown>
    }
  }

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { 
      className, 
      hoverEffect = "shadow", 
      animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
      },
      ...props 
    }, 
    ref
  ) => {
    const baseClasses = cn(
      "bg-white rounded-xl border border-gray-200 overflow-hidden",
      "transition-all duration-300",
      {
        "hover:shadow-lg": hoverEffect === "shadow",
        "hover:scale-[1.02]": hoverEffect === "scale",
        "hover:scale-[1.02] hover:shadow-lg": hoverEffect === "both",
      },
      className
    )

    return (
        <motion.div
        ref={ref}
        className={baseClasses}
        initial={animationProps.initial}
        animate={animationProps.animate}
        transition={animationProps.transition}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 } 
        }}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pb-0", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardFooter }