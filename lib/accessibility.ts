/**
 * Accessibility Utilities
 * ARIA labels, roles, and a11y helpers for better accessibility
 */

/**
 * Screen reader only text utility
 * Visually hidden but accessible to screen readers
 */
export const srOnly = "sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"

/**
 * Focus visible utility
 * Better focus indicators for keyboard navigation
 */
export const focusVisible =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"

/**
 * Common ARIA labels for buttons and links
 */
export const ariaLabels = {
  // Navigation
  mainNav: "Main navigation",
  skipToContent: "Skip to main content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  backToTop: "Back to top",

  // Forms
  submitForm: "Submit form",
  resetForm: "Reset form",
  clearInput: "Clear input",
  search: "Search",
  togglePassword: "Toggle password visibility",

  // Admin
  saveChanges: "Save changes",
  cancelEdit: "Cancel editing",
  deleteItem: "Delete item",
  editItem: "Edit item",

  // Social/Sharing
  shareOnTwitter: "Share on Twitter",
  shareOnLinkedIn: "Share on LinkedIn",
  shareOnFacebook: "Share on Facebook",
  copyLink: "Copy link to clipboard",

  // Media
  playVideo: "Play video",
  pauseVideo: "Pause video",
  closeModal: "Close modal",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
}

/**
 * Get button aria-label with loading state
 */
export function getButtonAriaLabel(label: string, isLoading: boolean) {
  return isLoading ? `${label} - Loading` : label
}

/**
 * Get input aria attributes
 */
export function getInputAriaAttributes(id: string, label: string, error?: string, required = false) {
  return {
    id,
    "aria-label": label,
    "aria-required": required,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  }
}

/**
 * Get error message aria attributes
 */
export function getErrorAriaAttributes(inputId: string) {
  return {
    id: `${inputId}-error`,
    role: "alert",
    "aria-live": "polite" as const,
  }
}

/**
 * Get modal/dialog aria attributes
 */
export function getDialogAriaAttributes(title: string, describedBy?: string) {
  return {
    role: "dialog",
    "aria-modal": true,
    "aria-labelledby": `${title}-title`,
    "aria-describedby": describedBy,
  }
}

/**
 * Get tooltip aria attributes
 */
export function getTooltipAriaAttributes(id: string) {
  return {
    role: "tooltip",
    id: `${id}-tooltip`,
  }
}

/**
 * Get live region aria attributes for dynamic content
 */
export function getLiveRegionAttributes(priority: "polite" | "assertive" = "polite") {
  return {
    "aria-live": priority,
    "aria-atomic": true,
  }
}

/**
 * Get list aria attributes
 */
export function getListAriaAttributes(label: string) {
  return {
    role: "list",
    "aria-label": label,
  }
}

/**
 * Get listitem aria attributes
 */
export function getListItemAriaAttributes(index: number, total: number) {
  return {
    role: "listitem",
    "aria-posinset": index + 1,
    "aria-setsize": total,
  }
}

/**
 * Get tablist aria attributes
 */
export function getTabListAriaAttributes(label: string) {
  return {
    role: "tablist",
    "aria-label": label,
  }
}

/**
 * Get tab aria attributes
 */
export function getTabAriaAttributes(id: string, isSelected: boolean, controls: string) {
  return {
    role: "tab",
    id,
    "aria-selected": isSelected,
    "aria-controls": controls,
    tabIndex: isSelected ? 0 : -1,
  }
}

/**
 * Get tabpanel aria attributes
 */
export function getTabPanelAriaAttributes(id: string, labelledBy: string) {
  return {
    role: "tabpanel",
    id,
    "aria-labelledby": labelledBy,
    tabIndex: 0,
  }
}

/**
 * Get progress bar aria attributes
 */
export function getProgressAriaAttributes(value: number, max = 100, label?: string) {
  return {
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-label": label,
  }
}

/**
 * Get alert aria attributes
 */
export function getAlertAriaAttributes(type: "error" | "warning" | "info" | "success") {
  const ariaLive: "assertive" | "polite" =
    type === "error" || type === "warning" ? "assertive" : "polite"

  return {
    role: "alert" as const,
    "aria-live": ariaLive,
  }
}

/**
 * Keyboard navigation helpers
 */
export const keyboardKeys = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  HOME: "Home",
  END: "End",
}

/**
 * Check if event key matches
 */
export function isKeyPressed(event: React.KeyboardEvent, key: string | string[]) {
  const keys = Array.isArray(key) ? key : [key]
  return keys.includes(event.key)
}

/**
 * Handle keyboard navigation
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  options: {
    onEnter?: () => void
    onSpace?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
  },
) {
  if (isKeyPressed(event, keyboardKeys.ENTER)) {
    options.onEnter?.()
  } else if (isKeyPressed(event, keyboardKeys.SPACE)) {
    event.preventDefault() // Prevent page scroll
    options.onSpace?.()
  } else if (isKeyPressed(event, keyboardKeys.ESCAPE)) {
    options.onEscape?.()
  } else if (isKeyPressed(event, keyboardKeys.ARROW_UP)) {
    event.preventDefault()
    options.onArrowUp?.()
  } else if (isKeyPressed(event, keyboardKeys.ARROW_DOWN)) {
    event.preventDefault()
    options.onArrowDown?.()
  } else if (isKeyPressed(event, keyboardKeys.ARROW_LEFT)) {
    options.onArrowLeft?.()
  } else if (isKeyPressed(event, keyboardKeys.ARROW_RIGHT)) {
    options.onArrowRight?.()
  }
}
