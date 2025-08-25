"use client"

interface StockItem {
  id: number
  name: string
  category: string
  measuringUnit: string
  quantity: number
  status: string
  lastUpdated: string
  image: string
  description: string
  reorderLevel: number
  icon: string
  price: number
  supplier: string
}

interface StockTransaction {
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

interface MeasuringUnit {
  id: number
  name: string
  abbreviation: string
  createdAt: string
}

interface StockGroup {
  id: number
  name: string
  description: string
  itemCount: number
  createdAt: string
}

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

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddStockForm } from "@/components/add-stock-form"
import { StockOutForm } from "@/components/stock-out-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Home, 
  Package, 
  FileText, 
  Square, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity, 
  Settings,
  Menu,
  Plus,
  Minus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react"
import { StockItemsEmptyState } from "@/components/stock-items-empty-state"
import { SuppliersEmptyState } from "@/components/suppliers-empty-state"
import { ActivityLogsEmptyState } from "@/components/activity-logs-empty-state"
import { MeasuringUnitsEmptyState } from "@/components/measuring-units-empty-state"
import { StockGroupsEmptyState } from "@/components/stock-groups-empty-state"
import { SupplierSelect } from "@/components/ui/supplier-select"
import { MeasuringUnitSelect } from "@/components/ui/measuring-unit-select"
import { StockGroupSelect } from "@/components/ui/stock-group-select"
import { NestedFormSheet } from "@/components/ui/nested-form-sheet"
// import { SupplierForm } from "@/components/supplier-form"
import Link from "next/link"
import { formatNepaliCurrency } from "@/lib/utils"

