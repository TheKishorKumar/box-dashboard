"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SupplierSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function SupplierSelect({ 
  value, 
  onChange, 
  placeholder = "Search or select supplier", 
  required = false,
  className = ""
}: SupplierSelectProps) {
  const [supplierSearch, setSupplierSearch] = useState(value)
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false)
  const [showCreateSupplier, setShowCreateSupplier] = useState(false)
  const [newSupplierName, setNewSupplierName] = useState("")
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

  const handleCreateSupplier = () => {
    if (newSupplierName.trim()) {
      const newSupplier = {
        id: `supplier-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: newSupplierName.trim()
      }
      setSuppliers(prev => [...prev, newSupplier])
      onChange(newSupplier.name)
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
    <div className={`relative supplier-dropdown ${className}`}>
      <Input
        placeholder={placeholder}
        value={supplierSearch}
        onChange={(e) => {
          setSupplierSearch(e.target.value)
          onChange(e.target.value)
          if (!isSupplierDropdownOpen) setIsSupplierDropdownOpen(true)
        }}
        onFocus={() => setIsSupplierDropdownOpen(true)}
        className="w-full"
        required={required}
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
                  onChange(supplier.name)
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
  )
}
