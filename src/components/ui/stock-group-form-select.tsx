"use client"

import { SelectInput } from "@/components/ui/select-input"

interface StockGroup {
  id: number
  name: string
  description: string
  itemCount: number
  createdAt: string
}

interface StockGroupFormSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  stockGroups: StockGroup[]
  onOpenNestedForm?: () => void
}

export function StockGroupFormSelect({ 
  value, 
  onChange, 
  placeholder = "Select stock group", 
  required = false,
  className = "",
  stockGroups = [],
  onOpenNestedForm
}: StockGroupFormSelectProps) {
  // Convert stock groups to SelectOption format (no "All Stock Groups" option)
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
      showDescriptions={false}
    />
  )
}
