"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockItemsSection } from "./StockItemsSection"
import { SuppliersSection } from "./SuppliersSection"
import { MeasuringUnitsSection } from "./MeasuringUnitsSection"
import { StockGroupsSection } from "./StockGroupsSection"
import { ActivityLogsSection } from "./ActivityLogsSection"
import { SettingsSection } from "./SettingsSection"
import { useLocalStorage, useHydration } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/useToast"
import { StockItem, Supplier, MeasuringUnit, StockGroup, StockTransaction } from "@/types"

/**
 * Inventory Dashboard Component
 * DESIGN PATTERN: Main dashboard container with tab navigation
 * - Organizes related functionality into logical tabs
 * - Manages shared state across inventory features
 * - Provides consistent layout and navigation
 */
export function InventoryDashboard() {
  const isHydrated = useHydration()
  const { toasts, addToast, removeToast } = useToast()

  // State management using custom hooks
  const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('stockItems', [])
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('suppliers', [])
  const [measuringUnits, setMeasuringUnits] = useLocalStorage<MeasuringUnit[]>('measuringUnits', [])
  const [stockGroups, setStockGroups] = useLocalStorage<StockGroup[]>('stockGroups', [])
  const [stockTransactions, setStockTransactions] = useLocalStorage<StockTransaction[]>('stockTransactions', [])

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

  // Don't render until hydrated to prevent SSR/client mismatch
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant inventory, suppliers, and transactions</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="stock-items" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="px-6">
            <TabsList className="flex justify-start bg-white h-auto p-0 border-b-0 shadow-none">
              <TabsTrigger
                value="stock-items"
                className="tabs-trigger relative px-3 py-3 text-sm font-medium"
              >
                Stock Items
              </TabsTrigger>
              <TabsTrigger
                value="suppliers"
                className="tabs-trigger relative px-3 py-3 text-sm font-medium"
              >
                Suppliers
              </TabsTrigger>
              <TabsTrigger
                value="measuring-units"
                className="tabs-trigger relative px-3 py-3 text-sm font-medium"
              >
                Measuring Units
              </TabsTrigger>
              <TabsTrigger
                value="stock-groups"
                className="tabs-trigger relative px-3 py-3 text-sm font-medium"
              >
                Stock Groups
              </TabsTrigger>
              <TabsTrigger
                value="activity-logs"
                className="tabs-trigger relative px-3 py-3 text-sm font-medium"
              >
                Activity Logs
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="tabs-trigger relative px-3 py-3 text-sm font-medium"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <TabsContent value="stock-items" className="space-y-6 p-6">
            <StockItemsSection 
              stockItems={stockItems}
              setStockItems={setStockItems}
              suppliers={suppliers}
              measuringUnits={measuringUnits}
              stockGroups={stockGroups}
              stockTransactions={stockTransactions}
              setStockTransactions={setStockTransactions}
              addToast={addToast}
            />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6 p-6">
            <SuppliersSection 
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              addToast={addToast}
            />
          </TabsContent>

          <TabsContent value="measuring-units" className="space-y-6 p-6">
            <MeasuringUnitsSection 
              measuringUnits={measuringUnits}
              setMeasuringUnits={setMeasuringUnits}
              addToast={addToast}
            />
          </TabsContent>

          <TabsContent value="stock-groups" className="space-y-6 p-6">
            <StockGroupsSection 
              stockGroups={stockGroups}
              setStockGroups={setStockGroups}
              addToast={addToast}
            />
          </TabsContent>

          <TabsContent value="activity-logs" className="space-y-6 p-6">
            <ActivityLogsSection 
              stockTransactions={stockTransactions}
              stockItems={stockItems}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 p-6">
            <SettingsSection 
              stockItems={stockItems}
              setStockItems={setStockItems}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              measuringUnits={measuringUnits}
              setMeasuringUnits={setMeasuringUnits}
              stockGroups={stockGroups}
              setStockGroups={setStockGroups}
              stockTransactions={stockTransactions}
              setStockTransactions={setStockTransactions}
              addToast={addToast}
            />
          </TabsContent>
        </div>
      </Tabs>

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
