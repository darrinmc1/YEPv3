"use client"

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  Menu,
  X,
  FileText,
  DollarSign,
  Package,
  BarChart3,
  HelpCircle,
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
  selectedPage: string
  onPageChange: (page: string) => void
  notifications?: number
}

const sidebarItems = [
  { id: "home", name: "Home", icon: Home },
  { id: "content", name: "Content", icon: FileText },
  { id: "pricing", name: "Pricing", icon: DollarSign },
  { id: "orders", name: "Orders", icon: Package },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "settings", name: "Settings", icon: Settings },
  { id: "help", name: "Help", icon: HelpCircle },
]

export function AdminLayout({ children, selectedPage, onPageChange, notifications = 0 }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const sections = ["home", "content", "pricing", "analytics", "settings", "help"]
      const found = sections.find((section) => section.toLowerCase().includes(searchQuery.toLowerCase()))
      if (found) {
        onPageChange(found)
        setSearchQuery("")
      }
    }
  }

  const clearNotifications = () => {
    // Notifications cleared
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#0f0f0f] border-r border-neutral-800">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">YEP</span>
                </div>
                <span className="text-xl font-semibold">YourExitPlans</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">MENU</p>
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      selectedPage === item.id
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-neutral-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:flex w-64 bg-[#0f0f0f] border-r border-neutral-800 flex-col fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">YEP</span>
            </div>
            <span className="text-xl font-semibold">YourExitPlans</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">MENU</p>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selectedPage === item.id
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header - Fixed */}
        <div className="h-16 bg-[#0f0f0f] border-b border-neutral-800 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-64 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-white capitalize">{selectedPage}</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-32 lg:w-48 bg-neutral-800 border-neutral-700 text-white text-sm"
              />
              <Button variant="ghost" size="sm" onClick={handleSearch} className="text-neutral-400 hover:text-white">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden text-neutral-400 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-neutral-400 hover:text-white relative"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
            <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto mt-16">{children}</div>
      </div>
    </div>
  )
}
