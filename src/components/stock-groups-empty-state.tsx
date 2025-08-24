"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { EmptyState } from "./ui/empty-state"

interface StockGroupsEmptyStateProps {
  onAddStockGroup?: () => void
  className?: string
}

export function StockGroupsEmptyState({ 
  onAddStockGroup, 
  className 
}: StockGroupsEmptyStateProps) {
  return (
    <EmptyState
      image="/stock-item-image.png"
      title="No stock groups added yet"
      description="Start organizing your inventory by adding your first stock group"
      actionLabel="Add First Stock Group"
      onAction={onAddStockGroup}
      actionIcon={<Plus className="h-4 w-4" />}
      variant="centered"
      className={className}
    />
  )
}
