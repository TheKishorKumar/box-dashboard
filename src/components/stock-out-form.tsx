"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerFooter } from "@/components/ui/drawer"
import { SupplierSelect } from "@/components/ui/supplier-select"

interface StockOutFormProps {
  itemName: string
  measuringUnit: string
  currentStock: number
  onClose: () => void
  onSubmit: (data: StockOutData) => void
}

interface StockOutData {
  perUnitPrice: number
  quantity: number
  reasonForDeduction: string
  supplier?: string
  supplierName?: string
  dateTime: string
  notes: string
}

export function StockOutForm({ itemName, measuringUnit, currentStock, onClose, onSubmit }: StockOutFormProps) {
  const [formData, setFormData] = useState<StockOutData>({
    perUnitPrice: 0,
    quantity: 0,
    reasonForDeduction: "",
    supplier: "",
    supplierName: "",
    dateTime: new Date().toISOString().slice(0, 16), // Current date and time
    notes: ""
  })



  const handleInputChange = (field: keyof StockOutData, value: string | number) => {
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
      title={`Record Usage for ${itemName}`}
      description="Record stock used in operations. This reduces your available inventory."
      footer={
        <DrawerFooter
          onCancel={onClose}
          onSubmit={handleSubmitClick}
          submitText="Record Usage"
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
            max={currentStock}
            required
          />
        </div>

        {/* Reason for Deduction */}
        <div className="space-y-2">
          <Label htmlFor="reasonForDeduction" className="text-sm font-medium">
            Reason for deduction
          </Label>
          <Select
            value={formData.reasonForDeduction}
            onValueChange={(value) => handleInputChange("reasonForDeduction", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason for deduction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="returned-to-supplier">Returned to supplier</SelectItem>
              <SelectItem value="used-for-dishes">Used for dishes</SelectItem>
              <SelectItem value="wasted">Wasted</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Supplier Selection - Conditional */}
        {formData.reasonForDeduction === "returned-to-supplier" && (
          <div className="space-y-2">
            <Label htmlFor="supplier" className="text-sm font-medium">
              Select supplier *
            </Label>
            <SupplierSelect
              value={formData.supplierName || ""}
              onChange={(value) => {
                handleInputChange("supplierName", value)
                // Generate a unique ID for the supplier
                const supplierId = `supplier-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                handleInputChange("supplier", supplierId)
              }}
              placeholder="Search or select supplier"
              required
            />
          </div>
        )}

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

        {/* Per Unit Price - Optional */}
        <div className="space-y-2">
          <Label htmlFor="perUnitPrice" className="text-sm font-medium">
            Per unit price (रु) (Optional)
          </Label>
          <Input
            id="perUnitPrice"
            type="number"
                          placeholder="E.g. रु 120"
            value={formData.perUnitPrice || ""}
            onChange={(e) => handleInputChange("perUnitPrice", parseFloat(e.target.value) || 0)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any remarks about this stock-out"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />
        </div>
      </form>
    </Drawer>
  )
}
