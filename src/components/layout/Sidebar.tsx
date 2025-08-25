"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

/**
 * Sidebar Navigation Component
 * DESIGN PATTERN: Collapsible sidebar with localStorage persistence
 * - Maintains sidebar state across page refreshes
 * - Smooth transitions for expand/collapse
 * - Responsive design for mobile/desktop
 */
export function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      return savedSidebarState ? JSON.parse(savedSidebarState) : false
    }
    return false
  })

  // Save sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed))
    }
  }, [isSidebarCollapsed])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Package, label: "Menu manager", href: "/menu" },
    { icon: FileText, label: "Inventory", href: "/inventory" },
    { icon: Square, label: "Areas and Tables", href: "/areas" },
    { icon: Users, label: "Members", href: "/members" },
    { icon: Clock, label: "Order history", href: "/orders" },
    { icon: TrendingUp, label: "Sales", href: "/sales" },
    { icon: Activity, label: "Activity", href: "/activity" },
    { icon: Settings, label: "Profile and settings", href: "/settings" },
  ]

  return (
    <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-10 transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-gray-900">Box</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.href === "/" 
                    ? "bg-orange-50 text-orange-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">U</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">User Name</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
