/**
 * Animation Utilities
 * Reusable animation classes and configurations for consistent UX
 */

// Fade in animations
export const fadeIn = "transition-opacity duration-300 ease-in-out"
export const fadeInUp = "transition-all duration-300 ease-out transform translate-y-0 opacity-100"
export const fadeInDown = "transition-all duration-300 ease-out transform translate-y-0 opacity-100"

// Scale animations
export const scaleIn = "transition-transform duration-200 ease-out transform scale-100"
export const scaleOnHover = "hover:scale-105 transition-transform duration-200 ease-out"

// Slide animations
export const slideInRight = "transition-transform duration-300 ease-out transform translate-x-0"
export const slideInLeft = "transition-transform duration-300 ease-out transform -translate-x-0"

// Button animations
export const buttonHover = "transition-all duration-200 ease-out hover:shadow-lg hover:scale-102"
export const buttonPress = "active:scale-95 transition-transform duration-100"

// Card animations
export const cardHover = "transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1"

// Loading animations
export const pulse = "animate-pulse"
export const spin = "animate-spin"
export const bounce = "animate-bounce"

// Focus animations
export const focusRing = "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-shadow duration-200"

// Smooth color transitions
export const colorTransition = "transition-colors duration-200 ease-out"

// Combined animation classes for common patterns
export const interactiveCard = `${cardHover} ${colorTransition}`
export const interactiveButton = `${buttonHover} ${buttonPress} ${colorTransition} ${focusRing}`
export const smoothFade = `${fadeIn} ${scaleIn}`

// Stagger animations for lists (use with delay classes)
export const staggerDelay = {
  1: "delay-75",
  2: "delay-150",
  3: "delay-225",
  4: "delay-300",
  5: "delay-375",
} as const

// Skeleton loading animation
export const skeletonPulse = "animate-pulse bg-neutral-800"

// Glass morphism with animation
export const glassCard = "backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10"

/**
 * Framer Motion Variants
 * For more complex animations using framer-motion
 */

export const motionVariants = {
  // Container variants (for stagger children)
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  // Item variants (for stagger effect)
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },

  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Scale in/out
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },

  // Slide from bottom
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },

  // Slide from right
  slideRight: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
}

/**
 * Transition configurations
 */

export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  smooth: { type: "tween", ease: "easeOut" },
}
