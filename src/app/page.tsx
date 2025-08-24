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
}

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  CheckCircle
} from "lucide-react"
import { StockItemsEmptyState } from "@/components/stock-items-empty-state"
import Link from "next/link"

export default function Dashboard() {
  // Add custom CSS for brand colors
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .tabs-trigger[data-state="active"] {
        color: #D8550D !important;
        border-bottom-color: #D8550D !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])
  // State for stock items
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [stockGroupSearch, setStockGroupSearch] = useState("")
  const [isStockGroupOpen, setIsStockGroupOpen] = useState(false)
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
  const [measuringUnitSearch, setMeasuringUnitSearch] = useState("")
  const [isMeasuringUnitOpen, setIsMeasuringUnitOpen] = useState(false)
  const [measuringUnits, setMeasuringUnits] = useState([
    "kg",
    "g", 
    "L",
    "ml",
    "pcs",
    "boxes",
    "bottles",
    "cans",
    "bags",
    "units",
    "packs",
    "cartons",
    "dozens",
    "pairs",
    "sets",
    "rolls",
    "sheets",
    "pieces",
    "slices",
    "cups",
    "tablespoons",
    "teaspoons",
    "ounces",
    "pounds",
    "quarts",
    "gallons"
  ])

  // Custom setter that saves to localStorage
  const updateStockItems = (newItems: StockItem[]) => {
    setStockItems(newItems)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockItems', JSON.stringify(newItems))
    }
  }

  // Custom setter that saves stock groups to localStorage
  const updateStockGroups = (newGroups: string[]) => {
    setStockGroups(newGroups)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockGroups', JSON.stringify(newGroups))
    }
  }

  // Handle creating a new stock group
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = newGroupName.trim()
      updateStockGroups([...stockGroups, newGroup])
      handleInputChange("category", newGroup)
      setNewGroupName("")
      setShowCreateGroup(false)
      addToast('success', `Stock group "${newGroup}" created successfully`)
    }
  }

  // Filter stock groups based on search
  const filteredStockGroups = stockGroups.filter(group =>
    group.toLowerCase().includes(stockGroupSearch.toLowerCase())
  )

  // Filter measuring units based on search
  const filteredMeasuringUnits = measuringUnits.filter(unit =>
    unit.toLowerCase().includes(measuringUnitSearch.toLowerCase())
  )

  // Load data from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem('stockItems')
    if (saved) {
      setStockItems(JSON.parse(saved))
    }
    
    // Load stock groups from localStorage
    const savedGroups = localStorage.getItem('stockGroups')
    if (savedGroups) {
      setStockGroups(JSON.parse(savedGroups))
    }
    
    setIsHydrated(true)
  }, [])

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.stock-group-dropdown')) {
        setIsStockGroupOpen(false)
      }
      if (!target.closest('.measuring-unit-dropdown')) {
        setIsMeasuringUnitOpen(false)
      }
    }

    if (isStockGroupOpen || isMeasuringUnitOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isStockGroupOpen, isMeasuringUnitOpen])

  // State for form
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)
  const [toasts, setToasts] = useState<Array<{id: number, type: string, message: string, action: {label: string, action: () => void} | null}>>([])
  
  // State for sidebar - initialize with localStorage value if available
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      if (savedSidebarState !== null) {
        return JSON.parse(savedSidebarState)
      }
    }
    return false
  })

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
      price: item.price ? item.price.toString() : ""
    })
    setStockGroupSearch(item.category) // Set the search field to show current category
    setMeasuringUnitSearch(item.measuringUnit) // Set the search field to show current measuring unit
    setIsEditSheetOpen(true)
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
    price: ""
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
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      measuringUnit: formData.measuringUnit,
      quantity: parseInt(formData.quantity) || 0,
      status: parseInt(formData.quantity) > 0 ? "In Stock" : "Out of Stock",
      lastUpdated: new Date().toISOString().split('T')[0],
      image: "/avatars/default.jpg",
      description: formData.description,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      icon: formData.icon,
      price: parseFloat(formData.price) || 0
    }

    updateStockItems([...stockItems, newItem])
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      measuringUnit: "",
      quantity: "",
      reorderLevel: "",
      description: "",
      icon: "",
      price: ""
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
      status: parseInt(formData.quantity) > 0 ? "In Stock" : "Out of Stock",
      lastUpdated: new Date().toISOString().split('T')[0],
      description: formData.description,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      icon: formData.icon,
      price: parseFloat(formData.price) || 0
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
      price: ""
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
      price: ""
    })
    setEditingItem(null)
    setIsEditSheetOpen(false)
  }

  // Toast functions
  const addToast = (type: string, message: string, action: {label: string, action: () => void} | null = null) => {
    const id = Date.now()
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

  const handleUndoDelete = (deletedItem: StockItem) => {
    updateStockItems([...stockItems, deletedItem])
    addToast('success', 'Item restored successfully')
  }

  // Handle delete item
  const handleDelete = (id: number) => {
    const deletedItem = stockItems.find(item => item.id === id)
    updateStockItems(stockItems.filter(item => item.id !== id))
    addToast('success', 'Stock item deleted successfully', {
      label: 'Undo',
      action: () => deletedItem && handleUndoDelete(deletedItem)
    })
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

  return (
    <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button 
            onClick={handleSidebarToggle}
            className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          {!isSidebarCollapsed && (
            <img src="/box-logo.svg" alt="BOX by Bottle" className="h-6 w-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Home className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Home</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <FileText className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Menu manager</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} bg-gray-100 text-gray-900 rounded-lg transition-all duration-300 ease-out`}>
            <Package className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Inventory</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Square className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Areas and Tables</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Users className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Members</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Clock className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Order history</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <TrendingUp className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Sales</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Activity className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Activity</span>}
          </a>
          <a href="#" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Settings className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Profile and settings</span>}
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
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <Tabs defaultValue="stock-item" className="w-full">
            <TabsList className="flex justify-start bg-transparent h-auto p-0 px-6 border-b-0 shadow-none">
              <TabsTrigger 
                value="stock-item" 
                className="tabs-trigger relative px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
                style={{ 
                  '--tw-text-opacity': '1',
                  '--tw-border-opacity': '1'
                } as React.CSSProperties}
                data-state="active"
              >
                Stock item
              </TabsTrigger>
              <TabsTrigger 
                value="consumptions" 
                className="tabs-trigger relative px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Consumptions
              </TabsTrigger>
              <TabsTrigger 
                value="suppliers" 
                className="tabs-trigger relative px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Suppliers
              </TabsTrigger>
              <TabsTrigger 
                value="measuring-unit" 
                className="tabs-trigger relative px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Measuring unit
              </TabsTrigger>
              <TabsTrigger 
                value="stock-group" 
                className="tabs-trigger relative px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Stock group
              </TabsTrigger>
              <TabsTrigger 
                value="stock-history" 
                className="tabs-trigger relative px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-t-transparent data-[state=active]:border-l-transparent data-[state=active]:border-r-transparent bg-transparent rounded-none shadow-none !shadow-none focus:shadow-none focus-visible:shadow-none"
              >
                Stock history
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="stock-item" className="w-full">
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
                            Add a new stock item to your inventory.
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
                            <div className="relative stock-group-dropdown">
                              <Input
                                placeholder="Search or select a stock group"
                                value={stockGroupSearch}
                                onChange={(e) => {
                                  setStockGroupSearch(e.target.value)
                                  if (!isStockGroupOpen) setIsStockGroupOpen(true)
                                }}
                                onFocus={() => setIsStockGroupOpen(true)}
                                className="w-full"
                                required
                              />
                              
                              {isStockGroupOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                  {/* Groups List - Fixed height for 5 items */}
                                  <div className="max-h-[200px] overflow-y-auto">
                                    {filteredStockGroups.map((group) => (
                                      <button
                                        key={group}
                                        type="button"
                                        onClick={() => {
                                          handleInputChange("category", group)
                                          setStockGroupSearch(group)
                                          setIsStockGroupOpen(false)
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                      >
                                        {group}
                                      </button>
                                    ))}
                                  </div>
                                  
                                  {/* Separator */}
                                  <div className="border-t border-gray-200"></div>
                                  
                                  {/* Create New Group Button */}
                                  <div className="p-3">
                                    {showCreateGroup ? (
                                      <div className="space-y-2">
                                        <Input
                                          placeholder="Enter group name"
                                          value={newGroupName}
                                          onChange={(e) => setNewGroupName(e.target.value)}
                                          className="h-8 text-sm"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault()
                                              handleCreateGroup()
                                            }
                                          }}
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleCreateGroup}
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
                                              setShowCreateGroup(false)
                                              setNewGroupName("")
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
                                        onClick={() => setShowCreateGroup(true)}
                                        className="w-full h-8 text-sm justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create a new stock group
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="measuring-unit" className="text-sm font-medium">
                              Measuring unit *
                            </Label>
                            <div className="relative measuring-unit-dropdown">
                              <Input
                                placeholder="Search or select measuring unit"
                                value={measuringUnitSearch}
                                onChange={(e) => {
                                  setMeasuringUnitSearch(e.target.value)
                                  if (!isMeasuringUnitOpen) setIsMeasuringUnitOpen(true)
                                }}
                                onFocus={() => setIsMeasuringUnitOpen(true)}
                                className="w-full"
                                required
                              />
                              
                              {isMeasuringUnitOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                  {/* Units List - Fixed height for 5 items */}
                                  <div className="max-h-[200px] overflow-y-auto">
                                    {filteredMeasuringUnits.map((unit) => (
                                      <button
                                        key={unit}
                                        type="button"
                                        onClick={() => {
                                          handleInputChange("measuringUnit", unit)
                                          setMeasuringUnitSearch(unit)
                                          setIsMeasuringUnitOpen(false)
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                      >
                                        {unit === "kg" && "Kilograms (kg)"}
                                        {unit === "g" && "Grams (g)"}
                                        {unit === "L" && "Liters (L)"}
                                        {unit === "ml" && "Milliliters (ml)"}
                                        {unit === "pcs" && "Pieces (pcs)"}
                                        {unit === "boxes" && "Boxes"}
                                        {unit === "bottles" && "Bottles"}
                                        {unit === "cans" && "Cans"}
                                        {unit === "bags" && "Bags"}
                                        {unit === "units" && "Units"}
                                        {unit === "packs" && "Packs"}
                                        {unit === "cartons" && "Cartons"}
                                        {unit === "dozens" && "Dozens"}
                                        {unit === "pairs" && "Pairs"}
                                        {unit === "sets" && "Sets"}
                                        {unit === "rolls" && "Rolls"}
                                        {unit === "sheets" && "Sheets"}
                                        {unit === "pieces" && "Pieces"}
                                        {unit === "slices" && "Slices"}
                                        {unit === "cups" && "Cups"}
                                        {unit === "tablespoons" && "Tablespoons (tbsp)"}
                                        {unit === "teaspoons" && "Teaspoons (tsp)"}
                                        {unit === "ounces" && "Ounces (oz)"}
                                        {unit === "pounds" && "Pounds (lbs)"}
                                        {unit === "quarts" && "Quarts (qt)"}
                                        {unit === "gallons" && "Gallons (gal)"}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="current-stock" className="text-sm font-medium">
                              Current stock *
                            </Label>
                            <Input 
                              id="current-stock" 
                              type="number" 
                              placeholder="E.g. 50" 
                              className="w-full"
                              value={formData.quantity}
                              onChange={(e) => handleInputChange("quantity", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="reorder-level" className="text-sm font-medium">
                              Reorder level
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
                            <Label htmlFor="price" className="text-sm font-medium">
                              Price per unit *
                            </Label>
                            <Input 
                              id="price" 
                              type="number" 
                              step="0.01"
                              placeholder="E.g. 120.00" 
                              className="w-full"
                              value={formData.price}
                              onChange={(e) => handleInputChange("price", e.target.value)}
                              required
                            />
                            <p className="text-xs text-gray-500">Price per {formData.measuringUnit || "unit"}</p>
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
                              id: Date.now(),
                              name: formData.name,
                              category: formData.category,
                              measuringUnit: formData.measuringUnit,
                              quantity: parseInt(formData.quantity) || 0,
                              status: parseInt(formData.quantity) > 0 ? "In Stock" : "Out of Stock",
                              lastUpdated: new Date().toISOString().split('T')[0],
                              image: "/avatars/default.jpg",
                              description: formData.description,
                              reorderLevel: parseInt(formData.reorderLevel) || 0,
                              icon: formData.icon,
                              price: parseFloat(formData.price) || 0
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
                              price: ""
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
                          <div className="relative stock-group-dropdown">
                            <Input
                              placeholder="Search or select a stock group"
                              value={stockGroupSearch}
                              onChange={(e) => {
                                setStockGroupSearch(e.target.value)
                                if (!isStockGroupOpen) setIsStockGroupOpen(true)
                              }}
                              onFocus={() => setIsStockGroupOpen(true)}
                              className="w-full"
                              required
                            />
                            
                            {isStockGroupOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                {/* Groups List - Fixed height for 5 items */}
                                <div className="max-h-[200px] overflow-y-auto">
                                  {filteredStockGroups.map((group) => (
                                    <button
                                      key={group}
                                      type="button"
                                      onClick={() => {
                                        handleInputChange("category", group)
                                        setStockGroupSearch(group)
                                        setIsStockGroupOpen(false)
                                      }}
                                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                    >
                                      {group}
                                    </button>
                                  ))}
                                </div>
                                
                                {/* Separator */}
                                <div className="border-t border-gray-200"></div>
                                
                                                                  {/* Create New Group Button */}
                                  <div className="p-3">
                                  {showCreateGroup ? (
                                    <div className="space-y-2">
                                      <Input
                                        placeholder="Enter group name"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        className="h-8 text-sm"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleCreateGroup()
                                          }
                                        }}
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={handleCreateGroup}
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
                                            setShowCreateGroup(false)
                                            setNewGroupName("")
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
                                      onClick={() => setShowCreateGroup(true)}
                                      className="w-full h-8 text-sm justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Create a new stock group
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-measuring-unit" className="text-sm font-medium">
                            Measuring unit *
                          </Label>
                          <div className="relative measuring-unit-dropdown">
                            <Input
                              placeholder="Search or select measuring unit"
                              value={measuringUnitSearch}
                              onChange={(e) => {
                                setMeasuringUnitSearch(e.target.value)
                                if (!isMeasuringUnitOpen) setIsMeasuringUnitOpen(true)
                              }}
                              onFocus={() => setIsMeasuringUnitOpen(true)}
                              className="w-full"
                              required
                            />
                            
                            {isMeasuringUnitOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                {/* Units List - Fixed height for 5 items */}
                                <div className="max-h-[200px] overflow-y-auto">
                                  {filteredMeasuringUnits.map((unit) => (
                                    <button
                                      key={unit}
                                      type="button"
                                      onClick={() => {
                                        handleInputChange("measuringUnit", unit)
                                        setMeasuringUnitSearch(unit)
                                        setIsMeasuringUnitOpen(false)
                                      }}
                                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                    >
                                      {unit === "kg" && "Kilograms (kg)"}
                                      {unit === "g" && "Grams (g)"}
                                      {unit === "L" && "Liters (L)"}
                                      {unit === "ml" && "Milliliters (ml)"}
                                      {unit === "pcs" && "Pieces (pcs)"}
                                      {unit === "boxes" && "Boxes"}
                                      {unit === "bottles" && "Bottles"}
                                      {unit === "cans" && "Cans"}
                                      {unit === "bags" && "Bags"}
                                      {unit === "units" && "Units"}
                                      {unit === "packs" && "Packs"}
                                      {unit === "cartons" && "Cartons"}
                                      {unit === "dozens" && "Dozens"}
                                      {unit === "pairs" && "Pairs"}
                                      {unit === "sets" && "Sets"}
                                      {unit === "rolls" && "Rolls"}
                                      {unit === "sheets" && "Sheets"}
                                      {unit === "pieces" && "Pieces"}
                                      {unit === "slices" && "Slices"}
                                      {unit === "cups" && "Cups"}
                                      {unit === "tablespoons" && "Tablespoons (tbsp)"}
                                      {unit === "teaspoons" && "Teaspoons (tsp)"}
                                      {unit === "ounces" && "Ounces (oz)"}
                                      {unit === "pounds" && "Pounds (lbs)"}
                                      {unit === "quarts" && "Quarts (qt)"}
                                      {unit === "gallons" && "Gallons (gal)"}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
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
                          <Label htmlFor="edit-reorder-level" className="text-sm font-medium">
                            Reorder level
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
                            placeholder="E.g. 120.00" 
                            className="w-full"
                            value={formData.price}
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            required
                          />
                          <p className="text-xs text-gray-500">Price per {formData.measuringUnit || "unit"}</p>
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
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48 bg-white border-gray-200">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48 bg-white border-gray-200">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
                      {stockItems.map((item) => (
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
                              {item.reorderLevel ? `Min: ${item.reorderLevel} ${item.measuringUnit || ""}` : "No reorder level"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                item.status === "In Stock" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : item.status === "Low Stock"
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {item.status === "In Stock" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {item.status === "Low Stock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {item.status === "Out of Stock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{item.lastUpdated}</div>
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
                                <DropdownMenuItem>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Stock in
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Minus className="mr-2 h-4 w-4" />
                                  Stock out
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditStockItem(item)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit stock item
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/stock-item/${item.id}`}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    View History
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDelete(item.id)}
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

            {/* Other Tabs Content */}
            <TabsContent value="consumptions" className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Consumptions</h2>
                <p className="text-gray-600 mt-2">Track ingredient consumption and usage patterns.</p>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Suppliers</h2>
                <p className="text-gray-600 mt-2">Manage your suppliers and vendor information.</p>
              </div>
            </TabsContent>

            <TabsContent value="measuring-unit" className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Measuring Units</h2>
                <p className="text-gray-600 mt-2">Configure measurement units for your inventory.</p>
              </div>
            </TabsContent>

            <TabsContent value="stock-group" className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Stock Groups</h2>
                <p className="text-gray-600 mt-2">Organize your inventory into logical groups.</p>
              </div>
            </TabsContent>

            <TabsContent value="stock-history" className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Stock History</h2>
                <p className="text-gray-600 mt-2">View historical inventory changes and transactions.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
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
