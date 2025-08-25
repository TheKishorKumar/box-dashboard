"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Drawer({ open, onOpenChange, title, description, children, footer }: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full relative">
        <div className="flex flex-col h-full">
          {/* Header section - fixed */}
          <div className="px-6 flex-shrink-0">
            <SheetHeader className="pl-0">
              <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription>
                  {description}
                </SheetDescription>
              )}
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

interface DrawerFooterProps {
  onCancel: () => void
  onSubmit: () => void
  submitText: string
}

export function DrawerFooter({ onCancel, onSubmit, submitText }: DrawerFooterProps) {
  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button 
        type="button"
        onClick={onSubmit}
        className="text-white flex-1" 
        style={{ backgroundColor: '#D8550D' }} 
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} 
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
      >
        {submitText}
      </Button>
    </>
  )
}
