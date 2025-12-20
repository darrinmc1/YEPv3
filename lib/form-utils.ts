/**
 * Form Utilities
 * Auto-save, recovery, validation, and character counting for forms
 */

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "./performance"

/**
 * Auto-save form data to localStorage with debouncing
 *
 * @example
 * const { saveForm, loadForm, clearForm, hasUnsavedChanges } = useFormAutoSave('my-form', initialData)
 */
export function useFormAutoSave<T extends Record<string, any>>(
  storageKey: string,
  initialData: T,
  debounceMs = 1000
) {
  const [formData, setFormData] = useState<T>(initialData)
  const [originalData, setOriginalData] = useState<T>(initialData)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const debouncedFormData = useDebounce(formData, debounceMs)

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed.data)
        setOriginalData(parsed.data)
        setLastSaved(parsed.timestamp ? new Date(parsed.timestamp) : null)
      } catch (error) {
        console.error("Failed to load saved form data:", error)
      }
    }
  }, [storageKey])

  // Auto-save when data changes (debounced)
  useEffect(() => {
    if (debouncedFormData !== originalData) {
      const dataToSave = {
        data: debouncedFormData,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      setLastSaved(new Date())
    }
  }, [debouncedFormData, storageKey, originalData])

  const saveForm = useCallback(() => {
    const dataToSave = {
      data: formData,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    setOriginalData(formData)
    setLastSaved(new Date())
  }, [formData, storageKey])

  const loadForm = useCallback(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed.data)
        setOriginalData(parsed.data)
        setLastSaved(parsed.timestamp ? new Date(parsed.timestamp) : null)
        return parsed.data
      } catch (error) {
        console.error("Failed to load form data:", error)
        return null
      }
    }
    return null
  }, [storageKey])

  const clearForm = useCallback(() => {
    localStorage.removeItem(storageKey)
    setFormData(initialData)
    setOriginalData(initialData)
    setLastSaved(null)
  }, [storageKey, initialData])

  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

  const hasSavedData = useCallback(() => {
    return localStorage.getItem(storageKey) !== null
  }, [storageKey])

  return {
    formData,
    setFormData,
    saveForm,
    loadForm,
    clearForm,
    hasUnsavedChanges,
    hasSavedData,
    lastSaved,
  }
}

/**
 * Character counter with validation
 *
 * @example
 * const counter = useCharacterCounter(value, { min: 10, max: 100 })
 */
export function useCharacterCounter(
  value: string,
  options: { min?: number; max?: number } = {}
) {
  const { min = 0, max = Infinity } = options
  const count = value.length
  const remaining = max - count
  const isValid = count >= min && count <= max
  const isAtMin = count >= min
  const isNearMax = max !== Infinity && remaining <= 20
  const isAtMax = count >= max

  const getMessage = () => {
    if (count < min) {
      return `${min - count} more character${min - count === 1 ? "" : "s"} required`
    }
    if (remaining <= 0) {
      return `Character limit reached`
    }
    if (isNearMax) {
      return `${remaining} character${remaining === 1 ? "" : "s"} remaining`
    }
    return `${count}/${max === Infinity ? "∞" : max}`
  }

  const getColor = () => {
    if (!isAtMin) return "text-red-500"
    if (isAtMax) return "text-red-500"
    if (isNearMax) return "text-orange-400"
    return "text-neutral-400"
  }

  return {
    count,
    remaining,
    isValid,
    isAtMin,
    isNearMax,
    isAtMax,
    message: getMessage(),
    color: getColor(),
    percentage: max !== Infinity ? (count / max) * 100 : 0,
  }
}

/**
 * Debounced field validation
 *
 * @example
 * const { error, isValidating, validate } = useFieldValidation(
 *   value,
 *   (val) => val.length >= 10 ? null : "Too short"
 * )
 */
export function useFieldValidation<T>(
  value: T,
  validator: (value: T) => string | null,
  debounceMs = 500
) {
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const debouncedValue = useDebounce(value, debounceMs)

  useEffect(() => {
    setIsValidating(true)
    const errorMessage = validator(debouncedValue)
    setError(errorMessage)
    setIsValidating(false)
  }, [debouncedValue, validator])

  const validate = useCallback(() => {
    const errorMessage = validator(value)
    setError(errorMessage)
    return errorMessage === null
  }, [value, validator])

  return {
    error,
    isValidating,
    validate,
    isValid: error === null,
  }
}

/**
 * Email validation helper
 */
export function validateEmail(email: string): string | null {
  if (!email) return "Email is required"

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }

  // Additional checks
  if (email.length > 254) {
    return "Email is too long"
  }

  const [localPart, domain] = email.split("@")
  if (localPart.length > 64) {
    return "Email local part is too long"
  }

  return null
}

/**
 * Rate limit countdown timer
 *
 * @example
 * const { timeRemaining, isActive, formatTime } = useRateLimitTimer(resetTime)
 */
export function useRateLimitTimer(resetTimeISO?: string) {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (!resetTimeISO) {
      setTimeRemaining(0)
      return
    }

    const updateTimer = () => {
      const now = Date.now()
      const resetTime = new Date(resetTimeISO).getTime()
      const remaining = Math.max(0, Math.floor((resetTime - now) / 1000))
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [resetTimeISO])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  return {
    timeRemaining,
    isActive: timeRemaining > 0,
    formatTime: () => formatTime(timeRemaining),
    percentage: resetTimeISO
      ? Math.max(0, Math.min(100, (timeRemaining / 86400) * 100))
      : 0,
  }
}

/**
 * Form progress calculator
 */
export function calculateFormProgress<T extends Record<string, any>>(
  formData: T,
  requiredFields: (keyof T)[]
): number {
  const filledFields = requiredFields.filter((field) => {
    const value = formData[field]
    if (typeof value === "string") return value.trim().length > 0
    if (typeof value === "number") return true
    if (typeof value === "boolean") return true
    return !!value
  })

  return Math.round((filledFields.length / requiredFields.length) * 100)
}

/**
 * Prevent navigation with unsaved changes
 */
export function useBeforeUnload(hasUnsavedChanges: boolean, message?: string) {
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message || "You have unsaved changes. Are you sure you want to leave?"
      return e.returnValue
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges, message])
}
