"use client"

import { Plus, Minus } from "lucide-react"

interface StockManagementMenuProps {
  onStockIn: () => void
  onStockOut: () => void
}

export function StockManagementMenu({ onStockIn, onStockOut }: StockManagementMenuProps) {
  return (
    <div className="p-2">
      {/* Record Purchase Option */}
      <button
        onClick={onStockIn}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Record Purchase</span>
      </button>
      
      {/* Record Usage Option */}
      <button
        onClick={onStockOut}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Minus className="h-4 w-4" />
        <span>Record Usage</span>
      </button>
    </div>
  )
}
