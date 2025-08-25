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
  variant?: "default" | "select-like"
  showDescriptions?: boolean
}

export function StockGroupSelect({ 
  value, 
  onChange, 
  placeholder = "Select stock group", 
  required = false,
  className = "",
  stockGroups = [],
  onOpenNestedForm,
  variant = "select-like",
  showDescriptions = true
}: StockGroupSelectProps) {
  // Convert stock groups to SelectOption format, including "All Stock Groups" option
  const options = [
    { id: "all", label: "All Stock Groups", description: "Show all stock groups" },
    ...stockGroups.map(group => ({
      id: group.id,
      label: group.name,
      description: group.description
    }))
  ]

  return (
    <SelectInput
      value={value === "all" ? "All Stock Groups" : value}
      onChange={(newValue) => {
        // Convert "All Stock Groups" back to "all" for the parent component
        onChange(newValue === "All Stock Groups" ? "all" : newValue)
      }}
      placeholder={placeholder}
      required={required}
      className={className}
      options={options}
      onOpenNestedForm={onOpenNestedForm}
      nestedFormLabel="Create a new stock group"
      showNestedFormButton={!!onOpenNestedForm}
      variant={variant}
      showDescriptions={showDescriptions}
    />
  )
}
