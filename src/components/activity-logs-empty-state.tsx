"use client"

import * as React from "react"
import { Activity } from "lucide-react"
import { EmptyState } from "./ui/empty-state"

interface ActivityLogsEmptyStateProps {
  className?: string
}

export function ActivityLogsEmptyState({ 
  className 
}: ActivityLogsEmptyStateProps) {
  return (
    <EmptyState
      image="/stock-item-image.png"
      title="No activity logs found"
      description="Start recording stock movements to see activity history"
      variant="centered"
      className={className}
    />
  )
}
