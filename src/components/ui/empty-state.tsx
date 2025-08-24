"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps extends React.ComponentProps<"div"> {
  image?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: React.ReactNode
  variant?: "default" | "centered"
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    image, 
    title, 
    description, 
    actionLabel, 
    onAction, 
    actionIcon,
    variant = "default",
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-full",
          variant === "centered" && "min-h-[400px]",
          className
        )}
        {...props}
      >
                 <div className="w-full bg-gray-50 rounded-xl py-12 px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
                         {image && (
               <div className="mb-3">
                 <img 
                   src={image} 
                   alt="" 
                   className="h-30 w-30 object-contain"
                   aria-hidden="true"
                 />
               </div>
             )}
            
                         <div className="space-y-2">
               <h3 className="text-2xl font-semibold text-gray-900">
                 {title}
               </h3>
              {description && (
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>

                         {actionLabel && onAction && (
               <Button 
                 onClick={onAction}
                 className="mt-6 text-white"
                 style={{ backgroundColor: '#D8550D' }}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
               >
                 {actionIcon}
                 {actionLabel}
               </Button>
             )}
          </div>
        </div>
      </div>
    )
  }
)

EmptyState.displayName = "EmptyState"

export { EmptyState }
