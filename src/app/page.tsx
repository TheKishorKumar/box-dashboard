"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { MainContent } from "@/components/layout/MainContent"
import { InventoryDashboard } from "@/components/features/inventory/InventoryDashboard"

/**
 * Main Dashboard Page
 * DESIGN PATTERN: Minimal page component with layout composition
 * - Delegates functionality to specialized components
 * - Maintains clean separation of concerns
 * - Easy to understand and maintain
 */
export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <InventoryDashboard />
      </MainContent>
    </div>
  )
}
