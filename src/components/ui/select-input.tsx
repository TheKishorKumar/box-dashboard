"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Global state to track which dropdown is open
let openDropdownId: string | null = null
const dropdownCallbacks = new Map<string, () => void>()

interface SelectOption {
  id: number | string
  label: string
  description?: string
}

interface SelectInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  options: SelectOption[]
  onOpenNestedForm?: () => void
  nestedFormLabel?: string
  showNestedFormButton?: boolean
  variant?: "default" | "select-like"
  showDescriptions?: boolean
}

export function SelectInput({ 
  value, 
  onChange, 
  placeholder = "Select option", 
  required = false,
  className = "",
  options = [],
  onOpenNestedForm,
  nestedFormLabel = "Create new option",
  showNestedFormButton = false,
  variant = "select-like",
  showDescriptions = true
}: SelectInputProps) {
  const [searchText, setSearchText] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownId = useRef(`dropdown-${Math.random().toString(36).substr(2, 9)}`)

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchText.toLowerCase()))
  )

  // Function to close this dropdown
  const closeDropdown = () => {
    setIsDropdownOpen(false)
    if (openDropdownId === dropdownId.current) {
      openDropdownId = null
    }
  }

  // Function to open this dropdown
  const openDropdown = () => {
    // Close any other open dropdown
    if (openDropdownId && openDropdownId !== dropdownId.current) {
      const closeCallback = dropdownCallbacks.get(openDropdownId)
      if (closeCallback) {
        closeCallback()
      }
    }
    
    setIsDropdownOpen(true)
    openDropdownId = dropdownId.current
  }

  // Register this dropdown's close callback
  useEffect(() => {
    dropdownCallbacks.set(dropdownId.current, closeDropdown)
    return () => {
      dropdownCallbacks.delete(dropdownId.current)
    }
  }, [])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!dropdownRef.current?.contains(target)) {
        closeDropdown()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Reset focused index when dropdown opens or search changes
  useEffect(() => {
    setFocusedIndex(0)
  }, [isDropdownOpen, searchText])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions.length > 0) {
          const selectedOption = filteredOptions[focusedIndex]
          onChange(selectedOption.label)
          setSearchText("")
          closeDropdown()
        }
        break
      case 'Escape':
        closeDropdown()
        break
    }
  }

  return (
    <div ref={dropdownRef} className={`relative select-dropdown ${className}`}>
      <Input
        placeholder={placeholder}
        value={isDropdownOpen ? searchText : (value || "")}
        onChange={(e) => {
          setSearchText(e.target.value)
          if (!isDropdownOpen) openDropdown()
        }}
        onFocus={() => {
          setSearchText("")
          openDropdown()
        }}
        onKeyDown={handleKeyDown}
        className={`w-full ${variant === "select-like" ? "border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]" : ""}`}
        required={required}
      />
      {variant === "select-like" && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
      
      {isDropdownOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 z-50 ${
          variant === "select-like" 
            ? "bg-popover text-popover-foreground rounded-md border shadow-md" 
            : "bg-white border border-gray-300 rounded-md shadow-lg"
        }`}>
          {/* Options List - Fixed height for 5 items */}
          <div className="max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-button]:hidden">
            {filteredOptions.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.label)
                  setSearchText("")
                  closeDropdown()
                }}
                className={`w-full text-left focus:outline-none flex items-center justify-between ${
                  variant === "select-like"
                    ? `px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground rounded-sm ${
                        index === focusedIndex ? 'bg-accent text-accent-foreground' : ''
                      }`
                    : `px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 ${
                        index === focusedIndex ? 'bg-gray-100' : ''
                      }`
                }`}
              >
                                 <div className="flex-1">
                   <div className={variant === "select-like" ? "" : "font-medium"}>{option.label}</div>
                   {showDescriptions && option.description && (
                     <div className={`text-sm ${
                       variant === "select-like" ? "text-muted-foreground" : "text-gray-500"
                     }`}>
                       {option.description}
                     </div>
                   )}
                 </div>
                {value === option.label && (
                  <div className={`${
                    variant === "select-like" ? "text-accent-foreground" : "text-[#D8550D]"
                  }`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Create New Option Button */}
          {showNestedFormButton && onOpenNestedForm && (
            <>
              {/* Separator */}
              <div className={`border-t ${
                variant === "select-like" ? "border-border" : "border-gray-200"
              }`}></div>
              
              {/* Create New Option */}
              <div className="p-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    closeDropdown()
                    onOpenNestedForm()
                  }}
                  className={`w-full h-8 text-sm justify-start ${
                    variant === "select-like" 
                      ? "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {nestedFormLabel}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
