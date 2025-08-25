"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { StockItemsEmptyState } from "@/components/stock-items-empty-state"
import { AddStockForm } from "@/components/add-stock-form"
import { StockOutForm } from "@/components/stock-out-form"
import { StockItem, Supplier, MeasuringUnit, StockGroup, StockTransaction } from "@/types"
import { filterStockItems, generateUniqueId, getStockItemStatus } from "@/utils/helpers"
import { formatNepaliCurrency } from "@/lib/utils"

interface StockItemsSectionProps {
  stockItems: StockItem[]
  setStockItems: (items: StockItem[]) => void
  suppliers: Supplier[]
  measuringUnits: MeasuringUnit[]
  stockGroups: StockGroup[]
  stockTransactions: StockTransaction[]
  setStockTransactions: (transactions: StockTransaction[]) => void
  addToast: (type: 'success' | 'error' | 'warning', message: string) => void
}

/**
 * Stock Items Section Component
 * DESIGN PATTERN: Feature-specific component with focused responsibility
 * - Handles all stock item related operations
 * - Manages search, filtering, and CRUD operations
 * - Provides consistent UI patterns for data display
 */
export function StockItemsSection({
  stockItems,
  setStockItems,
  suppliers,
  measuringUnits,
  stockGroups,
  stockTransactions,
  setStockTransactions,
  addToast
}: StockItemsSectionProps) {
  // Local state for UI interactions
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddStockFormOpen, setIsAddStockFormOpen] = useState(false)
  const [isStockOutFormOpen, setIsStockOutFormOpen] = useState(false)
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null)

  // Filter stock items based on search and filters
  const filteredStockItems = filterStockItems(stockItems, search, categoryFilter, statusFilter)

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(stockItems.map(item => item.category)))

  // Handle stock item operations
  const handleAddStockItem = () => {
    // This would open a form to add a new stock item
    addToast('info', 'Add stock item functionality would be implemented here')
  }

  const handleEditStockItem = (item: StockItem) => {
    // This would open an edit form
    addToast('info', `Edit ${item.name} functionality would be implemented here`)
  }

  const handleDeleteStockItem = (item: StockItem) => {
    const updatedItems = stockItems.filter(i => i.id !== item.id)
    setStockItems(updatedItems)
    addToast('success', `Stock item "${item.name}" deleted successfully`)
  }

  const handleAddStock = (item: StockItem) => {
    setSelectedStockItem(item)
    setIsAddStockFormOpen(true)
  }

  const handleStockOut = (item: StockItem) => {
    setSelectedStockItem(item)
    setIsStockOutFormOpen(true)
  }

  const handleAddStockSubmit = (data: any) => {
    if (!selectedStockItem) return

    // Update stock item quantity
    const updatedItems = stockItems.map(item =>
      item.id === selectedStockItem.id
        ? { ...item, quantity: item.quantity + data.quantity }
        : item
    )
    setStockItems(updatedItems)

    // Add transaction record
    const newTransaction: StockTransaction = {
      id: generateUniqueId(),
      stockItemId: selectedStockItem.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      type: "Purchase",
      quantity: data.quantity,
      measuringUnit: selectedStockItem.measuringUnit,
      party: data.supplierName,
      stockValue: data.quantity * data.perUnitPrice,
      notes: data.notes
    }
    setStockTransactions([...stockTransactions, newTransaction])

    addToast('success', `Recorded purchase of ${data.quantity} ${selectedStockItem.measuringUnit} for ${selectedStockItem.name}`)
    setIsAddStockFormOpen(false)
    setSelectedStockItem(null)
  }

  const handleStockOutSubmit = (data: any) => {
    if (!selectedStockItem) return

    // Update stock item quantity
    const updatedItems = stockItems.map(item =>
      item.id === selectedStockItem.id
        ? { ...item, quantity: Math.max(0, item.quantity - data.quantity) }
        : item
    )
    setStockItems(updatedItems)

    // Add transaction record
    const newTransaction: StockTransaction = {
      id: generateUniqueId(),
      stockItemId: selectedStockItem.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      type: "Usage",
      quantity: data.quantity,
      measuringUnit: selectedStockItem.measuringUnit,
      party: "Kitchen",
      stockValue: data.quantity * selectedStockItem.price,
      notes: data.notes
    }
    setStockTransactions([...stockTransactions, newTransaction])

    addToast('success', `Recorded usage of ${data.quantity} ${selectedStockItem.measuringUnit} for ${selectedStockItem.name}`)
    setIsStockOutFormOpen(false)
    setSelectedStockItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Stock Items</h2>
          <p className="text-gray-600 mt-1">Manage all ingredients and supplies your restaurant keeps in stock.</p>
        </div>
        <Button
          onClick={handleAddStockItem}
          className="text-white"
          style={{ backgroundColor: '#D8550D' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Stock Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stock items"
            className="pl-10 bg-white border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-white border-gray-200">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* Stock Items Table */}
      {filteredStockItems.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.image} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.measuringUnit}
                  </TableCell>
                  <TableCell>{formatNepaliCurrency(item.price)}</TableCell>
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
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditStockItem(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Stock Item
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddStock(item)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Record Purchase
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStockOut(item)}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Record Usage
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteStockItem(item)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Stock Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <StockItemsEmptyState onAction={handleAddStockItem} />
      )}

      {/* Forms */}
      {isAddStockFormOpen && selectedStockItem && (
        <AddStockForm
          itemName={selectedStockItem.name}
          measuringUnit={selectedStockItem.measuringUnit}
          suppliers={suppliers}
          onClose={() => {
            setIsAddStockFormOpen(false)
            setSelectedStockItem(null)
          }}
          onSubmit={handleAddStockSubmit}
        />
      )}

      {isStockOutFormOpen && selectedStockItem && (
        <StockOutForm
          itemName={selectedStockItem.name}
          measuringUnit={selectedStockItem.measuringUnit}
          currentQuantity={selectedStockItem.quantity}
          onClose={() => {
            setIsStockOutFormOpen(false)
            setSelectedStockItem(null)
          }}
          onSubmit={handleStockOutSubmit}
        />
      )}
    </div>
  )
}
