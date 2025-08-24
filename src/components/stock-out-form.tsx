"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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

  const [showCreateSupplier, setShowCreateSupplier] = useState(false)
  const [newSupplierName, setNewSupplierName] = useState("")
  const [supplierSearch, setSupplierSearch] = useState("")
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false)
  const [suppliers, setSuppliers] = useState([
    { id: "supplier-1", name: "ABC Suppliers" },
    { id: "supplier-2", name: "XYZ Corporation" },
    { id: "supplier-3", name: "Quality Foods Ltd" },
    { id: "supplier-4", name: "Fresh Market Supplies" }
  ])

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(supplierSearch.toLowerCase())
  )

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

  const handleCreateSupplier = () => {
    if (newSupplierName.trim()) {
      const newSupplier = {
        id: `supplier-${Date.now()}`,
        name: newSupplierName.trim()
      }
      setSuppliers(prev => [...prev, newSupplier])
      handleInputChange("supplier", newSupplier.id)
      handleInputChange("supplierName", newSupplier.name)
      setSupplierSearch(newSupplier.name)
      setNewSupplierName("")
      setShowCreateSupplier(false)
      setIsSupplierDropdownOpen(false)
    }
  }

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.supplier-dropdown')) {
        setIsSupplierDropdownOpen(false)
      }
    }

    if (isSupplierDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSupplierDropdownOpen])

  return (
    <Drawer
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={`Deduct stock for ${itemName}`}
      description="Record new stock received for this item. This will update the available quantity and keep your inventory accurate."
      footer={
        <DrawerFooter
          onCancel={onClose}
          onSubmit={handleSubmitClick}
          submitText="Deduct stock"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Per Unit Price */}
        <div className="space-y-2">
          <Label htmlFor="perUnitPrice" className="text-sm font-medium">
            Per unit price (₹)
          </Label>
          <Input
            id="perUnitPrice"
            type="number"
            placeholder="E.g. 120"
            value={formData.perUnitPrice || ""}
            onChange={(e) => handleInputChange("perUnitPrice", parseFloat(e.target.value) || 0)}
          />
        </div>

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
            <div className="relative supplier-dropdown">
              <Input
                placeholder="Search or select supplier"
                value={supplierSearch}
                onChange={(e) => {
                  setSupplierSearch(e.target.value)
                  if (!isSupplierDropdownOpen) setIsSupplierDropdownOpen(true)
                }}
                onFocus={() => setIsSupplierDropdownOpen(true)}
                className="w-full"
                required
              />
              
              {isSupplierDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {/* Suppliers List - Fixed height for 5 items */}
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredSuppliers.map((supplier) => (
                      <button
                        key={supplier.id}
                        type="button"
                        onClick={() => {
                          handleInputChange("supplier", supplier.id)
                          handleInputChange("supplierName", supplier.name)
                          setSupplierSearch(supplier.name)
                          setIsSupplierDropdownOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {supplier.name}
                      </button>
                    ))}
                  </div>
                  
                  {/* Separator */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* Create New Supplier */}
                  <div className="p-3">
                    {showCreateSupplier ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter supplier name"
                          value={newSupplierName}
                          onChange={(e) => setNewSupplierName(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleCreateSupplier()
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCreateSupplier}
                            className="flex-1 h-8 text-sm"
                            style={{ backgroundColor: '#D8550D' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                          >
                            Create
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowCreateSupplier(false)
                              setNewSupplierName("")
                            }}
                            className="flex-1 h-8 text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateSupplier(true)}
                        className="w-full h-8 text-sm justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create a new supplier
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
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
