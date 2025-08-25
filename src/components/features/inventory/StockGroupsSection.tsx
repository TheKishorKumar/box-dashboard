"use client"

import { StockGroup } from "@/types"

interface StockGroupsSectionProps {
  stockGroups: StockGroup[]
  setStockGroups: (groups: StockGroup[]) => void
  addToast: (type: 'success' | 'error' | 'warning', message: string) => void
}

export function StockGroupsSection({
  stockGroups,
  setStockGroups,
  addToast
}: StockGroupsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Stock Groups</h2>
          <p className="text-gray-600 mt-1">Organize your inventory into logical groups for better management.</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">Stock groups functionality would be implemented here.</p>
      </div>
    </div>
  )
}
