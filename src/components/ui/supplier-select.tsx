"use client"

import { SelectInput } from "@/components/ui/select-input"

interface Supplier {
  id: number
  legalName: string
  phoneNumber: string
  taxNumber: string
  email: string
  address: string
  contactPerson: string
  createdAt: string
  lastUpdated: string
}

interface SupplierSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  suppliers: Supplier[]
  onAddSupplier?: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'lastUpdated'>) => void
  onOpenNestedForm?: () => void
}

export function SupplierSelect({ 
  value, 
  onChange, 
  placeholder = "Select supplier", 
  required = false,
  className = "",
  suppliers = [],
  // onAddSupplier,
  onOpenNestedForm
}: SupplierSelectProps) {
  // Convert suppliers to SelectOption format
  const options = suppliers.map(supplier => ({
    id: supplier.id,
    label: supplier.legalName,
    description: supplier.contactPerson
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
      nestedFormLabel="Create a new supplier"
      showNestedFormButton={true}
    />
  )
}
