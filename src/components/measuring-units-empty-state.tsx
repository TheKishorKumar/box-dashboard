"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { EmptyState } from "./ui/empty-state"

interface MeasuringUnitsEmptyStateProps {
  onAddMeasuringUnit?: () => void
  className?: string
}

export function MeasuringUnitsEmptyState({ 
  onAddMeasuringUnit, 
  className 
}: MeasuringUnitsEmptyStateProps) {
  return (
    <EmptyState
      image="/stock-item-image.png"
      title="No measuring units added yet"
      description="Start managing your measurement units by adding your first unit"
      actionLabel="Add First Measuring Unit"
      onAction={onAddMeasuringUnit}
      actionIcon={<Plus className="h-4 w-4" />}
      variant="centered"
      className={className}
    />
  )
}
