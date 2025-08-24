"use client"

import { Plus, Minus } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface StockManagementMenuProps {
  onStockIn: () => void
  onStockOut: () => void
}

export function StockManagementMenu({ onStockIn, onStockOut }: StockManagementMenuProps) {
  return (
    <>
      {/* Stock In Option */}
      <DropdownMenuItem onClick={onStockIn}>
        <Plus className="mr-2 h-4 w-4" />
        <span>Stock in</span>
      </DropdownMenuItem>
      
      {/* Stock Out Option */}
      <DropdownMenuItem onClick={onStockOut}>
        <Minus className="mr-2 h-4 w-4" />
        <span>Stock out</span>
      </DropdownMenuItem>
    </>
  )
}
