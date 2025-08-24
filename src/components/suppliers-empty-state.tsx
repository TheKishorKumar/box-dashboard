"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { EmptyState } from "./ui/empty-state"

interface SuppliersEmptyStateProps {
  onAddSupplier?: () => void
  className?: string
}

export function SuppliersEmptyState({ 
  onAddSupplier, 
  className 
}: SuppliersEmptyStateProps) {
  return (
    <EmptyState
      image="/stock-item-image.png"
      title="No suppliers added yet"
      description="Start managing your suppliers by adding your first supplier"
      actionLabel="New supplier"
      onAction={onAddSupplier}
      actionIcon={<Plus className="h-4 w-4" />}
      variant="centered"
      className={className}
    />
  )
}
