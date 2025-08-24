"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { EmptyState } from "./ui/empty-state"

interface StockItemsEmptyStateProps {
  onAddStockItem?: () => void
  className?: string
}

export function StockItemsEmptyState({ 
  onAddStockItem, 
  className 
}: StockItemsEmptyStateProps) {
  return (
    <EmptyState
      image="/stock-item-image.png"
      title="No stock items added yet"
      description="Start managing your inventory by adding your first stock item"
      actionLabel="New stock item"
      onAction={onAddStockItem}
      actionIcon={<Plus className="h-4 w-4" />}
      variant="centered"
      className={className}
    />
  )
}
