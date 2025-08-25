// Centralized type definitions for the restaurant inventory management system

export interface StockItem {
  id: number
  name: string
  category: string
  measuringUnit: string
  quantity: number
  status: "Available" | "Low Quantity" | "Out of Stock"
  lastUpdated: string
  image: string
  description: string
  reorderLevel: number
  icon: string
  price: number
  supplier: string
}

export interface StockTransaction {
  id: number
  stockItemId: number
  date: string
  time: string
  type: "Purchase" | "Usage" | "Opening Stock"
  quantity: number
  measuringUnit: string
  party: string
  stockValue: number
  notes: string
}

export interface MeasuringUnit {
  id: number
  name: string
  abbreviation: string
  createdAt: string
}

export interface StockGroup {
  id: number
  name: string
  description: string
  itemCount: number
  createdAt: string
}

export interface Supplier {
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

export interface Toast {
  id: number
  type: "success" | "error" | "warning"
  message: string
  action?: {
    label: string
    action: () => void
  }
}

// Form data interfaces
export interface StockItemFormData {
  name: string
  category: string
  measuringUnit: string
  initialStock: number
  price: number
  supplier: string
  reorderLevel: number
  description: string
}

export interface SupplierFormData {
  legalName: string
  phoneNumber: string
  taxNumber: string
  email: string
  address: string
  contactPerson: string
}

export interface AddStockData {
  quantity: number
  perUnitPrice: number
  supplierName: string
  dateTime: string
  notes: string
}

export interface StockOutData {
  quantity: number
  dateTime: string
  notes: string
}

// Select option interface for dropdowns
export interface SelectOption {
  id: number | string
  label: string
  description?: string
}
