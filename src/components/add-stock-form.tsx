"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerFooter } from "@/components/ui/drawer"
import { SupplierSelect } from "@/components/ui/supplier-select"

interface AddStockFormProps {
  itemName: string
  measuringUnit: string
  onClose: () => void
  onSubmit: (data: AddStockData) => void
}

interface AddStockData {
  quantity: number
  perUnitPrice: number
  supplierName: string
  dateTime: string
  notes: string
}

function AddStockForm({ itemName, measuringUnit, onClose, onSubmit }: AddStockFormProps) {
  const [formData, setFormData] = useState<AddStockData>({
    quantity: 0,
    perUnitPrice: 0,
    supplierName: "",
    dateTime: new Date().toISOString().slice(0, 16), // Current date and time
    notes: ""
  })

  const handleInputChange = (field: keyof AddStockData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleSubmitClick = () => {
    onSubmit(formData)
  }

  return (
    <Drawer
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={`Add stock for ${itemName}`}
      description="Record new stock received for this item. This will update the available quantity and keep your inventory accurate."
      footer={
        <DrawerFooter
          onCancel={onClose}
          onSubmit={handleSubmitClick}
          submitText="Add stock"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity ({measuringUnit}) *
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder={`E.g. 50 ${measuringUnit}`}
            value={formData.quantity || ""}
            onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        {/* Per Unit Price */}
        <div className="space-y-2">
          <Label htmlFor="perUnitPrice" className="text-sm font-medium">
            Per unit price (₹) *
          </Label>
          <Input
            id="perUnitPrice"
            type="number"
            placeholder="E.g. 120"
            value={formData.perUnitPrice || ""}
            onChange={(e) => handleInputChange("perUnitPrice", parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        {/* Supplier Name */}
        <div className="space-y-2">
          <Label htmlFor="supplierName" className="text-sm font-medium">
            Supplier name
          </Label>
          <SupplierSelect
            value={formData.supplierName}
            onChange={(value) => handleInputChange("supplierName", value)}
            placeholder="Search or select supplier"
          />
        </div>

        {/* Date and Time */}
        <div className="space-y-2">
          <Label htmlFor="dateTime" className="text-sm font-medium">
            Date and time
          </Label>
          <Input
            id="dateTime"
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => handleInputChange("dateTime", e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any remarks about this stock-in"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />
        </div>
      </form>
    </Drawer>
  )
}

export { AddStockForm }
