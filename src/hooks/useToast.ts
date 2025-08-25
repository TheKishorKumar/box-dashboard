import { useState, useCallback } from 'react'
import { Toast } from '@/types'

/**
 * Custom hook for managing toast notifications
 * DESIGN PATTERN: Centralized user feedback system
 * - Provides consistent toast notifications across the app
 * - Auto-dismiss functionality
 * - Support for different toast types (success, error, warning)
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((type: Toast['type'], message: string, action?: Toast['action']) => {
    const newToast: Toast = {
      id: Date.now() + Math.random(),
      type,
      message,
      action
    }

    setToasts(prev => [...prev, newToast])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeToast(newToast.id)
    }, 5000)
  }, [removeToast])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  }
}
