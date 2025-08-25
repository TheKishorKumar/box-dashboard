"use client"

import { ReactNode } from "react"

interface MainContentProps {
  children: ReactNode
}

/**
 * Main Content Layout Component
 * DESIGN PATTERN: Responsive main content area with sidebar offset
 * - Automatically adjusts to sidebar state
 * - Provides consistent padding and layout
 * - Handles responsive behavior
 */
export function MainContent({ children }: MainContentProps) {
  // Get sidebar state from localStorage (this would ideally be from a context)
  const isSidebarCollapsed = typeof window !== 'undefined' 
    ? localStorage.getItem('sidebarCollapsed') === 'true'
    : false

  return (
    <div
      className={`flex-1 flex flex-col ${
        isSidebarCollapsed ? "ml-16" : "ml-64"
      } transition-all duration-300 ease-in-out`}
    >
      <main className="flex-1 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
