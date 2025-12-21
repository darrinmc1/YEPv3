/**
 * Performance Optimization Utilities
 * Helpers for React.memo, useMemo, useCallback, and performance best practices
 */

import { useCallback, useMemo, useRef, useEffect } from "react"

/**
 * Debounce hook for expensive operations
 * Usage: const debouncedValue = useDebounce(value, 500)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook to limit function calls
 * Usage: const throttledFn = useThrottle(fn, 1000)
 */
export function useThrottle<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const lastRan = useRef(Date.now())

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastRan.current >= delay) {
        fn(...args)
        lastRan.current = now
      }
    },
    [fn, delay],
  )
}

/**
 * Previous value hook
 * Usage: const previousValue = usePrevious(value)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Intersection Observer hook for lazy loading
 * Usage: const ref = useIntersectionObserver(() => loadMore(), { threshold: 0.5 })
 */
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {},
) {
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback()
      }
    }, options)

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return targetRef
}

/**
 * Media query hook
 * Usage: const isMobile = useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

/**
 * Memoization helper with custom comparison
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string,
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Lazy load images
 */
export function lazyLoadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Performance monitoring
 */
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
}

/**
 * Async function with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError = new Error("Operation timed out"),
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(timeoutError), timeoutMs)),
  ])
}

/**
 * Batch updates to reduce re-renders
 */
export function batchUpdate<T>(updates: Array<() => void>) {
  // React 18 automatically batches updates
  // This is a placeholder for any custom batching logic
  updates.forEach((update) => update())
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "webp" | "avif" | "jpeg"
  } = {},
): string {
  // If using Next.js Image component, this is handled automatically
  // This is a placeholder for custom image optimization logic
  const params = new URLSearchParams()

  if (options.width) params.append("w", options.width.toString())
  if (options.height) params.append("h", options.height.toString())
  if (options.quality) params.append("q", options.quality.toString())
  if (options.format) params.append("f", options.format)

  return params.toString() ? `${url}?${params.toString()}` : url
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  const link = document.createElement("link")
  link.rel = "preload"
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

/**
 * Virtual scrolling helper
 * Calculate visible items for large lists
 */
export function calculateVisibleRange(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan = 3,
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const end = Math.min(totalItems, start + visibleCount + overscan * 2)

  return { start, end }
}

/**
 * React.memo comparison functions
 */

// Shallow comparison
export function shallowEqual<T extends Record<string, any>>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) return true

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false
    }
  }

  return true
}

// Deep comparison (use sparingly)
export function deepEqual(objA: any, objB: any): boolean {
  return JSON.stringify(objA) === JSON.stringify(objB)
}

/**
 * useState import needed for useDebounce
 */
import { useState } from "react"
