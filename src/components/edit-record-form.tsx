"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerFooter } from "@/components/ui/drawer"
import { SupplierSelect } from "@/components/ui/supplier-select"

interface EditRecordFormProps {
  transaction: {
    id: number
    date: string
    time: string
    type: "Stock in" | "Stock out" | "Initial stock"
    quantity: number
    measuringUnit: string
    party: string
    stockValue: number
    notes: string
  }
  onClose: () => void
  onSubmit: (data: EditRecordData) => void
}

interface EditRecordData {
  quantity: number
  perUnitPrice: number
  party: string
  dateTime: string
  notes: string
}

export function EditRecordForm({ transaction, onClose, onSubmit }: EditRecordFormProps) {
  const [formData, setFormData] = useState<EditRecordData>({
    quantity: transaction.quantity,
    perUnitPrice: transaction.stockValue / transaction.quantity,
    party: transaction.party,
    dateTime: `${transaction.date} ${transaction.time}`,
    notes: transaction.notes
  })



  const handleInputChange = (field: keyof EditRecordData, value: string | number) => {
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
      title={`Edit ${transaction.type.toLowerCase()} record`}
      description={`Update the details for this ${transaction.type.toLowerCase()} transaction.`}
      footer={
        <DrawerFooter
          onCancel={onClose}
          onSubmit={handleSubmitClick}
          submitText="Update record"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity ({transaction.measuringUnit}) *
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder={`E.g. 50 ${transaction.measuringUnit}`}
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

        {/* Party/Supplier */}
        <div className="space-y-2">
          <Label htmlFor="party" className="text-sm font-medium">
            {transaction.type === "Stock in" ? "Supplier name" : "Party"} *
          </Label>
          <SupplierSelect
            value={formData.party}
            onChange={(value) => handleInputChange("party", value)}
            placeholder={`Search or select ${transaction.type === "Stock in" ? "supplier" : "party"}`}
            required
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
            placeholder="Any remarks about this transaction"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />
        </div>
      </form>
    </Drawer>
  )
}
