"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "./components/AdminLayout"
import { HomePage } from "./components/HomePage"
import { ContentPage } from "./components/ContentPage"
import { AnalyticsPage } from "./components/AnalyticsPage"
import { HelpPage } from "./components/HelpPage"
import { useContentStorage } from "./hooks/useContentStorage"
import { useActivityTracker } from "./hooks/useActivityTracker"
import { formatTimeAgo } from "./lib/utils"
import { initialAnalyticsData } from "./lib/constants"
import { ContentData } from "./types"

export default function AdminDashboardRefactored() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState("home")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [activityPage, setActivityPage] = useState(0)
  const [analyticsData] = useState(initialAnalyticsData)
  const [notifications, setNotifications] = useState(3)

  const router = useRouter()
  const { content, setContent, hasChanges, saveContent, resetContent } = useContentStorage()
  const { activityItems, setActivityItems, addActivity, resetActivity } = useActivityTracker()

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("admin-session="))

      if (sessionCookie && sessionCookie.includes("authenticated")) {
        setIsAuthenticated(true)
      } else {
        router.push("/admin/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Update activity times
  useEffect(() => {
    const updateTimes = () => {
      setActivityItems((prev) =>
        prev.map((item) => ({
          ...item,
          time: formatTimeAgo(item.timestamp),
        })),
      )
    }

    updateTimes()
    const interval = setInterval(updateTimes, 60000)
    return () => clearInterval(interval)
  }, [setActivityItems])

  const handleContentChange = (section: keyof ContentData, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = await saveContent()

    if (success) {
      const section = selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)
      addActivity(section)
      setSaveMessage("Changes saved successfully!")
    } else {
      setSaveMessage("Error saving changes. Please try again.")
    }

    setTimeout(() => setSaveMessage(""), 3000)
    setIsSaving(false)
  }

  const handlePreview = () => {
    window.open("/", "_blank")
  }

  const navigateActivity = (direction: "prev" | "next") => {
    if (direction === "prev" && activityPage > 0) {
      setActivityPage((prev) => prev - 1)
    } else if (direction === "next" && (activityPage + 1) * 4 < activityItems.length) {
      setActivityPage((prev) => prev + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const renderPage = () => {
    switch (selectedPage) {
      case "home":
        return (
          <HomePage
            activityItems={activityItems}
            activityPage={activityPage}
            onNavigateActivity={navigateActivity}
            onNavigateTo={setSelectedPage}
            onPreview={handlePreview}
          />
        )
      case "content":
        return (
          <ContentPage
            content={content}
            hasChanges={hasChanges}
            isSaving={isSaving}
            saveMessage={saveMessage}
            onContentChange={handleContentChange}
            onSave={handleSave}
            onPreview={handlePreview}
          />
        )
      case "analytics":
        return <AnalyticsPage analyticsData={analyticsData} />
      case "help":
        return <HelpPage />
      default:
        return (
          <div className="text-white text-center py-12">
            <h2 className="text-2xl font-bold mb-4">{selectedPage} Page</h2>
            <p className="text-neutral-400">
              This page component needs to be extracted from the original admin/page.tsx
            </p>
            <p className="text-neutral-400 text-sm mt-2">
              See app/admin/components/ for examples of how to structure page components
            </p>
          </div>
        )
    }
  }

  return (
    <AdminLayout
      selectedPage={selectedPage}
      onPageChange={setSelectedPage}
      notifications={notifications}
    >
      {renderPage()}
    </AdminLayout>
  )
}
