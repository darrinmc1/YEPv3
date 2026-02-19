"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      {/* Left side - only visible on desktop */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">YEP</span>
            </div>
            <span className="text-2xl font-semibold text-white">YourExitPlans</span>
          </div>
          <h1 className="text-4xl font-bold text-white mt-12">Welcome to YourExitPlans Admin</h1>
          <p className="text-purple-100 mt-4 max-w-md">
            Manage your website content, pricing, and settings from one central dashboard.
          </p>
        </div>
        <div className="mt-auto">
          <div className="w-full h-[300px] bg-[#0f0f0f] rounded-xl border border-white/10 relative overflow-hidden group shadow-2xl flex flex-col">
            {/* Mock Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              <div className="ml-auto w-24 h-2 rounded-full bg-white/5"></div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* Mock Sidebar */}
              <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 mb-2"></div>
                <div className="w-4 h-4 rounded bg-white/5"></div>
                <div className="w-4 h-4 rounded bg-white/5"></div>
                <div className="w-4 h-4 rounded bg-white/5"></div>
                <div className="w-4 h-4 rounded bg-white/5"></div>
              </div>
              {/* Mock Content */}
              <div className="flex-1 p-4 space-y-4 bg-black/20">
                <div className="flex gap-4">
                  <div className="flex-1 h-20 rounded-lg bg-white/5 border border-white/5 p-3 space-y-2">
                    <div className="w-8 h-8 rounded bg-purple-500/20"></div>
                    <div className="w-12 h-2 rounded bg-white/10"></div>
                  </div>
                  <div className="flex-1 h-20 rounded-lg bg-white/5 border border-white/5 p-3 space-y-2">
                    <div className="w-8 h-8 rounded bg-blue-500/20"></div>
                    <div className="w-12 h-2 rounded bg-white/10"></div>
                  </div>
                  <div className="flex-1 h-20 rounded-lg bg-white/5 border border-white/5 p-3 space-y-2">
                    <div className="w-8 h-8 rounded bg-green-500/20"></div>
                    <div className="w-12 h-2 rounded bg-white/10"></div>
                  </div>
                </div>
                <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 flex items-end gap-2">
                  <div className="w-full bg-blue-500/20 rounded-t h-[40%]"></div>
                  <div className="w-full bg-purple-500/20 rounded-t h-[70%]"></div>
                  <div className="w-full bg-blue-500/20 rounded-t h-[50%]"></div>
                  <div className="w-full bg-purple-500/20 rounded-t h-[80%]"></div>
                  <div className="w-full bg-blue-500/20 rounded-t h-[60%]"></div>
                  <div className="w-full bg-purple-500/20 rounded-t h-[90%]"></div>
                </div>
              </div>
            </div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none mix-blend-overlay" />
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile header - only visible on mobile */}
        <div className="flex md:hidden items-center gap-3 mb-8 w-full">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">YEP</span>
          </div>
          <span className="text-2xl font-semibold text-white">YourExitPlans</span>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="text-neutral-400 mt-2">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theYourExitPlans.com"
                className="bg-[#1a1a1a] border-neutral-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-neutral-200">
                  Password
                </Label>
                <a
                  href="mailto:support@theYourExitPlans.com?subject=Admin%20Password%20Reset"
                  className="text-sm text-[#3B82F6] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#1a1a1a] border-neutral-800 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-[#3B82F6] text-black hover:bg-[#3B82F6]/90">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-neutral-400 text-sm">
              Need help? Contact{" "}
              <a href="mailto:support@theYourExitPlans.com" className="text-[#3B82F6] hover:underline">
                support@theYourExitPlans.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
