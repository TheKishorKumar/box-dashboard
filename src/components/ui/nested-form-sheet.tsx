"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ReactNode } from "react"

interface NestedFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function NestedFormSheet({ 
  open, 
  onOpenChange, 
  onBack, 
  title, 
  description, 
  children, 
  footer 
}: NestedFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full z-[60] relative">
        <div className="flex flex-col h-full">
          {/* Header section - fixed */}
          <div className="px-6 flex-shrink-0">
            <SheetHeader className="pl-0">
              {/* Back button */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">
                    {title}
                  </SheetTitle>
                  {description && (
                    <SheetDescription>
                      {description}
                    </SheetDescription>
                  )}
                </div>
              </div>
            </SheetHeader>
            
            {/* Separator line */}
            <div className="border-b border-gray-200 mb-6"></div>
          </div>

          {/* Content section - scrollable with bottom padding for footer */}
          <div className="flex-1 overflow-y-auto px-6 pb-20">
            <div className="space-y-6">
              {children}
            </div>
          </div>

          {/* Footer section - absolutely positioned at bottom of drawer */}
          {footer && (
            <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
              <div className="flex gap-3 px-6 py-4">
                {footer}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface NestedFormFooterProps {
  onBack: () => void
  onSubmit: () => void
  submitLabel?: string
  backLabel?: string
}

export function NestedFormFooter({ 
  onBack, 
  onSubmit, 
  submitLabel = "Save", 
  backLabel = "Back" 
}: NestedFormFooterProps) {
  return (
    <>
      <Button 
        type="button"
        variant="outline" 
        className="flex-1"
        onClick={onBack}
      >
        {backLabel}
      </Button>
      <Button 
        type="submit"
        className="text-white flex-1" 
        style={{ backgroundColor: '#D8550D' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
        onClick={onSubmit}
      >
        {submitLabel}
      </Button>
    </>
  )
}
