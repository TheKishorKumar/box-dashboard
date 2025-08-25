"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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
}

export function SelectInput({ 
  value, 
  onChange, 
  placeholder = "Search or select option", 
  required = false,
  className = "",
  options = [],
  onOpenNestedForm,
  nestedFormLabel = "Create new option",
  showNestedFormButton = false
}: SelectInputProps) {
  const [searchText, setSearchText] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchText.toLowerCase()))
  )

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.select-dropdown')) {
        setIsDropdownOpen(false)
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
          setIsDropdownOpen(false)
        }
        break
      case 'Escape':
        setIsDropdownOpen(false)
        break
    }
  }

  return (
    <div className={`relative select-dropdown ${className}`}>
      <Input
        placeholder={placeholder}
        value={isDropdownOpen ? searchText : (value || "")}
        onChange={(e) => {
          setSearchText(e.target.value)
          if (!isDropdownOpen) setIsDropdownOpen(true)
        }}
        onFocus={() => {
          setSearchText("")
          setIsDropdownOpen(true)
        }}
        onKeyDown={handleKeyDown}
        className="w-full"
        required={required}
      />
      
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {/* Options List - Fixed height for 5 items */}
          <div className="max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-button]:hidden">
            {filteredOptions.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.label)
                  setSearchText("")
                  setIsDropdownOpen(false)
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between ${
                  index === focusedIndex ? 'bg-gray-100' : ''
                }`}
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-500">{option.description}</div>
                  )}
                </div>
                {value === option.label && (
                  <div className="text-[#D8550D]">
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
              <div className="border-t border-gray-200"></div>
              
              {/* Create New Option */}
              <div className="p-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    onOpenNestedForm()
                  }}
                  className="w-full h-8 text-sm justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
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
