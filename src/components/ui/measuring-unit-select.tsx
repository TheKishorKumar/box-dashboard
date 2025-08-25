"use client"

import { SelectInput } from "@/components/ui/select-input"

interface MeasuringUnit {
  id: number
  name: string
  abbreviation: string
  createdAt: string
}

interface MeasuringUnitSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  measuringUnits: MeasuringUnit[]
  onOpenNestedForm?: () => void
  variant?: "default" | "select-like"
  showDescriptions?: boolean
}

export function MeasuringUnitSelect({ 
  value, 
  onChange, 
  placeholder = "Select measuring unit", 
  required = false,
  className = "",
  measuringUnits = [],
  onOpenNestedForm,
  variant = "select-like",
  showDescriptions = true
}: MeasuringUnitSelectProps) {
  // Convert measuring units to SelectOption format
  const options = measuringUnits.map(unit => ({
    id: unit.id,
    label: unit.name,
    description: unit.abbreviation
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
      nestedFormLabel="Create a new measuring unit"
      showNestedFormButton={!!onOpenNestedForm}
      variant={variant}
      showDescriptions={showDescriptions}
    />
  )
}
