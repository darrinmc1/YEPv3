"use client"

import { useState } from "react"

/**
 * Test component for error boundary
 * This component intentionally throws an error when the button is clicked
 * Use only for testing error boundary functionality
 */
export function ErrorBoundaryTest() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error("Test error from ErrorBoundaryTest component!")
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-red-600/90 backdrop-blur-sm rounded-lg shadow-lg">
      <p className="text-white text-sm mb-2 font-medium">Error Boundary Test</p>
      <button
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-white text-red-600 rounded hover:bg-neutral-100 transition-colors text-sm font-medium"
      >
        Trigger Test Error
      </button>
      <p className="text-white text-xs mt-2 opacity-80">
        Click to test error boundary
      </p>
    </div>
  )
}
