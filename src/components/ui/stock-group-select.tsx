"use client"

import { SelectInput } from "@/components/ui/select-input"

interface StockGroup {
  id: number
  name: string
  description: string
  itemCount: number
  createdAt: string
}

interface StockGroupSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  stockGroups: StockGroup[]
  onOpenNestedForm?: () => void
}

export function StockGroupSelect({ 
  value, 
  onChange, 
  placeholder = "Search or select stock group", 
  required = false,
  className = "",
  stockGroups = [],
  onOpenNestedForm
}: StockGroupSelectProps) {
  // Convert stock groups to SelectOption format
  const options = stockGroups.map(group => ({
    id: group.id,
    label: group.name,
    description: group.description
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
      nestedFormLabel="Create a new stock group"
      showNestedFormButton={!!onOpenNestedForm}
    />
  )
}
