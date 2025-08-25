/**
 * Utility functions for the restaurant inventory management system
 * DESIGN PATTERN: Centralized helper functions
 * - Reduces code duplication
 * - Provides consistent behavior across components
 * - Easy to test and maintain
 */

/**
 * Generate unique ID for new items
 * DESIGN PATTERN: Consistent ID generation
 * - Uses timestamp + random number for uniqueness
 * - Used across all entity types (stock items, suppliers, etc.)
 */
export function generateUniqueId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}

/**
 * Filter stock items based on search and filter criteria
 * DESIGN PATTERN: Centralized filtering logic
 * - Handles search across multiple fields
 * - Supports category and status filtering
 * - Case-insensitive search
 */
export function filterStockItems(
  items: any[],
  search: string,
  categoryFilter: string,
  statusFilter: string
) {
  return items.filter(item => {
    // Search filter - check name, description, and category
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    
    // Status filter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })
}

/**
 * Filter suppliers based on search criteria
 * DESIGN PATTERN: Centralized supplier filtering
 * - Searches across legal name, contact person, email, and phone
 * - Case-insensitive search
 */
export function filterSuppliers(suppliers: any[], search: string) {
  return suppliers.filter(supplier =>
    supplier.legalName.toLowerCase().includes(search.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    supplier.email.toLowerCase().includes(search.toLowerCase()) ||
    supplier.phoneNumber.includes(search)
  )
}

/**
 * Get stock item status based on quantity and reorder level
 * DESIGN PATTERN: Centralized status calculation
 * - Determines status: Available, Low Quantity, or Out of Stock
 * - Used consistently across the application
 */
export function getStockItemStatus(quantity: number, reorderLevel: number): string {
  if (quantity === 0) {
    return "Out of Stock"
  } else if (quantity <= reorderLevel) {
    return "Low Quantity"
  } else {
    return "Available"
  }
}

/**
 * Format date for display
 * DESIGN PATTERN: Consistent date formatting
 * - Used across transaction history and activity logs
 * - Provides user-friendly date display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format time for display
 * DESIGN PATTERN: Consistent time formatting
 * - Used in transaction timestamps
 * - Provides user-friendly time display
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
