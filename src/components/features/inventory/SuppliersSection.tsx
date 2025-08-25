"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { SuppliersEmptyState } from "@/components/suppliers-empty-state"
import { Supplier } from "@/types"
import { filterSuppliers } from "@/utils/helpers"

interface SuppliersSectionProps {
  suppliers: Supplier[]
  setSuppliers: (suppliers: Supplier[]) => void
  addToast: (type: 'success' | 'error' | 'warning', message: string) => void
}

/**
 * Suppliers Section Component
 * DESIGN PATTERN: Feature-specific component with focused responsibility
 * - Handles all supplier related operations
 * - Manages search and CRUD operations
 * - Provides consistent UI patterns for data display
 */
export function SuppliersSection({
  suppliers,
  setSuppliers,
  addToast
}: SuppliersSectionProps) {
  const [search, setSearch] = useState("")

  // Filter suppliers based on search
  const filteredSuppliers = filterSuppliers(suppliers, search)

  const handleAddSupplier = () => {
    addToast('info', 'Add supplier functionality would be implemented here')
  }

  const handleEditSupplier = (supplier: Supplier) => {
    addToast('info', `Edit ${supplier.legalName} functionality would be implemented here`)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== supplier.id)
    setSuppliers(updatedSuppliers)
    addToast('success', `Supplier "${supplier.legalName}" deleted successfully`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Suppliers</h2>
          <p className="text-gray-600 mt-1">Manage your suppliers and their contact information.</p>
        </div>
        <Button
          onClick={handleAddSupplier}
          className="text-white"
          style={{ backgroundColor: '#D8550D' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Supplier
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search suppliers"
            className="pl-10 bg-white border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Table */}
      {filteredSuppliers.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{supplier.legalName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{supplier.legalName}</div>
                        <div className="text-sm text-gray-500">{supplier.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.phoneNumber}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.createdAt}</TableCell>
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
                          Edit Supplier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Supplier
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
        <SuppliersEmptyState onAction={handleAddSupplier} />
      )}
    </div>
  )
}
