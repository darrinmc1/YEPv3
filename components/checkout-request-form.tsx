"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, Mail, ShoppingCart, AlertCircle } from "lucide-react"

// Product details mapping
const PRODUCTS = {
  "research": {
    name: "Full Idea Research Report",
    price: 9,
    description: "Complete market analysis, competitor breakdown, and revenue potential for one idea"
  },
  "implementation": {
    name: "Research + Implementation Plan",
    price: 29,
    description: "Research report + 90-day roadmap, tech stack, marketing strategy, and templates"
  },
  "idea-bundle": {
    name: "7 Ideas Bundle",
    price: 49,
    description: "Full research reports for 7 pre-researched ideas + 10% off next purchase"
  },
  "premium-bundle": {
    name: "10 Ideas + Implementation Plan",
    price: 99,
    description: "10 research reports + generic implementation plan + 10% off next purchase"
  },
  "implementation-addon": {
    name: "Implementation Plan Add-on",
    price: 29,
    description: "90-day roadmap and resources to implement any idea from your bundle"
  },
  // Legacy support
  "single-idea": {
    name: "Single Idea Research",
    price: 9,
    description: "Full research report for one business idea"
  },
  "quick-start": {
    name: "Quick Start",
    price: 29,
    description: "30-day launch roadmap with daily tasks and essential templates"
  },
  "launch-system": {
    name: "Launch System",
    price: 49,
    description: "90-day implementation roadmap with 25+ AI prompts, templates, and marketing playbook"
  },
  "complete-build": {
    name: "Complete Build",
    price: 99,
    description: "120-day system with email sequences, scaling playbook, and coaching calls"
  }
}

type FormStatus = "idle" | "loading" | "success" | "error"

export function CheckoutRequestForm() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Get product info from URL params
  const planParam = searchParams.get("plan") || searchParams.get("item") || ""
  const ideaName = searchParams.get("idea") || ""
  const ideaId = searchParams.get("id") || ""

  const product = PRODUCTS[planParam as keyof typeof PRODUCTS] || {
    name: "Custom Product",
    price: 0,
    description: planParam || "Product details"
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    productName: product.name,
    productPrice: product.price,
    ideaName: ideaName,
    ideaId: ideaId,
    additionalNotes: ""
  })

  const validateForm = () => {
    if (!formData.name.trim()) return false
    if (!formData.email.includes("@")) return false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/checkout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again or email us directly.")
    }
  }

  // Success state
  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/40 border-green-400/30">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-400/10 mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Request Received!
            </h2>

            <p className="text-neutral-300 mb-6">
              Thanks for your interest in <span className="font-semibold text-white">{product.name}</span>.
            </p>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20 mb-6">
              <p className="text-sm text-neutral-300">
                We&apos;ve sent a confirmation to <span className="text-blue-400 font-semibold">{formData.email}</span>
              </p>
            </div>

            <p className="text-neutral-400 mb-8">
              We&apos;ll reach out within 24 hours to complete your purchase and deliver your materials.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-blue-500 hover:bg-blue-400 text-white">
                <a href="/validate-idea">Validate Another Idea</a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href="/explore-ideas">Explore More Ideas</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form state
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2">
          <ShoppingCart className="h-4 w-4 text-blue-400" />
          <span className="text-xs uppercase tracking-wider text-blue-400">Purchase Request</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
          Let&apos;s Make This Official
        </h1>

        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          We just need a few details before we give you the keys to the castle.
        </p>
      </div>

      {/* Product Summary */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Your Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-neutral-300 text-sm mb-4">{product.description}</p>
              {ideaName && (
                <p className="text-sm text-blue-400">
                  For idea: <span className="font-semibold">{ideaName}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${product.price}</div>
              <div className="text-xs text-neutral-500">one-time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Form */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
                required
              />
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone Number <span className="text-neutral-500">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">
                Additional Notes <span className="text-neutral-500">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Any questions or special requests?"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 min-h-24"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-400/20 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === "loading" || !validateForm()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-6 text-lg disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Let&apos;s Do This
                </>
              )}
            </Button>

            <p className="text-xs text-center text-neutral-500">
              We&apos;ll contact you within 24 hours to complete the purchase. No commitment until we connect!
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-500 mb-4">Have questions?</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="mailto:support@yourexitplans.com" className="text-blue-400 hover:text-blue-300">
            Email Support
          </a>
          <span className="text-neutral-700">•</span>
          <a href="/faq" className="text-blue-400 hover:text-blue-300">
            View FAQ
          </a>
        </div>
      </div>
    </div>
  )
}
