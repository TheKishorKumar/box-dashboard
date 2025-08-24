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
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <div className="px-6 flex-1">
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
          
          <div className="space-y-6 mt-6">
            {children}
          </div>
        </div>

        {footer && (
          <div className="flex gap-3 px-6 py-4 border-t mt-auto">
            {footer}
          </div>
        )}
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
