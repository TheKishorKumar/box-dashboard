"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

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

interface SupplierFormData {
  legalName: string
  phoneNumber: string
  taxNumber: string
  email: string
  address: string
  contactPerson: string
}

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>
  onSubmit: (data: SupplierFormData) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isEditing?: boolean
}

export function SupplierForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  submitLabel = "Save Supplier",
  cancelLabel = "Cancel",
  isEditing = false
}: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    legalName: "",
    phoneNumber: "",
    taxNumber: "",
    email: "",
    address: "",
    contactPerson: "",
    ...initialData
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.legalName.trim()) {
      return // Let parent handle validation
    }
    
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="legal-name" className="text-sm font-medium">
            Legal name *
          </Label>
          <Input 
            id="legal-name" 
            placeholder="E.g. ABC Suppliers Pvt. Ltd." 
            className="w-full"
            value={formData.legalName}
            onChange={(e) => handleInputChange("legalName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-person" className="text-sm font-medium">
            Contact person
          </Label>
          <Input 
            id="contact-person" 
            placeholder="E.g. John Doe" 
            className="w-full"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-number" className="text-sm font-medium">
            Phone number
          </Label>
          <Input 
            id="phone-number" 
            placeholder="E.g. +977 1-2345678" 
            className="w-full"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input 
            id="email" 
            type="email"
            placeholder="E.g. contact@abcsuppliers.com" 
            className="w-full"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax-number" className="text-sm font-medium">
            Tax number
          </Label>
          <Input 
            id="tax-number" 
            placeholder="E.g. 123456789" 
            className="w-full"
            value={formData.taxNumber}
            onChange={(e) => handleInputChange("taxNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address
          </Label>
          <Textarea 
            id="address" 
            placeholder="E.g. 123 Main Street, Kathmandu, Nepal" 
            className="w-full"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Footer with actions */}
      <div className="flex gap-3 px-6 py-4 border-t mt-auto">
        <Button 
          type="button"
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button 
          type="submit"
          className="text-white flex-1" 
          style={{ backgroundColor: '#D8550D' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
