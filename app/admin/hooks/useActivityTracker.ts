import { useState, useEffect } from "react"
import { ActivityItem } from "../types"
import { initialActivity } from "../lib/constants"

export function useActivityTracker() {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(initialActivity)

  // Load activity from localStorage on mount
  useEffect(() => {
    const savedActivity = localStorage.getItem("activity")
    if (savedActivity) {
      try {
        const parsed = JSON.parse(savedActivity)
        if (Array.isArray(parsed)) {
          setActivityItems(parsed)
        } else {
          setActivityItems([])
        }
      } catch (error) {
        console.error("Failed to parse saved activity:", error)
        setActivityItems([])
      }
    }
  }, [])

  const addActivity = (section: string) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      name: `${section} Content`,
      status: "Updated",
      change: `+${(Math.random() * 3 + 0.5).toFixed(1)}%`,
      icon: getIconForSection(section),
      time: "Just now",
      timestamp: Date.now(),
    }

    const updatedActivity = [newActivity, ...activityItems.slice(0, 9)]
    setActivityItems(updatedActivity)
    localStorage.setItem("activity", JSON.stringify(updatedActivity))
  }

  const resetActivity = () => {
    localStorage.removeItem("activity")
    setActivityItems(initialActivity)
  }

  return {
    activityItems,
    setActivityItems,
    addActivity,
    resetActivity,
  }
}

function getIconForSection(section: string): string {
  const icons: Record<string, string> = {
    home: "🏠",
    pricing: "💰",
    content: "📝",
    settings: "⚙️",
    orders: "📦",
    analytics: "📊",
  }
  return icons[section.toLowerCase()] || "📄"
}
