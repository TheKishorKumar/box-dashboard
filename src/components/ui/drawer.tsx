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
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="mt-6">
          {children}
        </div>
        {footer && (
          <div className="mt-6 pt-6 border-t">
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
    <div className="flex gap-3">
      <Button variant="outline" onClick={onCancel} className="flex-1">
        Cancel
      </Button>
      <Button onClick={onSubmit} className="flex-1">
        {submitText}
      </Button>
    </div>
  )
}
