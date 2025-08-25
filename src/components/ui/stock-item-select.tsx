"use client"

import { SelectInput } from "@/components/ui/select-input"

interface StockItem {
  id: number
  name: string
  category: string
  measuringUnit: string
  quantity: number
  status: string
  lastUpdated: string
  image: string
  description: string
  reorderLevel: number
  icon: string
  price: number
  supplier: string
}

interface StockItemSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  stockItems: StockItem[]
  onOpenNestedForm?: () => void
}

export function StockItemSelect({ 
  value, 
  onChange, 
  placeholder = "Search or select stock item", 
  required = false,
  className = "",
  stockItems = [],
  onOpenNestedForm
}: StockItemSelectProps) {
  // Convert stock items to SelectOption format
  const options = stockItems.map(item => ({
    id: item.id,
    label: item.name,
    description: `${item.category} • ${item.quantity} ${item.measuringUnit}`
  }))

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
      options={options}
      onOpenNestedForm={onOpenNestedForm}
      nestedFormLabel="Create a new stock item"
      showNestedFormButton={true}
    />
  )
}
