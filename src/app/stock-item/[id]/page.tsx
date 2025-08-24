"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddStockForm } from "@/components/add-stock-form"
import { StockOutForm } from "@/components/stock-out-form"
import { EditRecordForm } from "@/components/edit-record-form"
import { StockManagementMenu } from "@/components/stock-management-menu"
import { 
  ArrowLeft,
  MoreHorizontal,
  Home, 
  Package, 
  FileText, 
  Square, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity, 
  Settings,
  Menu
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

interface StockTransaction {
  id: number
  stockItemId: number
  date: string
  time: string
  type: "Stock in" | "Stock out" | "Initial stock"
  quantity: number
  measuringUnit: string
  party: string
  stockValue: number
  notes: string
}

interface AddStockData {
  quantity: number
  perUnitPrice: number
  supplierName: string
  dateTime: string
  notes: string
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

export default function StockItemHistory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [stockItem, setStockItem] = useState<StockItem | null>(null)
  const [transactions, setTransactions] = useState<StockTransaction[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [showAddStockForm, setShowAddStockForm] = useState(false)
  const [showStockOutForm, setShowStockOutForm] = useState(false)
  const [showEditRecordForm, setShowEditRecordForm] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<StockTransaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<StockTransaction | null>(null)
  
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

  // Handle add stock form submission
  const handleAddStock = (data: AddStockData) => {
    // Here you would typically save the stock data
    console.log('Adding stock:', data)
    
    // Add a new transaction to the list
    const newTransaction = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      stockItemId: parseInt(id),
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
      type: "Stock in" as const,
      quantity: data.quantity,
      measuringUnit: stockItem?.measuringUnit || "Kg",
      party: data.supplierName,
      stockValue: data.quantity * data.perUnitPrice,
      notes: data.notes || "-"
    }
    
    setTransactions(prev => [newTransaction, ...prev])
    
    // Save to localStorage
    const savedTransactions = localStorage.getItem('stockTransactions')
    const allTransactions = savedTransactions ? JSON.parse(savedTransactions) : []
    localStorage.setItem('stockTransactions', JSON.stringify([newTransaction, ...allTransactions]))
    
    // Update stock item quantity in main page
    if (stockItem) {
      const updatedQuantity = stockItem.quantity + data.quantity
      const updatedStockItem = { ...stockItem, quantity: updatedQuantity }
      
      // Update stock items in localStorage
      const savedItems = localStorage.getItem('stockItems')
      if (savedItems) {
        const items = JSON.parse(savedItems)
        const updatedItems = items.map((item: StockItem) => 
          item.id === stockItem.id ? updatedStockItem : item
        )
        localStorage.setItem('stockItems', JSON.stringify(updatedItems))
      }
    }
    
    setShowAddStockForm(false)
  }

  // Handle stock management menu actions
  const handleStockIn = () => {
    setShowAddStockForm(true)
  }

  const handleStockOut = () => {
    setShowStockOutForm(true)
  }

  // Handle stock out form submission
  const handleStockOutSubmit = (data: StockOutData) => {
    // Here you would typically save the stock out data
    console.log('Stocking out:', data)
    
    // Helper function to get supplier name from ID
    const getSupplierName = (supplierId: string) => {
      // This should ideally come from a shared state or API
      // For now, we'll use a static list that matches the form
      const suppliers = [
        { id: "supplier-1", name: "ABC Suppliers" },
        { id: "supplier-2", name: "XYZ Corporation" },
        { id: "supplier-3", name: "Quality Foods Ltd" },
        { id: "supplier-4", name: "Fresh Market Supplies" }
      ]
      
      // Check for dynamically created suppliers (they have timestamp-based IDs)
      if (supplierId.startsWith('supplier-') && supplierId !== 'supplier-1' && supplierId !== 'supplier-2' && supplierId !== 'supplier-3' && supplierId !== 'supplier-4') {
        // In a real app, you'd get the supplier name from your state management
        // For now, we'll extract it from the data if available
        return data.supplierName || "New Supplier"
      }
      
      const supplier = suppliers.find(s => s.id === supplierId)
      return supplier ? supplier.name : "Unknown Supplier"
    }
    
    // Determine the party based on the reason for deduction
    let party = data.reasonForDeduction
    if (data.reasonForDeduction === "returned-to-supplier" && data.supplier) {
      party = getSupplierName(data.supplier)
    }
    
    // Add a new transaction to the list
    const newTransaction = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      stockItemId: parseInt(id),
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
      type: "Stock out" as const,
      quantity: data.quantity,
      measuringUnit: stockItem?.measuringUnit || "Kg",
      party: party,
      stockValue: data.quantity * data.perUnitPrice,
      notes: data.notes || "-"
    }
    
    setTransactions(prev => [newTransaction, ...prev])
    
    // Save to localStorage
    const savedTransactions = localStorage.getItem('stockTransactions')
    const allTransactions = savedTransactions ? JSON.parse(savedTransactions) : []
    localStorage.setItem('stockTransactions', JSON.stringify([newTransaction, ...allTransactions]))
    
    // Update stock item quantity in main page
    if (stockItem) {
      const updatedQuantity = Math.max(0, stockItem.quantity - data.quantity)
      const updatedStockItem = { ...stockItem, quantity: updatedQuantity }
      
      // Update stock items in localStorage
      const savedItems = localStorage.getItem('stockItems')
      if (savedItems) {
        const items = JSON.parse(savedItems)
        const updatedItems = items.map((item: StockItem) => 
          item.id === stockItem.id ? updatedStockItem : item
        )
        localStorage.setItem('stockItems', JSON.stringify(updatedItems))
      }
    }
    
    setShowStockOutForm(false)
  }

  // Handle edit record
  const handleEditRecord = (transaction: StockTransaction) => {
    setEditingTransaction(transaction)
    setShowEditRecordForm(true)
  }

  // Handle delete record confirmation
  const handleDeleteRecord = (transaction: StockTransaction) => {
    setDeletingTransaction(transaction)
    setShowDeleteConfirmation(true)
  }

  // Confirm delete record
  const confirmDeleteRecord = () => {
    if (deletingTransaction) {
      setTransactions(prev => prev.filter(t => t.id !== deletingTransaction.id))
      
      // Update localStorage
      const savedTransactions = localStorage.getItem('stockTransactions')
      const allTransactions = savedTransactions ? JSON.parse(savedTransactions) : []
      const updatedTransactions = allTransactions.filter((t: StockTransaction) => t.id !== deletingTransaction.id)
      localStorage.setItem('stockTransactions', JSON.stringify(updatedTransactions))
      
      // Update stock item quantity in main page based on remaining transactions
      if (stockItem) {
        const itemTransactions = updatedTransactions.filter((t: StockTransaction) => t.stockItemId === stockItem.id)
        let totalQuantity = 0
        
        itemTransactions.forEach((transaction: StockTransaction) => {
          if (transaction.type === "Stock in" || transaction.type === "Initial stock") {
            totalQuantity += transaction.quantity
          } else if (transaction.type === "Stock out") {
            totalQuantity -= transaction.quantity
          }
        })
        
        const updatedStockItem = { ...stockItem, quantity: Math.max(0, totalQuantity) }
        
        // Update stock items in localStorage
        const savedItems = localStorage.getItem('stockItems')
        if (savedItems) {
          const items = JSON.parse(savedItems)
          const updatedItems = items.map((item: StockItem) => 
            item.id === stockItem.id ? updatedStockItem : item
          )
          localStorage.setItem('stockItems', JSON.stringify(updatedItems))
        }
      }
      
      setDeletingTransaction(null)
      setShowDeleteConfirmation(false)
    }
  }

  // Handle edit record form submission
  const handleEditRecordSubmit = (data: { quantity: number; party: string; perUnitPrice: number; notes: string; dateTime: string }) => {
    if (editingTransaction) {
      // Parse the date and time from the datetime string
      const dateTime = new Date(data.dateTime)
      const date = dateTime.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
      const time = dateTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      
      // Update the transaction
      const updatedTransaction = {
        ...editingTransaction,
        quantity: data.quantity,
        party: data.party,
        stockValue: data.quantity * data.perUnitPrice,
        notes: data.notes,
        date: date,
        time: time
      }
      
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id ? updatedTransaction : t
      ))
      
      // Update localStorage
      const savedTransactions = localStorage.getItem('stockTransactions')
      const allTransactions = savedTransactions ? JSON.parse(savedTransactions) : []
      const updatedAllTransactions = allTransactions.map((t: StockTransaction) => 
        t.id === editingTransaction.id ? updatedTransaction : t
      )
      localStorage.setItem('stockTransactions', JSON.stringify(updatedAllTransactions))
      
      // Update stock item quantity in main page based on all transactions
      if (stockItem) {
        const itemTransactions = updatedAllTransactions.filter((t: StockTransaction) => t.stockItemId === stockItem.id)
        let totalQuantity = 0
        
        itemTransactions.forEach((transaction: StockTransaction) => {
          if (transaction.type === "Stock in" || transaction.type === "Initial stock") {
            totalQuantity += transaction.quantity
          } else if (transaction.type === "Stock out") {
            totalQuantity -= transaction.quantity
          }
        })
        
        const updatedStockItem = { ...stockItem, quantity: Math.max(0, totalQuantity) }
        
        // Update stock items in localStorage
        const savedItems = localStorage.getItem('stockItems')
        if (savedItems) {
          const items = JSON.parse(savedItems)
          const updatedItems = items.map((item: StockItem) => 
            item.id === stockItem.id ? updatedStockItem : item
          )
          localStorage.setItem('stockItems', JSON.stringify(updatedItems))
        }
      }
      
      setEditingTransaction(null)
      setShowEditRecordForm(false)
    }
  }

  // Load data from localStorage after hydration
  useEffect(() => {
    const savedItems = localStorage.getItem('stockItems')
    if (savedItems) {
      const items = JSON.parse(savedItems)
      const item = items.find((item: StockItem) => item.id === parseInt(id))
      setStockItem(item || null)
    }

    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('stockTransactions')
    if (savedTransactions) {
      const allTransactions = JSON.parse(savedTransactions)
      const itemTransactions = allTransactions.filter((transaction: StockTransaction) => 
        transaction.stockItemId === parseInt(id)
      )
      setTransactions(itemTransactions)
    } else {
      // Load mock transaction data if no saved transactions exist
      const mockTransactions: StockTransaction[] = [
        {
          id: 1,
          stockItemId: parseInt(id),
          date: "3 June 2025",
          time: "2:44 PM",
          type: "Stock in",
          quantity: 100,
          measuringUnit: "Kg",
          party: "Ram Bahadur Phuyal",
          stockValue: 12000,
          notes: "-"
        },
        {
          id: 2,
          stockItemId: parseInt(id),
          date: "2 June 2025",
          time: "11:53 AM",
          type: "Stock out",
          quantity: 100,
          measuringUnit: "Kg",
          party: "SipnSkip Restaurant",
          stockValue: 10000,
          notes: "Wasted"
        }
      ]
      setTransactions(mockTransactions)
    }
    setIsHydrated(true)
  }, [id])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (!stockItem) {
    return (
      <div className="min-h-screen bg-white flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Stock item not found</h2>
            <p className="text-gray-600 mb-4">The stock item you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/">
              <Button>Back to Inventory</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
            <Image src="/box-logo.svg" alt="Box" width={24} height={24} className="h-6 w-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Home className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Home</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <FileText className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Menu manager</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} bg-gray-100 text-gray-900 rounded-lg transition-all duration-300 ease-out`}>
            <Package className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Inventory</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Square className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Areas and Tables</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Users className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Members</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Clock className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Order history</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <TrendingUp className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Sales</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Activity className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Activity</span>}
          </Link>
          <Link href="/" className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2'} text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out`}>
            <Settings className="h-6 w-6" />
            {!isSidebarCollapsed && <span>Profile and settings</span>}
          </Link>
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
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                             <Link href="/">
                 <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                   <ArrowLeft className="h-4 w-4" />
                 </Button>
               </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stock item - {stockItem.name}</h1>
                                 <p className="text-gray-600">Transaction history and stock movements</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="text-white" 
                  style={{ backgroundColor: '#D8550D' }} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8420A'} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D8550D'}
                >
                  Manage stock levels
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <StockManagementMenu
                  onStockIn={handleStockIn}
                  onStockOut={handleStockOut}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

                 {/* Content */}
         <div className="flex-1 p-6">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Date and time</TableHead>
                 <TableHead>Type</TableHead>
                 <TableHead>Quantity</TableHead>
                 <TableHead>Parties</TableHead>
                 <TableHead>Stock value</TableHead>
                 <TableHead>Notes/Comments</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {transactions.map((transaction) => (
                 <TableRow key={transaction.id}>
                   <TableCell>
                     <div>
                       <div className="font-medium">{transaction.date}</div>
                       <div className="text-sm text-gray-500">{transaction.time}</div>
                     </div>
                   </TableCell>
                   <TableCell>
                     <Badge 
                       className={
                         transaction.type === "Stock in" 
                           ? "bg-green-100 text-green-800 hover:bg-green-100"
                           : transaction.type === "Initial stock"
                           ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                           : "bg-red-100 text-red-800 hover:bg-red-100"
                       }
                     >
                       {transaction.type}
                     </Badge>
                   </TableCell>
                   <TableCell>
                     <div className="font-medium">{transaction.quantity} {transaction.measuringUnit}</div>
                   </TableCell>
                   <TableCell>
                     <div className="text-gray-900">{transaction.party}</div>
                   </TableCell>
                   <TableCell>
                     <div className="text-gray-900">₹ {transaction.stockValue.toLocaleString()}</div>
                   </TableCell>
                   <TableCell>
                     <div className="text-gray-600">{transaction.notes}</div>
                   </TableCell>
                   <TableCell className="text-right">
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="h-8 w-8 p-0">
                           <MoreHorizontal className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleEditRecord(transaction)}>
                           Edit Record
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleDeleteRecord(transaction)}>
                           Delete Record
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
      </div>



      {/* Add Stock Form Modal */}
      {showAddStockForm && stockItem && (
        <AddStockForm
          itemName={stockItem.name}
          measuringUnit={stockItem.measuringUnit}
          onClose={() => setShowAddStockForm(false)}
          onSubmit={handleAddStock}
        />
      )}

      {/* Stock Out Form Modal */}
      {showStockOutForm && stockItem && (
        <StockOutForm
          itemName={stockItem.name}
          measuringUnit={stockItem.measuringUnit}
          currentStock={stockItem.quantity}
          onClose={() => setShowStockOutForm(false)}
          onSubmit={handleStockOutSubmit}
        />
      )}

              {/* Edit Record Form Modal */}
        {showEditRecordForm && editingTransaction && (
          <EditRecordForm
            transaction={editingTransaction}
            onClose={() => setShowEditRecordForm(false)}
            onSubmit={handleEditRecordSubmit}
          />
        )}

              {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && deletingTransaction && (
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
                <h3 className="text-xl font-semibold text-gray-900">Delete Record?</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                This will permanently remove this transaction from the history. This action cannot be undone.
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
                  onClick={confirmDeleteRecord}
                  className="px-6"
                >
                  Delete Record
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