export default function Dashboard() {
  // Add custom CSS for brand colors
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .brand-orange { background-color: #D8550D; }
      .brand-orange:hover { background-color: #A8420A; }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  // Generate unique ID function
  const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  // State for stock items
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Filter states for stock items
  const [stockItemSearch, setStockItemSearch] = useState("")
  const [stockItemCategoryFilter, setStockItemCategoryFilter] = useState("all")
  const [stockItemStatusFilter, setStockItemStatusFilter] = useState("all")


  const [stockGroups, setStockGroups] = useState([
    "Groceries",
    "Vegetables", 
    "Meat",
    "Dairy",
    "Beverages",
    "Pantry",
    "Oils",
    "Fruits",
    "Grains",
    "Spices",
    "Condiments",
    "Frozen Foods",
    "Snacks",
    "Bakery",
    "Seafood",
    "Poultry",
    "Cleaning Supplies",
    "Paper Products",
    "Alcoholic Beverages"
  ])

  
  // Supplier state management
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierSearch, setSupplierSearch] = useState("")
  const [isSupplierSheetOpen, setIsSupplierSheetOpen] = useState(false)
  const [isNestedSupplierFormOpen, setIsNestedSupplierFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [supplierFormData, setSupplierFormData] = useState({
    legalName: "",
    phoneNumber: "",
    taxNumber: "",
    email: "",
    address: "",
    contactPerson: ""
  })

  // Settings state
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [showPopulateConfirmation, setShowPopulateConfirmation] = useState(false)
  


  // Custom setter that saves to localStorage
  const updateStockItems = (newItems: StockItem[]) => {
    setStockItems(newItems)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockItems', JSON.stringify(newItems))
    }
  }



  // Custom setter that saves suppliers to localStorage
  const updateSuppliers = (newSuppliers: Supplier[]) => {
    setSuppliers(newSuppliers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('suppliers', JSON.stringify(newSuppliers))
    }
  }





  // Filter stock items based on search and filters
  const filteredStockItems = stockItems.filter(item => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(stockItemSearch.toLowerCase()) ||
                         item.description?.toLowerCase().includes(stockItemSearch.toLowerCase()) ||
                         item.category.toLowerCase().includes(stockItemSearch.toLowerCase())
    
    // Category filter
    const matchesCategory = stockItemCategoryFilter === "all" || item.category === stockItemCategoryFilter
    
    // Status filter
    const matchesStatus = stockItemStatusFilter === "all" || item.status === stockItemStatusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })



  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.legalName.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.email.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.phoneNumber.includes(supplierSearch)
  )

  // Supplier form handling
  const handleSupplierInputChange = (field: string, value: string) => {
    setSupplierFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddSupplier = () => {
    setEditingSupplier(null)
    setSupplierFormData({
      legalName: "",
      phoneNumber: "",
      taxNumber: "",
      email: "",
      address: "",
      contactPerson: ""
    })
    setIsSupplierSheetOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setSupplierFormData({
      legalName: supplier.legalName,
      phoneNumber: supplier.phoneNumber,
      taxNumber: supplier.taxNumber,
      email: supplier.email,
      address: supplier.address,
      contactPerson: supplier.contactPerson
    })
    setIsSupplierSheetOpen(true)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== supplier.id)
    updateSuppliers(updatedSuppliers)
    addToast('success', `Supplier "${supplier.legalName}" deleted successfully`)
  }

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supplierFormData.legalName.trim()) {
      addToast('error', 'Legal name is required')
      return
    }

    if (editingSupplier) {
      // Update existing supplier
      const updatedSuppliers = suppliers.map(supplier =>
        supplier.id === editingSupplier.id
          ? {
              ...supplier,
              ...supplierFormData,
              lastUpdated: new Date().toISOString()
            }
          : supplier
      )
      updateSuppliers(updatedSuppliers)
      addToast('success', `Supplier "${supplierFormData.legalName}" updated successfully`)
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        id: generateUniqueId(),
        ...supplierFormData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
      updateSuppliers([...suppliers, newSupplier])
      addToast('success', `Supplier "${supplierFormData.legalName}" created successfully`)
    }

    setIsSupplierSheetOpen(false)
    setEditingSupplier(null)
    setSupplierFormData({
      legalName: "",
      phoneNumber: "",
      taxNumber: "",
      email: "",
      address: "",
      contactPerson: ""
    })
  }

  const handleAddAnotherSupplier = () => {
    if (!supplierFormData.legalName.trim()) {
      addToast('error', 'Legal name is required')
      return
    }

    // Create new supplier
    const newSupplier: Supplier = {
      id: generateUniqueId(),
      ...supplierFormData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    updateSuppliers([...suppliers, newSupplier])
    addToast('success', `Supplier "${supplierFormData.legalName}" created successfully`)
    
    // Reset form but keep it open
    setSupplierFormData({
      legalName: "",
      phoneNumber: "",
      taxNumber: "",
      email: "",
      address: "",
      contactPerson: ""
    })
  }

  const handleAddSupplierFromSelect = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newSupplier: Supplier = {
      id: generateUniqueId(),
      ...supplierData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    updateSuppliers([...suppliers, newSupplier])
    addToast('success', `Supplier "${supplierData.legalName}" created successfully`)
  }

  const handleNestedSupplierSubmit = (supplierData: {
    legalName: string
    phoneNumber: string
    taxNumber: string
    email: string
    address: string
    contactPerson: string
  }) => {
    const newSupplier: Supplier = {
      id: generateUniqueId(),
      ...supplierData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    updateSuppliers([...suppliers, newSupplier])
    addToast('success', `Supplier "${supplierData.legalName}" created successfully and selected in the form`)
    
    // Auto-select the newly created supplier in the parent form
    handleInputChange("supplier", supplierData.legalName)
    
    // Reset the supplier form data
    setSupplierFormData({
      legalName: "",
      phoneNumber: "",
      taxNumber: "",
      email: "",
      address: "",
      contactPerson: ""
    })
    
    setIsNestedSupplierFormOpen(false)
  }

  const handleOpenNestedSupplierForm = () => {
    setIsNestedSupplierFormOpen(true)
  }

  // Settings functions
  const handleResetAllData = () => {
    // Reset all data to default state
    updateStockItems([])
    updateSuppliers([])
    updateStockGroupsData([])
    setStockTransactions([])
    setMeasuringUnitsData(defaultMeasuringUnits)
    setStockGroupsData(defaultStockGroups)
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stockItems')
      localStorage.removeItem('suppliers')
      localStorage.removeItem('stockGroups')
      localStorage.removeItem('stockTransactions')
      localStorage.removeItem('measuringUnits')
      localStorage.removeItem('stockGroupsData')
    }
    
    setShowResetConfirmation(false)
    addToast('success', 'All data has been reset to default state')
  }

  const handlePopulateSampleData = () => {
    // Sample stock items
    const sampleStockItems: StockItem[] = [
      {
        id: generateUniqueId(),
        name: "Tomatoes",
        category: "Vegetables",
        measuringUnit: "kg",
        quantity: 25,
        status: "Available",
        lastUpdated: new Date().toISOString(),
        image: "",
        description: "Fresh red tomatoes for cooking",
        reorderLevel: 10,
        icon: "🍅",
        price: 120,
        supplier: "ABC Suppliers Pvt. Ltd."
      },
      {
        id: generateUniqueId(),
        name: "Chicken Breast",
        category: "Meat",
        measuringUnit: "kg",
        quantity: 15,
        status: "Available",
        lastUpdated: new Date().toISOString(),
        image: "",
        description: "Fresh chicken breast for cooking",
        reorderLevel: 5,
        icon: "🍗",
        price: 450,
        supplier: "Fresh Market Supplies"
      },
      {
        id: generateUniqueId(),
        name: "Milk",
        category: "Dairy",
        measuringUnit: "L",
        quantity: 20,
        status: "Available",
        lastUpdated: new Date().toISOString(),
        image: "",
        description: "Fresh whole milk",
        reorderLevel: 8,
        icon: "🥛",
        price: 180,
        supplier: "ABC Suppliers Pvt. Ltd."
      },
      {
        id: generateUniqueId(),
        name: "Rice",
        category: "Grains",
        measuringUnit: "kg",
        quantity: 50,
        status: "Available",
        lastUpdated: new Date().toISOString(),
        image: "",
        description: "Basmati rice for cooking",
        reorderLevel: 15,
        icon: "🍚",
        price: 200,
        supplier: "Fresh Market Supplies"
      },
      {
        id: generateUniqueId(),
        name: "Onions",
        category: "Vegetables",
        measuringUnit: "kg",
        quantity: 8,
        status: "Low Quantity",
        lastUpdated: new Date().toISOString(),
        image: "",
        description: "Fresh onions for cooking",
        reorderLevel: 10,
        icon: "🧅",
        price: 80,
        supplier: "ABC Suppliers Pvt. Ltd."
      }
    ]

    // Sample suppliers
    const sampleSuppliers: Supplier[] = [
      {
        id: generateUniqueId(),
        legalName: "ABC Suppliers Pvt. Ltd.",
        phoneNumber: "+977 1-2345678",
        taxNumber: "123456789",
        email: "contact@abcsuppliers.com",
        address: "123 Main Street, Kathmandu, Nepal",
        contactPerson: "John Doe",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        legalName: "Fresh Market Supplies",
        phoneNumber: "+977 1-8765432",
        taxNumber: "987654321",
        email: "info@freshmarket.com",
        address: "456 Market Road, Lalitpur, Nepal",
        contactPerson: "Jane Smith",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: generateUniqueId(),
        legalName: "Quality Foods Ltd.",
        phoneNumber: "+977 1-5555555",
        taxNumber: "555555555",
        email: "sales@qualityfoods.com",
        address: "789 Business District, Bhaktapur, Nepal",
        contactPerson: "Mike Johnson",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ]

    // Sample stock transactions
    const sampleTransactions: StockTransaction[] = [
      {
        id: generateUniqueId(),
        stockItemId: sampleStockItems[0].id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString().split('T')[1].split('.')[0],
        type: "Purchase",
        quantity: 30,
        measuringUnit: "kg",
        party: "ABC Suppliers Pvt. Ltd.",
        stockValue: 3600,
        notes: "Initial stock purchase"
      },
      {
        id: generateUniqueId(),
        stockItemId: sampleStockItems[0].id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString().split('T')[1].split('.')[0],
        type: "Usage",
        quantity: 5,
        measuringUnit: "kg",
        party: "Kitchen",
        stockValue: 600,
        notes: "Used for cooking"
      },
      {
        id: generateUniqueId(),
        stockItemId: sampleStockItems[1].id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString().split('T')[1].split('.')[0],
        type: "Purchase",
        quantity: 20,
        measuringUnit: "kg",
        party: "Fresh Market Supplies",
        stockValue: 9000,
        notes: "Weekly meat supply"
      }
    ]

    // Update all data
    updateStockItems(sampleStockItems)
    updateSuppliers(sampleSuppliers)
    setStockTransactions(sampleTransactions)
    
    setShowPopulateConfirmation(false)
    addToast('success', 'Sample data has been populated successfully')
  }

  // Load data from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem('stockItems')
    if (saved) {
      const items = JSON.parse(saved)
      
      // Recalculate quantities based on transactions for consistency
      const savedTransactions = localStorage.getItem('stockTransactions')
      if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions)
        
        const updatedItems = items.map((item: StockItem) => {
          const itemTransactions = transactions.filter((t: StockTransaction) => t.stockItemId === item.id)
          let totalQuantity = 0
          
          itemTransactions.forEach((transaction: StockTransaction) => {
            if (transaction.type === "Purchase" || transaction.type === "Opening Stock") {
              totalQuantity += transaction.quantity
            } else if (transaction.type === "Usage") {
              totalQuantity -= transaction.quantity
            }
          })
          
          const newQuantity = Math.max(0, totalQuantity)
          const status = (() => {
            if (newQuantity === 0) return "Out of Stock"
            if (newQuantity <= item.reorderLevel) return "Low Quantity"
            return "Available"
          })()
          return { ...item, quantity: newQuantity, status }
        })
        
        setStockItems(updatedItems)
        // Update localStorage with recalculated quantities
        localStorage.setItem('stockItems', JSON.stringify(updatedItems))
      } else {
        setStockItems(items)
      }
    }
    
    // Load stock groups from localStorage
    const savedStockGroups = localStorage.getItem('stockGroupsData')
    if (savedStockGroups) {
      const stockGroupsData = JSON.parse(savedStockGroups)
      setStockGroupsData(stockGroupsData)
      // Sync stockGroups array with stockGroupsData names
      setStockGroups(stockGroupsData.map((group: StockGroup) => group.name))
    } else {
      // Initialize with default stock groups if none exist
      setStockGroupsData(defaultStockGroups)
      // Sync stockGroups array with default stock groups names
      setStockGroups(defaultStockGroups.map(group => group.name))
    }
    
    // Load measuring units from localStorage
    const savedMeasuringUnits = localStorage.getItem('measuringUnits')
    if (savedMeasuringUnits) {
      setMeasuringUnitsData(JSON.parse(savedMeasuringUnits))
    } else {
      // Initialize with default measuring units if none exist
      setMeasuringUnitsData(defaultMeasuringUnits)
    }
    
    // Load stock transactions from localStorage
    const savedTransactions = localStorage.getItem('stockTransactions')
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions)
      console.log('Loaded transactions:', transactions)
      setStockTransactions(transactions)
    } else {
      console.log('No transactions found in localStorage')
    }
    
    // Load suppliers from localStorage
    const savedSuppliers = localStorage.getItem('suppliers')
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers))
    }
    
    setIsHydrated(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for localStorage changes to update stock items and transactions in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stockItems' && e.newValue) {
        setStockItems(JSON.parse(e.newValue))
      }
      if (e.key === 'stockTransactions' && e.newValue) {
        setStockTransactions(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])



  // State for form
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [toasts, setToasts] = useState<Array<{id: number, type: string, message: string, action: {label: string, action: () => void} | null}>>([])
  
  // State for stock management
  const [showAddStockForm, setShowAddStockForm] = useState(false)
  const [showStockOutForm, setShowStockOutForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deletingItem, setDeletingItem] = useState<StockItem | null>(null)
  
  // State for sidebar - initialize with localStorage value if available
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydrate sidebar state from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      if (savedSidebarState !== null) {
        setIsSidebarCollapsed(JSON.parse(savedSidebarState))
      }
      setMounted(true)
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  const handleSidebarToggle = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  // Function to handle adding stock item (opens the sheet)
  const handleAddStockItem = () => {
    setIsSheetOpen(true)
  }

  // Function to handle editing stock item
  const handleEditStockItem = (item: StockItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      measuringUnit: item.measuringUnit,
      quantity: item.quantity.toString(),
      reorderLevel: item.reorderLevel.toString(),
      description: item.description,
      icon: item.icon,
      price: item.price ? item.price.toString() : "",
      supplier: item.supplier || ""
    })

    setIsEditSheetOpen(true)
  }

  // Function to handle record purchase action
  const handleRecordPurchaseAction = (item: StockItem) => {
    setSelectedItem(item)
    setShowAddStockForm(true)
  }

  // Function to handle record usage action
  const handleRecordUsageAction = (item: StockItem) => {
    setSelectedItem(item)
    setShowStockOutForm(true)
  }

  // Function to handle record purchase form submission
  const handleRecordPurchaseSubmit = (data: { quantity: number; perUnitPrice: number; supplierName: string; dateTime: string; notes: string }) => {
    if (selectedItem) {
      // Update the stock item quantity
      const updatedItems = stockItems.map(item => 
        item.id === selectedItem.id 
          ? { ...item, quantity: item.quantity + data.quantity }
          : item
      )
      updateStockItems(updatedItems)
      
      // Create transaction record
      const newTransaction = {
        id: generateUniqueId(),
        stockItemId: selectedItem.id,
        date: new Date(data.dateTime).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: new Date(data.dateTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: "Purchase" as const,
        quantity: data.quantity,
        measuringUnit: selectedItem.measuringUnit,
        party: data.supplierName,
        stockValue: data.quantity * data.perUnitPrice,
        notes: data.notes || "-"
      }
      
      // Save transaction to localStorage and update state
      const existingTransactions = localStorage.getItem('stockTransactions')
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : []
      const updatedTransactions = [newTransaction, ...transactions]
      localStorage.setItem('stockTransactions', JSON.stringify(updatedTransactions))
      setStockTransactions(updatedTransactions)
      
      addToast('success', `Recorded purchase of ${data.quantity} ${selectedItem.measuringUnit} for ${selectedItem.name}`)
      setShowAddStockForm(false)
      setSelectedItem(null)
    }
  }

  // Function to handle record usage form submission
  const handleRecordUsageSubmit = (data: { quantity: number; perUnitPrice: number; reasonForDeduction: string; supplier?: string; supplierName?: string; dateTime: string; notes: string }) => {
    if (selectedItem) {
      // Update the stock item quantity
      const updatedItems = stockItems.map(item => 
        item.id === selectedItem.id 
          ? { ...item, quantity: Math.max(0, item.quantity - data.quantity) }
          : item
      )
      updateStockItems(updatedItems)
      
      // Helper function to get supplier name from ID
      const getSupplierName = (supplierId: string) => {
        // If it's a new supplier created from the form, use the supplierName
        if (supplierId.startsWith('supplier-') && !supplierId.match(/supplier-\d+/)) {
          return data.supplierName || "New Supplier"
        }
        
        // Try to find the supplier in the actual suppliers state
        const supplier = suppliers.find(s => s.id.toString() === supplierId || s.legalName === supplierId)
        return supplier ? supplier.legalName : data.supplierName || "Unknown Supplier"
      }
      
      // Determine the party based on the reason for deduction
      let party = data.reasonForDeduction
      if (data.reasonForDeduction === "returned-to-supplier" && data.supplier) {
        party = getSupplierName(data.supplier)
      }
      
      // Create transaction record
      const newTransaction = {
        id: generateUniqueId(),
        stockItemId: selectedItem.id,
        date: new Date(data.dateTime).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: new Date(data.dateTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: "Usage" as const,
        quantity: data.quantity,
        measuringUnit: selectedItem.measuringUnit,
        party: party,
        stockValue: data.quantity * data.perUnitPrice,
        notes: data.notes || "-"
      }
      
      // Save transaction to localStorage and update state
      const existingTransactions = localStorage.getItem('stockTransactions')
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : []
      const updatedTransactions = [newTransaction, ...transactions]
      localStorage.setItem('stockTransactions', JSON.stringify(updatedTransactions))
      setStockTransactions(updatedTransactions)
      
      addToast('success', `Recorded usage of ${data.quantity} ${selectedItem.measuringUnit} for ${selectedItem.name}`)
      setShowStockOutForm(false)
      setSelectedItem(null)
    }
  }
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    measuringUnit: "",
    quantity: "",
    reorderLevel: "",
    description: "",
    icon: "",
    price: "",
    supplier: ""
  })

  // Ref for icon dropdown
  const iconDropdownRef = useRef<HTMLDivElement>(null)

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newItem = {
      id: generateUniqueId(),
      name: formData.name,
      category: formData.category,
      measuringUnit: formData.measuringUnit,
      quantity: parseInt(formData.quantity) || 0,
      status: (() => {
        const quantity = parseInt(formData.quantity) || 0
        const reorderLevel = parseInt(formData.reorderLevel) || 0
        
        if (quantity === 0) return "Out of Stock"
        if (quantity <= reorderLevel) return "Low Quantity"
        return "Available"
      })(),
      lastUpdated: new Date().toISOString().split('T')[0],
      image: "/avatars/default.jpg",
      description: formData.description,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      icon: formData.icon,
      price: parseFloat(formData.price) || 0,
      supplier: formData.supplier
    }

    updateStockItems([...stockItems, newItem])
    
    // Create initial transaction for the new stock item
    if (parseInt(formData.quantity) > 0) {
      const initialTransaction = {
        id: generateUniqueId(),
        stockItemId: newItem.id,
        date: new Date().toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: "Opening Stock" as const,
        quantity: parseInt(formData.quantity),
        measuringUnit: formData.measuringUnit,
        party: "",
        stockValue: parseInt(formData.quantity) * parseFloat(formData.price),
        notes: "Initial stock creation"
      }
      
      // Save transaction to localStorage and update state
      const existingTransactions = localStorage.getItem('stockTransactions')
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : []
      const updatedTransactions = [initialTransaction, ...transactions]
      localStorage.setItem('stockTransactions', JSON.stringify(updatedTransactions))
      setStockTransactions(updatedTransactions)
    }
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      measuringUnit: "",
      quantity: "",
      reorderLevel: "",
      description: "",
      icon: "",
      price: "",
      supplier: ""
    })
    
    setIsSheetOpen(false)
    addToast('success', 'Stock item created successfully')
  }

  // Handle form update (for editing)
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingItem) return
    
    const updatedItem = {
      ...editingItem,
      name: formData.name,
      category: formData.category,
      measuringUnit: formData.measuringUnit,
      quantity: parseInt(formData.quantity) || 0,
      status: (() => {
        const quantity = parseInt(formData.quantity) || 0
        const reorderLevel = parseInt(formData.reorderLevel) || 0
        
        if (quantity === 0) return "Out of Stock"
        if (quantity <= reorderLevel) return "Low Quantity"
        return "Available"
      })(),
      lastUpdated: new Date().toISOString().split('T')[0],
      description: formData.description,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      icon: formData.icon,
      price: parseFloat(formData.price) || 0,
      supplier: formData.supplier
    }

    updateStockItems(stockItems.map(item => item.id === editingItem.id ? updatedItem : item))
    
    // Reset form and close edit sheet
    setFormData({
      name: "",
      category: "",
      measuringUnit: "",
      quantity: "",
      reorderLevel: "",
      description: "",
      icon: "",
      price: "",
      supplier: ""
    })
    setEditingItem(null)
    setIsEditSheetOpen(false)
    addToast('success', 'Stock item updated successfully')
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({
      name: "",
      category: "",
      measuringUnit: "",
      quantity: "",
      reorderLevel: "",
      description: "",
      icon: "",
      price: "",
      supplier: ""
    })
    setEditingItem(null)
    setIsEditSheetOpen(false)
  }

  // Toast functions
  const addToast = (type: string, message: string, action: {label: string, action: () => void} | null = null) => {
    const id = generateUniqueId()
    const newToast = { id, type, message, action }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // const handleUndoDelete = (deletedItem: StockItem) => {
  //   updateStockItems([...stockItems, deletedItem])
  //   addToast('success', 'Item restored successfully')
  // }

  // Handle delete item
  const handleDelete = (id: number) => {
    const deletedItem = stockItems.find(item => item.id === id)
    if (deletedItem) {
      setDeletingItem(deletedItem)
      setShowDeleteConfirmation(true)
    }
  }

  // Confirm delete item
  const confirmDeleteItem = () => {
    if (deletingItem) {
      updateStockItems(stockItems.filter(item => item.id !== deletingItem.id))
      addToast('success', 'Stock item deleted successfully')
      setDeletingItem(null)
      setShowDeleteConfirmation(false)
    }
  }

  // Handle icon selection
  const handleIconSelect = (icon: string) => {
    handleInputChange("icon", icon)
    setIsIconDropdownOpen(false)
  }

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconDropdownRef.current && !iconDropdownRef.current.contains(event.target as Node)) {
        setIsIconDropdownOpen(false)
      }
    }

    if (isIconDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isIconDropdownOpen])

  // State for measuring units management
  const [measuringUnitsData, setMeasuringUnitsData] = useState<MeasuringUnit[]>([])
  const [showCreateMeasuringUnit, setShowCreateMeasuringUnit] = useState(false)
  const [newMeasuringUnitName, setNewMeasuringUnitName] = useState("")
  const [newMeasuringUnitAbbr, setNewMeasuringUnitAbbr] = useState("")
  const [measuringUnitSearchData, setMeasuringUnitSearchData] = useState("")
  const [editingMeasuringUnit, setEditingMeasuringUnit] = useState<MeasuringUnit | null>(null)
  const [showDeleteMeasuringUnitConfirmation, setShowDeleteMeasuringUnitConfirmation] = useState(false)
  const [deletingMeasuringUnit, setDeletingMeasuringUnit] = useState<MeasuringUnit | null>(null)
  
  // State for stock groups management
  const [stockGroupsData, setStockGroupsData] = useState<StockGroup[]>([])
  const [showCreateStockGroup, setShowCreateStockGroup] = useState(false)
  const [newStockGroupName, setNewStockGroupName] = useState("")
  const [newStockGroupDescription, setNewStockGroupDescription] = useState("")
  const [stockGroupSearchData, setStockGroupSearchData] = useState("")
  const [editingStockGroup, setEditingStockGroup] = useState<StockGroup | null>(null)
  const [showDeleteStockGroupConfirmation, setShowDeleteStockGroupConfirmation] = useState(false)
  const [deletingStockGroup, setDeletingStockGroup] = useState<StockGroup | null>(null)
  
  // State for activity logs management
  const [activitySearchData, setActivitySearchData] = useState("")
  const [activityFilterType, setActivityFilterType] = useState("all")
  const [activityFilterItem, setActivityFilterItem] = useState("all")
  const [showActivityDetailsModal, setShowActivityDetailsModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<StockTransaction | null>(null)
  const [showDeleteActivityConfirmation, setShowDeleteActivityConfirmation] = useState(false)
  const [deletingActivity, setDeletingActivity] = useState<StockTransaction | null>(null)
  
  // Default measuring units
  const defaultMeasuringUnits = [
    { id: 1, name: "Kilograms", abbreviation: "kg", createdAt: new Date().toISOString() },
    { id: 2, name: "Grams", abbreviation: "g", createdAt: new Date().toISOString() },
    { id: 3, name: "Liters", abbreviation: "L", createdAt: new Date().toISOString() },
    { id: 4, name: "Milliliters", abbreviation: "ml", createdAt: new Date().toISOString() },
    { id: 5, name: "Pieces", abbreviation: "pcs", createdAt: new Date().toISOString() },
    { id: 6, name: "Boxes", abbreviation: "boxes", createdAt: new Date().toISOString() },
    { id: 7, name: "Bottles", abbreviation: "bottles", createdAt: new Date().toISOString() },
    { id: 8, name: "Cans", abbreviation: "cans", createdAt: new Date().toISOString() },
    { id: 9, name: "Bags", abbreviation: "bags", createdAt: new Date().toISOString() },
    { id: 10, name: "Units", abbreviation: "units", createdAt: new Date().toISOString() },
    { id: 11, name: "Packs", abbreviation: "packs", createdAt: new Date().toISOString() },
    { id: 12, name: "Cartons", abbreviation: "cartons", createdAt: new Date().toISOString() },
    { id: 13, name: "Dozens", abbreviation: "dozens", createdAt: new Date().toISOString() },
    { id: 14, name: "Pairs", abbreviation: "pairs", createdAt: new Date().toISOString() },
    { id: 15, name: "Sets", abbreviation: "sets", createdAt: new Date().toISOString() },
    { id: 16, name: "Rolls", abbreviation: "rolls", createdAt: new Date().toISOString() },
    { id: 17, name: "Sheets", abbreviation: "sheets", createdAt: new Date().toISOString() },
    { id: 18, name: "Slices", abbreviation: "slices", createdAt: new Date().toISOString() },
    { id: 19, name: "Cups", abbreviation: "cups", createdAt: new Date().toISOString() },
    { id: 20, name: "Tablespoons", abbreviation: "tbsp", createdAt: new Date().toISOString() },
    { id: 21, name: "Teaspoons", abbreviation: "tsp", createdAt: new Date().toISOString() },
    { id: 22, name: "Ounces", abbreviation: "oz", createdAt: new Date().toISOString() },
    { id: 23, name: "Pounds", abbreviation: "lbs", createdAt: new Date().toISOString() },
    { id: 24, name: "Quarts", abbreviation: "qt", createdAt: new Date().toISOString() },
    { id: 25, name: "Gallons", abbreviation: "gal", createdAt: new Date().toISOString() }
  ]

  // Default stock groups
  const defaultStockGroups = [
    { id: 1, name: "Groceries", description: "Basic grocery items and staples", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 2, name: "Vegetables", description: "Fresh vegetables and produce", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 3, name: "Meat", description: "Fresh meat and poultry products", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 4, name: "Dairy", description: "Dairy products and milk-based items", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 5, name: "Beverages", description: "Drinks and beverage products", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 6, name: "Pantry", description: "Pantry staples and dry goods", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 7, name: "Oils", description: "Cooking oils and fats", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 8, name: "Fruits", description: "Fresh fruits and dried fruits", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 9, name: "Grains", description: "Rice, wheat, and grain products", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 10, name: "Spices", description: "Spices, herbs, and seasonings", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 11, name: "Condiments", description: "Sauces, dressings, and condiments", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 12, name: "Frozen Foods", description: "Frozen food items", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 13, name: "Snacks", description: "Snack foods and treats", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 14, name: "Bakery", description: "Bread, pastries, and baked goods", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 15, name: "Seafood", description: "Fish and seafood products", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 16, name: "Poultry", description: "Chicken, turkey, and other poultry", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 17, name: "Cleaning Supplies", description: "Cleaning and maintenance supplies", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 18, name: "Paper Products", description: "Paper towels, napkins, and disposables", itemCount: 0, createdAt: new Date().toISOString() },
    { id: 19, name: "Alcoholic Beverages", description: "Beer, wine, and spirits", itemCount: 0, createdAt: new Date().toISOString() }
  ]

  // Custom setter that saves measuring units to localStorage
  const updateMeasuringUnits = (newUnits: MeasuringUnit[]) => {
    setMeasuringUnitsData(newUnits)
    if (typeof window !== 'undefined') {
      localStorage.setItem('measuringUnits', JSON.stringify(newUnits))
    }
  }

  // Custom setter that saves stock groups to localStorage
  const updateStockGroupsData = (newGroups: StockGroup[]) => {
    setStockGroupsData(newGroups)
    // Sync stockGroups array with the names from stockGroupsData
    setStockGroups(newGroups.map(group => group.name))
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockGroupsData', JSON.stringify(newGroups))
    }
  }

  // Custom setter that saves stock transactions to localStorage
  const updateStockTransactions = (newTransactions: StockTransaction[]) => {
    setStockTransactions(newTransactions)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockTransactions', JSON.stringify(newTransactions))
    }
  }

  // Handle creating a new measuring unit
  const handleCreateMeasuringUnit = () => {
    if (newMeasuringUnitName.trim() && newMeasuringUnitAbbr.trim()) {
      const newUnit: MeasuringUnit = {
        id: generateUniqueId(),
        name: newMeasuringUnitName.trim(),
        abbreviation: newMeasuringUnitAbbr.trim(),
        createdAt: new Date().toISOString()
      }
      updateMeasuringUnits([...measuringUnitsData, newUnit])
      setNewMeasuringUnitName("")
      setNewMeasuringUnitAbbr("")
      setShowCreateMeasuringUnit(false)
      addToast('success', `Measuring unit "${newUnit.name}" created successfully`)
    }
  }

  // Handle creating a new stock group
  const handleCreateStockGroup = () => {
    if (newStockGroupName.trim()) {
      const newGroup: StockGroup = {
        id: generateUniqueId(),
        name: newStockGroupName.trim(),
        description: newStockGroupDescription.trim(),
        itemCount: 0,
        createdAt: new Date().toISOString()
      }
      updateStockGroupsData([...stockGroupsData, newGroup])
      setNewStockGroupName("")
      setNewStockGroupDescription("")
      setShowCreateStockGroup(false)
      addToast('success', `Stock group "${newGroup.name}" created successfully`)
    }
  }

  // Handle editing measuring unit
  const handleEditMeasuringUnit = (unit: MeasuringUnit) => {
    setEditingMeasuringUnit(unit)
    setNewMeasuringUnitName(unit.name)
    setNewMeasuringUnitAbbr(unit.abbreviation)
    setShowCreateMeasuringUnit(true)
  }

  // Handle updating measuring unit
  const handleUpdateMeasuringUnit = () => {
    if (editingMeasuringUnit && newMeasuringUnitName.trim() && newMeasuringUnitAbbr.trim()) {
      const updatedUnit: MeasuringUnit = {
        ...editingMeasuringUnit,
        name: newMeasuringUnitName.trim(),
        abbreviation: newMeasuringUnitAbbr.trim()
      }
      updateMeasuringUnits(measuringUnitsData.map(unit => unit.id === editingMeasuringUnit.id ? updatedUnit : unit))
      setNewMeasuringUnitName("")
      setNewMeasuringUnitAbbr("")
      setEditingMeasuringUnit(null)
      setShowCreateMeasuringUnit(false)
      addToast('success', `Measuring unit "${updatedUnit.name}" updated successfully`)
    }
  }

  // Handle delete measuring unit
  const handleDeleteMeasuringUnit = (unit: MeasuringUnit) => {
    setDeletingMeasuringUnit(unit)
    setShowDeleteMeasuringUnitConfirmation(true)
  }

  // Confirm delete measuring unit
  const confirmDeleteMeasuringUnit = () => {
    if (deletingMeasuringUnit) {
      updateMeasuringUnits(measuringUnitsData.filter(unit => unit.id !== deletingMeasuringUnit.id))
      addToast('success', `Measuring unit "${deletingMeasuringUnit.name}" deleted successfully`)
      setDeletingMeasuringUnit(null)
      setShowDeleteMeasuringUnitConfirmation(false)
    }
  }

  // Handle editing stock group
  const handleEditStockGroup = (group: StockGroup) => {
    setEditingStockGroup(group)
    setNewStockGroupName(group.name)
    setNewStockGroupDescription(group.description)
    setShowCreateStockGroup(true)
  }

  // Handle updating stock group
  const handleUpdateStockGroup = () => {
    if (editingStockGroup && newStockGroupName.trim()) {
      const updatedGroup: StockGroup = {
        ...editingStockGroup,
        name: newStockGroupName.trim(),
        description: newStockGroupDescription.trim()
      }
      updateStockGroupsData(stockGroupsData.map(group => group.id === editingStockGroup.id ? updatedGroup : group))
      setNewStockGroupName("")
      setNewStockGroupDescription("")
      setEditingStockGroup(null)
      setShowCreateStockGroup(false)
      addToast('success', `Stock group "${updatedGroup.name}" updated successfully`)
    }
  }

  // Handle delete stock group
  const handleDeleteStockGroup = (group: StockGroup) => {
    setDeletingStockGroup(group)
    setShowDeleteStockGroupConfirmation(true)
  }

  // Confirm delete stock group
  const confirmDeleteStockGroup = () => {
    if (deletingStockGroup) {
      updateStockGroupsData(stockGroupsData.filter(group => group.id !== deletingStockGroup.id))
      addToast('success', `Stock group "${deletingStockGroup.name}" deleted successfully`)
      setDeletingStockGroup(null)
      setShowDeleteStockGroupConfirmation(false)
    }
  }

  // Filter measuring units based on search
  const filteredMeasuringUnitsData = measuringUnitsData.filter(unit =>
    unit.name.toLowerCase().includes(measuringUnitSearchData.toLowerCase()) ||
    unit.abbreviation.toLowerCase().includes(measuringUnitSearchData.toLowerCase())
  )

  // Filter stock groups based on search
  const filteredStockGroupsData = stockGroupsData.filter(group =>
    group.name.toLowerCase().includes(stockGroupSearchData.toLowerCase()) ||
    group.description.toLowerCase().includes(stockGroupSearchData.toLowerCase())
  )

  // Calculate item counts for each stock group
  const stockGroupsWithCounts = filteredStockGroupsData.map(group => ({
    ...group,
    itemCount: stockItems.filter(item => item.category === group.name).length
  }))

  // Filter activity logs based on search and filters
  const filteredActivityLogs = stockTransactions.filter(activity => {
    const stockItem = stockItems.find(item => item.id === activity.stockItemId)
    const matchesSearch = activitySearchData === "" || 
      (stockItem?.name.toLowerCase().includes(activitySearchData.toLowerCase()) ||
       activity.party.toLowerCase().includes(activitySearchData.toLowerCase()) ||
       activity.notes.toLowerCase().includes(activitySearchData.toLowerCase()))
    
    const matchesType = activityFilterType === "all" || activity.type === activityFilterType
    const matchesItem = activityFilterItem === "all" || stockItem?.name === activityFilterItem
    
    return matchesSearch && matchesType && matchesItem
  })

  // Debug logging
  console.log('Stock transactions:', stockTransactions)
  console.log('Filtered activity logs:', filteredActivityLogs)

  // Handle viewing activity details
  const handleViewActivityDetails = (activity: StockTransaction) => {
    setSelectedActivity(activity)
    setShowActivityDetailsModal(true)
  }

  // Handle deleting activity
  const handleDeleteActivity = (activity: StockTransaction) => {
    setDeletingActivity(activity)
    setShowDeleteActivityConfirmation(true)
  }

  // Confirm delete activity
  const confirmDeleteActivity = () => {
    if (deletingActivity) {
      const updatedTransactions = stockTransactions.filter(t => t.id !== deletingActivity.id)
      updateStockTransactions(updatedTransactions)
      setShowDeleteActivityConfirmation(false)
      setDeletingActivity(null)
      addToast('success', 'Activity record deleted successfully')
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
      <div className={`${mounted && isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-10 transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button 
            onClick={handleSidebarToggle}
            className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          {!isSidebarCollapsed && (
            <Image src="/box-logo.svg" alt="Box" width={24} height={24} className="h-6 w-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-2 ${isSidebarCollapsed ? 'p-2' : 'p-4'} transition-all duration-300 ease-in-out`}>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Home className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Home</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <FileText className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Menu manager</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} bg-gray-100 text-gray-900 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Package className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Inventory</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Square className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Areas and Tables</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Users className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Members</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Clock className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Order history</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <TrendingUp className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Sales</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Activity className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Activity</span>
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-1 py-2' : 'w-full px-3 py-2 gap-3'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out overflow-hidden`}>
            <Settings className={isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"} />
            <span className={`font-inter text-base font-semibold leading-6 text-[#484848] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'scale-0 w-0 h-0 opacity-0' : 'scale-100 w-auto h-auto opacity-100'}`}>Profile and settings</span>
          </a>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/srijan.jpg" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <div>
                <p className="text-sm font-medium text-gray-900">Srijan Shrestha</p>
                <p className="text-xs text-gray-500">Manager</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${mounted && isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        {/* Page Content */}
        <div className="flex-1 px-6 pb-6">
          <Tabs defaultValue="stock-item" className="w-full">
            {/* Top Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6 sticky top-0 bg-white z-20">
            <TabsList className="flex justify-start bg-white h-auto p-0 border-b-0 shadow-none">
              <TabsTrigger 
                value="stock-item" 
                className="tabs-trigger relative px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
                style={{ 
                  '--tw-text-opacity': '1',
                  '--tw-border-opacity': '1'
                } as React.CSSProperties}
              >
                Stock item
              </TabsTrigger>
              <TabsTrigger 
                value="suppliers" 
                className="tabs-trigger relative px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Suppliers
              </TabsTrigger>
              <TabsTrigger 
                value="measuring-unit" 
                className="tabs-trigger relative px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Measuring unit
              </TabsTrigger>
              <TabsTrigger 
                value="stock-group" 
                className="tabs-trigger relative px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Stock group
              </TabsTrigger>
              <TabsTrigger 
                value="stock-history" 
                className="tabs-trigger relative px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                  Activity Logs
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="tabs-trigger relative px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                  Settings
              </TabsTrigger>
            </TabsList>
        </div>
            {/* Stock Item Tab */}
            <TabsContent value="stock-item" className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Stock item</h1>
                  <p className="text-gray-600 mt-1">
                    Manage all ingredients and supplies your restaurant keeps in stock.
                  </p>
                </div>
                {stockItems.length > 0 && (
                  <Button 
                    onClick={handleAddStockItem}
                    className="text-white" 
                    style={{ backgroundColor: '#D8550D' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                  >
                        <Plus className="h-4 w-4 mr-2" />
                        New stock item
                      </Button>
                )}
              </div>

              {/* Stock Item Creation Sheet */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                      <div className="px-6 flex-1">
                        <SheetHeader className="pl-0">
                          <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">Create stock item</SheetTitle>
                          <SheetDescription>
                            Add a new stock item to your inventory with initial stock quantity.
                          </SheetDescription>
                        </SheetHeader>
                        
                        {/* Separator line */}
                        <div className="border-b border-gray-200 mb-6"></div>
                        
                        <div className="space-y-6 mt-6">
                          <div className="space-y-2">
                            <Label htmlFor="item-name" className="text-sm font-medium">
                              Item name *
                            </Label>
                            <div className="flex">
                              <div className="relative" ref={iconDropdownRef}>
                                <button
                                  type="button"
                                  className="w-16 h-9 rounded-r-none border border-gray-300 border-r-0 px-2 flex items-center justify-center bg-white hover:bg-gray-50"
                                  onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                                >
                                  <span className="text-lg">{formData.icon || "🍽️"}</span>
                                  <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {isIconDropdownOpen && (
                                  <div className="absolute top-full left-0 z-50 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
                                    <div className="grid grid-cols-8 gap-1 p-2">
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍅")}
                                      >
                                        🍅
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍗")}
                                      >
                                        🍗
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🥛")}
                                      >
                                        🥛
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🥬")}
                                      >
                                        🥬
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍎")}
                                      >
                                        🍎
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🥖")}
                                      >
                                        🥖
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🧀")}
                                      >
                                        🧀
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🥚")}
                                      >
                                        🥚
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🫒")}
                                      >
                                        🫒
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍺")}
                                      >
                                        🍺
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍷")}
                                      >
                                        🍷
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("☕")}
                                      >
                                        ☕
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍯")}
                                      >
                                        🍯
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🧂")}
                                      >
                                        🧂
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🌶️")}
                                      >
                                        🌶️
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🧅")}
                                      >
                                        🧅
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🥕")}
                                      >
                                        🥕
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🥔")}
                                      >
                                        🥔
                                      </button>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => handleIconSelect("🍄")}
                                      >
                                        🍄
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Input 
                                id="item-name" 
                                placeholder="E.g. Tomatoes, Beer, Cheese" 
                                className="flex-1 rounded-l-none"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="stock-group" className="text-sm font-medium">
                              Stock group *
                            </Label>
                            <StockGroupSelect
                              value={formData.category || ""}
                              onChange={(value) => handleInputChange("category", value)}
                              placeholder="Search or select a stock group"
                              stockGroups={stockGroupsData}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="initial-stock" className="text-sm font-medium">
                                Initial stock *
                              </Label>
                              <Input 
                                id="initial-stock" 
                                type="number" 
                                placeholder="E.g. 50" 
                                className="w-full"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange("quantity", e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="measuring-unit" className="text-sm font-medium">
                                Measuring unit *
                              </Label>
                              <MeasuringUnitSelect
                                value={formData.measuringUnit || ""}
                                onChange={(value) => handleInputChange("measuringUnit", value)}
                                placeholder="Search or select measuring unit"
                                measuringUnits={measuringUnitsData}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium">
                              Price per unit *
                            </Label>
                            <Input 
                              id="price" 
                              type="number" 
                              step="0.01"
                              placeholder="E.g. रु 120" 
                              className="w-full"
                              value={formData.price}
                              onChange={(e) => handleInputChange("price", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="supplier" className="text-sm font-medium">
                              Supplier
                            </Label>
                            <SupplierSelect
                              value={formData.supplier || ""}
                              onChange={(value) => handleInputChange("supplier", value)}
                              placeholder="Search or select supplier"
                              suppliers={suppliers}
                              onAddSupplier={handleAddSupplierFromSelect}
                              onOpenNestedForm={handleOpenNestedSupplierForm}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="reorder-level" className="text-sm font-medium">
                              Re-order level
                            </Label>
                            <Input 
                              id="reorder-level" 
                              type="number" 
                              placeholder="E.g. 10" 
                              className="w-full"
                              value={formData.reorderLevel}
                              onChange={(e) => handleInputChange("reorderLevel", e.target.value)}
                            />
                            <p className="text-xs text-gray-500">Minimum quantity before reordering</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                              Description (Optional)
                            </Label>
                            <Textarea 
                              id="description" 
                              placeholder="E.g. Handpicked dishes for a quick and satisfying lunch." 
                              className="w-full min-h-[80px]"
                              value={formData.description}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 px-6 py-4 border-t mt-auto">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            // Simulate form submission for "Add another" functionality
                            const newItem = {
                              id: generateUniqueId(),
                              name: formData.name,
                              category: formData.category,
                              measuringUnit: formData.measuringUnit,
                              quantity: parseInt(formData.quantity) || 0,
                              status: (() => {
                                const quantity = parseInt(formData.quantity) || 0
                                const reorderLevel = parseInt(formData.reorderLevel) || 0
                                
                                if (quantity === 0) return "Out of Stock"
                                if (quantity <= reorderLevel) return "Low Stock"
                                return "In Stock"
                              })(),
                              lastUpdated: new Date().toISOString().split('T')[0],
                              image: "/avatars/default.jpg",
                              description: formData.description,
                              reorderLevel: parseInt(formData.reorderLevel) || 0,
                              icon: formData.icon,
                              price: parseFloat(formData.price) || 0,
                              supplier: formData.supplier
                            }
                            updateStockItems([...stockItems, newItem])
                            addToast('success', 'Stock item added successfully')
                            
                            // Reset form
                            setFormData({
                              name: "",
                              category: "",
                              measuringUnit: "",
                              quantity: "",
                              reorderLevel: "",
                              description: "",
                              icon: "",
                              price: "",
                              supplier: ""
                            })
                          }}
                        >
                          Add another
                        </Button>
                        <Button type="submit" className="text-white flex-1" style={{ backgroundColor: '#D8550D' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}>
                          Save Stock item
                        </Button>
                      </div>
                    </form>
                  </SheetContent>
                </Sheet>

              {/* Edit Stock Item Sheet */}
              <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                  <form onSubmit={handleUpdate} className="flex flex-col h-full">
                    <div className="px-6 flex-1">
                      <SheetHeader className="pl-0">
                        <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">Edit stock item</SheetTitle>
                        <SheetDescription>
                          Update the stock item details.
                        </SheetDescription>
                      </SheetHeader>
                      
                      {/* Separator line */}
                      <div className="border-b border-gray-200 mb-6"></div>
                      
                      <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="edit-item-name" className="text-sm font-medium">
                            Item name *
                          </Label>
                          <div className="flex">
                            <div className="relative" ref={iconDropdownRef}>
                              <button
                                type="button"
                                className="w-16 h-9 rounded-r-none border border-gray-300 border-r-0 px-2 flex items-center justify-center bg-white hover:bg-gray-50"
                                onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                              >
                                <span className="text-lg">{formData.icon || "🍽️"}</span>
                                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isIconDropdownOpen && (
                                <div className="absolute top-full left-0 z-50 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
                                  <div className="grid grid-cols-8 gap-1 p-2">
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍅")}
                                    >
                                      🍅
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍗")}
                                    >
                                      🍗
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🥛")}
                                    >
                                      🥛
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🥬")}
                                    >
                                      🥬
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍎")}
                                    >
                                      🍎
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🥖")}
                                    >
                                      🥖
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🧀")}
                                    >
                                      🧀
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🥚")}
                                    >
                                      🥚
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🫒")}
                                    >
                                      🫒
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍺")}
                                    >
                                      🍺
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍷")}
                                    >
                                      🍷
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("☕")}
                                    >
                                      ☕
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍯")}
                                    >
                                      🍯
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🧂")}
                                    >
                                      🧂
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🌶️")}
                                    >
                                      🌶️
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🧅")}
                                    >
                                      🧅
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🥕")}
                                    >
                                      🥕
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🥔")}
                                    >
                                      🥔
                                    </button>
                                    <button
                                      type="button"
                                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                      onClick={() => handleIconSelect("🍄")}
                                    >
                                      🍄
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Input 
                              id="edit-item-name" 
                              placeholder="E.g. Tomatoes, Beer, Cheese" 
                              className="flex-1 rounded-l-none"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-stock-group" className="text-sm font-medium">
                            Stock group *
                          </Label>
                          <StockGroupSelect
                            value={formData.category || ""}
                            onChange={(value) => handleInputChange("category", value)}
                            placeholder="Search or select a stock group"
                            stockGroups={stockGroupsData}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-current-stock" className="text-sm font-medium">
                              Current stock *
                            </Label>
                            <Input 
                              id="edit-current-stock" 
                              type="number" 
                              placeholder="E.g. 50" 
                              className="w-full"
                              value={formData.quantity}
                              onChange={(e) => handleInputChange("quantity", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-measuring-unit" className="text-sm font-medium">
                              Measuring unit *
                            </Label>
                            <MeasuringUnitSelect
                              value={formData.measuringUnit || ""}
                              onChange={(value) => handleInputChange("measuringUnit", value)}
                              placeholder="Search or select measuring unit"
                              measuringUnits={measuringUnitsData}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-reorder-level" className="text-sm font-medium">
                            Re-order level
                          </Label>
                          <Input 
                            id="edit-reorder-level" 
                            type="number" 
                            placeholder="E.g. 10" 
                            className="w-full"
                            value={formData.reorderLevel}
                            onChange={(e) => handleInputChange("reorderLevel", e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Minimum quantity before reordering</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-price" className="text-sm font-medium">
                            Price per unit *
                          </Label>
                          <Input 
                            id="edit-price" 
                            type="number" 
                            step="0.01"
                            placeholder="E.g. रु 120" 
                            className="w-full"
                            value={formData.price}
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-supplier" className="text-sm font-medium">
                            Supplier
                          </Label>
                          <SupplierSelect
                            value={formData.supplier || ""}
                            onChange={(value) => handleInputChange("supplier", value)}
                            placeholder="Search or select supplier"
                            suppliers={suppliers}
                            onAddSupplier={handleAddSupplierFromSelect}
                            onOpenNestedForm={handleOpenNestedSupplierForm}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-description" className="text-sm font-medium">
                            Description (Optional)
                          </Label>
                          <Textarea 
                            id="edit-description" 
                            placeholder="E.g. Handpicked dishes for a quick and satisfying lunch." 
                            className="w-full min-h-[80px]"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 px-6 py-4 border-t mt-auto">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="text-white flex-1" style={{ backgroundColor: '#D8550D' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}>
                        Save changes
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>

              {/* Search and Filters */}
              {stockItems.length > 0 && (
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search stock items" 
                      className="pl-10 bg-white border-gray-200"
                      value={stockItemSearch}
                      onChange={(e) => setStockItemSearch(e.target.value)}
                    />
                  </div>
                  <Select value={stockItemCategoryFilter} onValueChange={setStockItemCategoryFilter}>
                    <SelectTrigger className="w-48 bg-white border-gray-200">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {stockGroups.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={stockItemStatusFilter} onValueChange={setStockItemStatusFilter}>
                    <SelectTrigger className="w-48 bg-white border-gray-200">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Low Quantity">Low Quantity</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Stock Items Table */}
              <div>
                {!isHydrated ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : stockItems.length === 0 ? (
                  <StockItemsEmptyState onAddStockItem={handleAddStockItem} />
                ) : filteredStockItems.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">No stock items match your filters</div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setStockItemSearch("")
                          setStockItemCategoryFilter("all")
                          setStockItemStatusFilter("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStockItems.map((item) => (
                        <TableRow 
                          key={item.id}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => window.location.href = `/stock-item/${item.id}`}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.image} />
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                                  {item.icon || item.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500 font-normal">{item.description || "No description"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.quantity} {item.measuringUnit || ""}</div>
                            <div className="text-sm text-gray-500 font-normal">
                              {item.reorderLevel ? `Min: ${item.reorderLevel} ${item.measuringUnit || ""}` : "No re-order level"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                item.status === "Available" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : item.status === "Low Quantity"
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {item.status === "Available" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {item.status === "Low Quantity" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {item.status === "Out of Stock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {new Date(item.lastUpdated).toLocaleDateString('en-US', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(item.lastUpdated).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRecordPurchaseAction(item); }}>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Record Purchase
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRecordUsageAction(item); }}>
                                  <Minus className="mr-2 h-4 w-4" />
                                  Record Usage
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStockItem(item); }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit stock item
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/stock-item/${item.id}`}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    View Activity Logs
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete stock item
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your suppliers and vendor information for better inventory tracking.
                  </p>
                </div>
                {suppliers.length > 0 && (
                  <Button 
                    onClick={handleAddSupplier}
                    className="text-white" 
                    style={{ backgroundColor: '#D8550D' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Supplier
                  </Button>
                )}
              </div>

              {/* Search */}
              {suppliers.length > 0 && (
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search suppliers" 
                      className="pl-10 bg-white border-gray-200"
                      value={supplierSearch}
                      onChange={(e) => setSupplierSearch(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Suppliers Table */}
              <div>
                {!isHydrated ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : suppliers.length === 0 ? (
                  <SuppliersEmptyState onAddSupplier={handleAddSupplier} />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Tax Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                                  {supplier.legalName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{supplier.legalName}</div>
                                <div className="text-sm text-gray-500 font-normal">
                                  {supplier.contactPerson || "No contact person"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{supplier.phoneNumber}</div>
                            <div className="text-sm text-gray-500 font-normal">{supplier.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{supplier.taxNumber || "Not provided"}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 max-w-[200px] truncate">
                              {supplier.address || "No address provided"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{new Date(supplier.lastUpdated).toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit supplier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteSupplier(supplier)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete supplier
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Supplier Creation/Edit Sheet */}
              <Sheet open={isSupplierSheetOpen} onOpenChange={setIsSupplierSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                  <form onSubmit={handleSupplierSubmit} className="flex flex-col h-full">
                    <div className="px-6 flex-1">
                      <SheetHeader className="pl-0">
                        <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">
                          {editingSupplier ? "Edit supplier" : "Create supplier"}
                        </SheetTitle>
                        <SheetDescription>
                          {editingSupplier 
                            ? "Update the supplier details." 
                            : "Add a new supplier to your vendor list."
                          }
                        </SheetDescription>
                      </SheetHeader>
                      
                      {/* Separator line */}
                      <div className="border-b border-gray-200 mb-6"></div>
                      
                      <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="legal-name" className="text-sm font-medium">
                            Legal name *
                          </Label>
                          <Input 
                            id="legal-name" 
                            placeholder="E.g. ABC Suppliers Pvt. Ltd." 
                            className="w-full"
                            value={supplierFormData.legalName}
                            onChange={(e) => handleSupplierInputChange("legalName", e.target.value)}
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
                            value={supplierFormData.contactPerson}
                            onChange={(e) => handleSupplierInputChange("contactPerson", e.target.value)}
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
                            value={supplierFormData.phoneNumber}
                            onChange={(e) => handleSupplierInputChange("phoneNumber", e.target.value)}
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
                            value={supplierFormData.email}
                            onChange={(e) => handleSupplierInputChange("email", e.target.value)}
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
                            value={supplierFormData.taxNumber}
                            onChange={(e) => handleSupplierInputChange("taxNumber", e.target.value)}
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
                            value={supplierFormData.address}
                            onChange={(e) => handleSupplierInputChange("address", e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer with actions */}
                    <div className="flex gap-3 px-6 py-4 border-t mt-auto">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if (editingSupplier) {
                            // Cancel - close form
                            setIsSupplierSheetOpen(false)
                            setEditingSupplier(null)
                            setSupplierFormData({
                              legalName: "",
                              phoneNumber: "",
                              taxNumber: "",
                              email: "",
                              address: "",
                              contactPerson: ""
                            })
                          } else {
                            // Add another - save and keep form open
                            handleAddAnotherSupplier()
                          }
                        }}
                      >
                        {editingSupplier ? "Cancel" : "Add another"}
                      </Button>
                      <Button 
                        type="submit"
                        className="text-white flex-1" 
                        style={{ backgroundColor: '#D8550D' }}
                      >
                        {editingSupplier ? "Update Supplier" : "Save Supplier"}
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
            </TabsContent>

            <TabsContent value="measuring-unit" className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Measuring Units</h1>
                  <p className="text-gray-600 mt-1">
                    Manage measurement units used for tracking stock items in your inventory.
                  </p>
                </div>
                {measuringUnitsData.length > 0 && (
                  <Button 
                    onClick={() => setShowCreateMeasuringUnit(true)}
                    className="text-white" 
                    style={{ backgroundColor: '#D8550D' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Measuring Unit
                  </Button>
                )}
              </div>

              {/* Search */}
              {measuringUnitsData.length > 0 && (
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search measuring units" 
                      className="pl-10 bg-white border-gray-200"
                      value={measuringUnitSearchData}
                      onChange={(e) => setMeasuringUnitSearchData(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Measuring Units Table */}
              <div>
                {!isHydrated ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : measuringUnitsData.length === 0 ? (
                  <MeasuringUnitsEmptyState onAddMeasuringUnit={() => setShowCreateMeasuringUnit(true)} />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unit Name</TableHead>
                        <TableHead>Short Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMeasuringUnitsData.map((unit) => (
                        <TableRow key={unit.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {unit.abbreviation.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{unit.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{unit.abbreviation}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditMeasuringUnit(unit)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit measuring unit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteMeasuringUnit(unit)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete measuring unit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stock-group" className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Stock Groups</h1>
                  <p className="text-gray-600 mt-1">
                    Organize your inventory into logical groups for better management.
                  </p>
                </div>
                {stockGroupsData.length > 0 && (
                  <Button 
                    onClick={() => setShowCreateStockGroup(true)}
                    className="text-white" 
                    style={{ backgroundColor: '#D8550D' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Stock Group
                  </Button>
                )}
              </div>

              {/* Search */}
              {stockGroupsData.length > 0 && (
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search stock groups" 
                      className="pl-10 bg-white border-gray-200"
                      value={stockGroupSearchData}
                      onChange={(e) => setStockGroupSearchData(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Stock Groups Table */}
              <div>
                {!isHydrated ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : stockGroupsData.length === 0 ? (
                  <StockGroupsEmptyState onAddStockGroup={() => setShowCreateStockGroup(true)} />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockGroupsWithCounts.map((group) => (
                        <TableRow key={group.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {group.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{group.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-600">{group.description || "No description"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{group.itemCount} items</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditStockGroup(group)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit stock group
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteStockGroup(group)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete stock group
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stock-history" className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
                  <p className="text-gray-600 mt-1">
                    Transaction history and stock movements
                  </p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search activities" 
                    className="pl-10 bg-white border-gray-200"
                    value={activitySearchData}
                    onChange={(e) => setActivitySearchData(e.target.value)}
                  />
                </div>
                <Select value={activityFilterType} onValueChange={setActivityFilterType}>
                  <SelectTrigger className="w-48 bg-white border-gray-200">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Usage">Usage</SelectItem>
                    <SelectItem value="Opening Stock">Opening Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activityFilterItem} onValueChange={setActivityFilterItem}>
                  <SelectTrigger className="w-48 bg-white border-gray-200">
                    <SelectValue placeholder="Filter by item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    {stockItems.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Logs Table */}
              <div>
                {!isHydrated ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : filteredActivityLogs.length === 0 ? (
                  <ActivityLogsEmptyState />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivityLogs.map((activity) => {
                        const stockItem = stockItems.find(item => item.id === activity.stockItemId)
                        return (
                          <TableRow key={activity.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={stockItem?.image} />
                                  <AvatarFallback>
                                    {stockItem?.icon || stockItem?.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{stockItem?.name || 'Unknown Item'}</div>
                                  <div className="text-sm text-gray-500">{stockItem?.category}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  activity.type === "Purchase" 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : activity.type === "Opening Stock"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {activity.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {activity.quantity} {activity.measuringUnit}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-600">{activity.party || 'N/A'}</div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{new Date(activity.date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">{activity.time}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatNepaliCurrency(activity.stockValue)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewActivityDetails(activity)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteActivity(activity)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Record
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your application settings and data
                  </p>
                </div>
              </div>

              {/* Settings Content */}
              <div className="space-y-8">
                {/* Data Management Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
                      <p className="text-sm text-gray-600">
                        Reset all data to default state or populate with sample data for testing.
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => setShowResetConfirmation(true)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Reset All Data
                      </Button>
                      <Button 
                        onClick={() => setShowPopulateConfirmation(true)}
                        className="text-white flex items-center gap-2"
                        style={{ backgroundColor: '#D8550D' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                      >
                        <Plus className="h-4 w-4" />
                        Populate Sample Data
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Application Info Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Information</h3>
                      <p className="text-sm text-gray-600">
                        Details about your current application state and data.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Stock Items:</span>
                          <span className="text-sm font-medium">{stockItems.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Suppliers:</span>
                          <span className="text-sm font-medium">{suppliers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Stock Groups:</span>
                          <span className="text-sm font-medium">{stockGroupsData.length}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Measuring Units:</span>
                          <span className="text-sm font-medium">{measuringUnitsData.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Transactions:</span>
                          <span className="text-sm font-medium">{stockTransactions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Updated:</span>
                          <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Nested Supplier Creation Form - Available from any tab */}
          <NestedFormSheet
            open={isNestedSupplierFormOpen}
            onOpenChange={setIsNestedSupplierFormOpen}
            onBack={() => setIsNestedSupplierFormOpen(false)}
            title="Create supplier"
            description="Add a new supplier to your vendor list."
            footer={
              <>
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsNestedSupplierFormOpen(false)}
                >
                  Back
                </Button>
                <Button 
                  type="button"
                  className="text-white flex-1" 
                  style={{ backgroundColor: '#D8550D' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                  onClick={() => {
                    if (supplierFormData.legalName.trim()) {
                      handleNestedSupplierSubmit(supplierFormData)
                    } else {
                      addToast('error', 'Legal name is required')
                    }
                  }}
                >
                  Save Supplier
                </Button>
              </>
            }
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nested-legal-name" className="text-sm font-medium">
                  Legal name *
                </Label>
                <Input 
                  id="nested-legal-name" 
                  placeholder="E.g. ABC Suppliers Pvt. Ltd." 
                  className="w-full"
                  value={supplierFormData.legalName}
                  onChange={(e) => handleSupplierInputChange("legalName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nested-contact-person" className="text-sm font-medium">
                  Contact person
                </Label>
                <Input 
                  id="nested-contact-person" 
                  placeholder="E.g. John Doe" 
                  className="w-full"
                  value={supplierFormData.contactPerson}
                  onChange={(e) => handleSupplierInputChange("contactPerson", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nested-phone-number" className="text-sm font-medium">
                  Phone number
                </Label>
                <Input 
                  id="nested-phone-number" 
                  placeholder="E.g. +977 1-2345678" 
                  className="w-full"
                  value={supplierFormData.phoneNumber}
                  onChange={(e) => handleSupplierInputChange("phoneNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nested-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input 
                  id="nested-email" 
                  type="email"
                  placeholder="E.g. contact@abcsuppliers.com" 
                  className="w-full"
                  value={supplierFormData.email}
                  onChange={(e) => handleSupplierInputChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nested-tax-number" className="text-sm font-medium">
                  Tax number
                </Label>
                <Input 
                  id="nested-tax-number" 
                  placeholder="E.g. 123456789" 
                  className="w-full"
                  value={supplierFormData.taxNumber}
                  onChange={(e) => handleSupplierInputChange("taxNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nested-address" className="text-sm font-medium">
                  Address
                </Label>
                <Textarea 
                  id="nested-address" 
                  placeholder="E.g. 123 Main Street, Kathmandu, Nepal" 
                  className="w-full"
                  value={supplierFormData.address}
                  onChange={(e) => handleSupplierInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </NestedFormSheet>
        </div>
      </div>

      {/* Add Stock Form Modal */}
      {showAddStockForm && selectedItem && (
        <AddStockForm
          itemName={selectedItem.name}
          measuringUnit={selectedItem.measuringUnit}
          suppliers={suppliers}
          onAddSupplier={handleAddSupplierFromSelect}
          onClose={() => setShowAddStockForm(false)}
          onSubmit={handleRecordPurchaseSubmit}
        />
      )}

      {/* Record Usage Form Modal */}
      {showStockOutForm && selectedItem && (
        <StockOutForm
          itemName={selectedItem.name}
          measuringUnit={selectedItem.measuringUnit}
          currentStock={selectedItem.quantity}
          suppliers={suppliers}
          onAddSupplier={handleAddSupplierFromSelect}
          onClose={() => setShowStockOutForm(false)}
          onSubmit={handleRecordUsageSubmit}
        />
      )}

      {/* Measuring Unit Creation/Edit Sheet */}
      <Sheet open={showCreateMeasuringUnit} onOpenChange={(open) => {
        setShowCreateMeasuringUnit(open)
        if (!open) {
          // Reset edit state when sheet is closed
          setEditingMeasuringUnit(null)
          setNewMeasuringUnitName("")
          setNewMeasuringUnitAbbr("")
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (editingMeasuringUnit) {
              handleUpdateMeasuringUnit();
            } else {
              handleCreateMeasuringUnit();
            }
          }} className="flex flex-col h-full">
            <div className="px-6 flex-1">
              <SheetHeader className="pl-0">
                <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">
                  {editingMeasuringUnit ? "Edit Measuring Unit" : "New Measuring Unit"}
                </SheetTitle>
                <SheetDescription>
                  {editingMeasuringUnit ? "Update the measuring unit details." : "Add a new measurement unit to your inventory system."}
                </SheetDescription>
              </SheetHeader>
              
              {/* Separator line */}
              <div className="border-b border-gray-200 mb-6"></div>
              
              <div className="space-y-6 mt-6">
                {/* Unit Name */}
                <div className="space-y-2">
                  <Label htmlFor="unit-name" className="text-sm font-medium">
                    Unit Name *
                  </Label>
                  <Input
                    id="unit-name"
                    placeholder="E.g. Kilograms, Liters, Pieces"
                    value={newMeasuringUnitName}
                    onChange={(e) => setNewMeasuringUnitName(e.target.value)}
                    required
                  />
                </div>
                
                {/* Short Name */}
                <div className="space-y-2">
                  <Label htmlFor="unit-abbr" className="text-sm font-medium">
                    Short Name *
                  </Label>
                  <Input
                    id="unit-abbr"
                    placeholder="E.g. kg, L, pcs"
                    value={newMeasuringUnitAbbr}
                    onChange={(e) => setNewMeasuringUnitAbbr(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 px-6 py-4 border-t mt-auto">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (editingMeasuringUnit) {
                    // Cancel edit - close form and reset state
                    setShowCreateMeasuringUnit(false)
                    setEditingMeasuringUnit(null)
                    setNewMeasuringUnitName("")
                    setNewMeasuringUnitAbbr("")
                  } else {
                    // Add another - create unit and reset form
                    if (newMeasuringUnitName.trim() && newMeasuringUnitAbbr.trim()) {
                      const newUnit: MeasuringUnit = {
                        id: generateUniqueId(),
                        name: newMeasuringUnitName.trim(),
                        abbreviation: newMeasuringUnitAbbr.trim(),
                        createdAt: new Date().toISOString()
                      }
                      updateMeasuringUnits([...measuringUnitsData, newUnit])
                      addToast('success', `Measuring unit "${newUnit.name}" created successfully`)
                      
                      // Reset form
                      setNewMeasuringUnitName("")
                      setNewMeasuringUnitAbbr("")
                    }
                  }
                }}
              >
                {editingMeasuringUnit ? "Cancel" : "Add another"}
              </Button>
              <Button 
                type="submit" 
                className="text-white flex-1"
                style={{ backgroundColor: '#D8550D' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
              >
                {editingMeasuringUnit ? "Update Unit" : "Create Unit"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Stock Group Creation/Edit Sheet */}
      <Sheet open={showCreateStockGroup} onOpenChange={(open) => {
        setShowCreateStockGroup(open)
        if (!open) {
          // Reset edit state when sheet is closed
          setEditingStockGroup(null)
          setNewStockGroupName("")
          setNewStockGroupDescription("")
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (editingStockGroup) {
              handleUpdateStockGroup();
            } else {
              handleCreateStockGroup();
            }
          }} className="flex flex-col h-full">
            <div className="px-6 flex-1">
              <SheetHeader className="pl-0">
                <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">
                  {editingStockGroup ? "Edit Stock Group" : "New Stock Group"}
                </SheetTitle>
                <SheetDescription>
                  {editingStockGroup ? "Update the stock group details." : "Add a new stock group to organize your inventory."}
                </SheetDescription>
              </SheetHeader>
              
              {/* Separator line */}
              <div className="border-b border-gray-200 mb-6"></div>
              
              <div className="space-y-6 mt-6">
                {/* Group Name */}
                <div className="space-y-2">
                  <Label htmlFor="group-name" className="text-sm font-medium">
                    Group Name *
                  </Label>
                  <Input
                    id="group-name"
                    placeholder="E.g. Groceries, Vegetables, Meat"
                    value={newStockGroupName}
                    onChange={(e) => setNewStockGroupName(e.target.value)}
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="group-description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="group-description"
                    placeholder="Brief description of what this group contains"
                    value={newStockGroupDescription}
                    onChange={(e) => setNewStockGroupDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 px-6 py-4 border-t mt-auto">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (editingStockGroup) {
                    // Cancel edit - close form and reset state
                    setShowCreateStockGroup(false)
                    setEditingStockGroup(null)
                    setNewStockGroupName("")
                    setNewStockGroupDescription("")
                  } else {
                    // Add another - create group and reset form
                    if (newStockGroupName.trim()) {
                      const newGroup: StockGroup = {
                        id: generateUniqueId(),
                        name: newStockGroupName.trim(),
                        description: newStockGroupDescription.trim(),
                        itemCount: 0,
                        createdAt: new Date().toISOString()
                      }
                      updateStockGroupsData([...stockGroupsData, newGroup])
                      addToast('success', `Stock group "${newGroup.name}" created successfully`)
                      
                      // Reset form
                      setNewStockGroupName("")
                      setNewStockGroupDescription("")
                    }
                  }
                }}
              >
                {editingStockGroup ? "Cancel" : "Add another"}
              </Button>
              <Button 
                type="submit" 
                className="text-white flex-1"
                style={{ backgroundColor: '#D8550D' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
              >
                {editingStockGroup ? "Update Group" : "Create Group"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Measuring Unit Confirmation Modal */}
      {showDeleteMeasuringUnitConfirmation && deletingMeasuringUnit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close Icon */}
            <button 
              onClick={() => setShowDeleteMeasuringUnitConfirmation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Icon */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Measuring Unit?</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will permanently remove &quot;{deletingMeasuringUnit.name}&quot; from your measuring units. This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteMeasuringUnitConfirmation(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteMeasuringUnit}
                className="px-6"
              >
                Delete Unit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Stock Group Confirmation Modal */}
      {showDeleteStockGroupConfirmation && deletingStockGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close Icon */}
            <button 
              onClick={() => setShowDeleteStockGroupConfirmation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Icon */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Stock Group?</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will permanently remove &quot;{deletingStockGroup.name}&quot; from your stock groups. This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteStockGroupConfirmation(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteStockGroup}
                className="px-6"
              >
                Delete Group
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && deletingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close Icon */}
            <button 
              onClick={() => setShowDeleteConfirmation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Icon */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Stock Item?</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will permanently remove &quot;{deletingItem.name}&quot; from your inventory. This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteItem}
                className="px-6"
              >
                Delete Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {showActivityDetailsModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close button */}
            <button 
              onClick={() => setShowActivityDetailsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Activity Details</h3>
                <p className="text-gray-600">Transaction information</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Item</label>
                <p className="text-gray-900">{stockItems.find(item => item.id === selectedActivity.stockItemId)?.name || 'Unknown Item'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-gray-900">{selectedActivity.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <p className="text-gray-900">{selectedActivity.quantity} {selectedActivity.measuringUnit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Party</label>
                <p className="text-gray-900">{selectedActivity.party || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <p className="text-gray-900">{new Date(selectedActivity.date).toLocaleDateString()} at {selectedActivity.time}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Value</label>
                <p className="text-gray-900">{formatNepaliCurrency(selectedActivity.stockValue)}</p>
              </div>
              {selectedActivity.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-gray-900">{selectedActivity.notes}</p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowActivityDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Activity Confirmation Modal */}
      {showDeleteActivityConfirmation && deletingActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close button */}
            <button 
              onClick={() => setShowDeleteActivityConfirmation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Icon and title */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Record?</h3>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will permanently remove this activity record from your history. This action cannot be undone.
            </p>
            
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteActivityConfirmation(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteActivity}
                className="px-6"
              >
                Delete Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All Data Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close Icon */}
            <button 
              onClick={() => setShowResetConfirmation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Icon */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Reset All Data?</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will permanently delete all your stock items, suppliers, transactions, and settings. This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowResetConfirmation(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleResetAllData}
                className="px-6"
              >
                Reset All Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Populate Sample Data Confirmation Modal */}
      {showPopulateConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Close Icon */}
            <button 
              onClick={() => setShowPopulateConfirmation(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Icon */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Populate Sample Data?</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will add sample stock items, suppliers, and transactions to help you get started. Existing data will be replaced.
            </p>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPopulateConfirmation(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePopulateSampleData}
                className="px-6 text-white"
                style={{ backgroundColor: '#D8550D' }}
              >
                Populate Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[70] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm flex items-start gap-3"
          >
            {/* Success Icon */}
            {toast.type === 'success' && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Error Icon */}
            {toast.type === 'error' && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Icon */}
            {toast.type === 'warning' && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{toast.message}</p>
              {toast.action && (
                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      toast.action?.action()
                      removeToast(toast.id)
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {toast.action?.label}
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
