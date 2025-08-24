"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  side?: "left" | "right"
  maxWidth?: "sm" | "md" | "lg" | "xl"
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  maxWidth = "md"
}: DrawerProps) {
  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md", 
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl"
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={side} 
        className={`${maxWidthClasses[maxWidth]} w-full flex flex-col`}
      >
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
  cancelText?: string
  submitText?: string
  submitDisabled?: boolean
  submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function DrawerFooter({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  submitDisabled = false,
  submitVariant = "default"
}: DrawerFooterProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        variant={submitVariant}
        onClick={onSubmit}
        disabled={submitDisabled}
        className="flex-1"
        style={submitVariant === "default" ? { backgroundColor: '#D8550D' } : undefined}
        onMouseEnter={submitVariant === "default" ? (e) => e.currentTarget.style.backgroundColor = '#A8420A' : undefined}
        onMouseLeave={submitVariant === "default" ? (e) => e.currentTarget.style.backgroundColor = '#D8550D' : undefined}
      >
        {submitText}
      </Button>
    </>
  )
}
