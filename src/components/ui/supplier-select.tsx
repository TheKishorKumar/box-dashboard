"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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
}

export function SupplierSelect({ 
  value, 
  onChange, 
  placeholder = "Search or select supplier", 
  required = false,
  className = "",
  suppliers = [],
  onAddSupplier
}: SupplierSelectProps) {
  const [supplierSearch, setSupplierSearch] = useState(value)
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false)
  const [showCreateSupplier, setShowCreateSupplier] = useState(false)
  const [newSupplierData, setNewSupplierData] = useState({
    legalName: "",
    phoneNumber: "",
    taxNumber: "",
    email: "",
    address: "",
    contactPerson: ""
  })

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.legalName.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.email.toLowerCase().includes(supplierSearch.toLowerCase())
  )

  const handleCreateSupplier = () => {
    if (newSupplierData.legalName.trim() && onAddSupplier) {
      onAddSupplier(newSupplierData)
      onChange(newSupplierData.legalName)
      setSupplierSearch(newSupplierData.legalName)
      setNewSupplierData({
        legalName: "",
        phoneNumber: "",
        taxNumber: "",
        email: "",
        address: "",
        contactPerson: ""
      })
      setShowCreateSupplier(false)
      setIsSupplierDropdownOpen(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setNewSupplierData(prev => ({
      ...prev,
      [field]: value
    }))
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
                  onChange(supplier.legalName)
                  setSupplierSearch(supplier.legalName)
                  setIsSupplierDropdownOpen(false)
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="font-medium">{supplier.legalName}</div>
                {supplier.contactPerson && (
                  <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                )}
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
                  placeholder="Legal name"
                  value={newSupplierData.legalName}
                  onChange={(e) => handleInputChange("legalName", e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateSupplier()
                    }
                  }}
                />
                <Input
                  placeholder="Contact person (optional)"
                  value={newSupplierData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  className="h-8 text-sm"
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
                      setNewSupplierData({
                        legalName: "",
                        phoneNumber: "",
                        taxNumber: "",
                        email: "",
                        address: "",
                        contactPerson: ""
                      })
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
