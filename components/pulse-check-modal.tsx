"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PulseCheckFormData {
  ideaName: string
  oneLiner: string
  problemSolved: string
  targetCustomer: string
  businessType: string
  industry: string
  priceRange: string
  revenueModel: string
  geographicFocus: string
  email: string
}

export function PulseCheckModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<PulseCheckFormData>({
    ideaName: "",
    oneLiner: "",
    problemSolved: "",
    targetCustomer: "",
    businessType: "",
    industry: "",
    priceRange: "",
    revenueModel: "",
    geographicFocus: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1. Submit Request & Get Job ID
      const response = await fetch("/api/validate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Failed to start validation")
      }

      const { jobId } = await response.json()

      if (!jobId) {
        throw new Error("No Job ID returned")
      }

      // 2. Poll for Results
      const pollInterval = setInterval(async () => {
        try {
          const jobRes = await fetch(`/api/jobs/${jobId}`)
          if (!jobRes.ok) return

          const job = await jobRes.json()

          if (job.status === "COMPLETED") {
            clearInterval(pollInterval)
            setSuccess(true)
            setLoading(false)

            // Optional: You can access job.result here if you need to display immediate results
            // const result = typeof job.result === 'string' ? JSON.parse(job.result) : job.result

            setTimeout(() => {
              setOpen(false)
              setSuccess(false)
              resetForm()
            }, 3000)
          } else if (job.status === "FAILED") {
            clearInterval(pollInterval)
            setLoading(false)
            setError(job.error || "Validation failed")
          }
          // If PENDING, continue polling
        } catch (e) {
          console.error("Polling error", e)
          // Don't stop polling on transient network errors
        }
      }, 2000)

      // Safety timeout: Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (loading) {
          setLoading(false)
          setError("Request timed out. The analysis might still be sent to your email.")
        }
      }, 120000)

    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      ideaName: "",
      oneLiner: "",
      problemSolved: "",
      targetCustomer: "",
      businessType: "",
      industry: "",
      priceRange: "",
      revenueModel: "",
      geographicFocus: "",
      email: "",
    })
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Your Free Pulse Check</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/95 border border-white/10">
        {success ? (
          <div className="py-12 text-center">
            <div className="text-5xl mb-4">All set</div>
            <h3 className="text-xl font-bold text-white mb-2">Check Your Email!</h3>
            <p className="text-neutral-400">Your Quick Pulse Check report is on its way.</p>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-white/10 pb-4">
              <div className="text-center w-full">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs mb-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></div>
                  <span className="uppercase tracking-wider text-blue-400">100% FREE</span>
                </div>
                <DialogTitle className="text-2xl text-white mt-2">Quick Pulse Check</DialogTitle>
                <p className="text-sm text-neutral-400 mt-1">Get an instant validation score for your business idea</p>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* What You Get */}
              <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-400 mb-2">What You&apos;ll Get (in 2 minutes):</h3>
                <ul className="text-sm text-neutral-300 space-y-1">
                  <li>Opportunity Score (1-10)</li>
                  <li>Market Interest Level</li>
                  <li>Trend Direction Analysis</li>
                  <li>Quick &quot;Why Now?&quot; Summary</li>
                  <li>Top Strength &amp; Risk Identified</li>
                </ul>
              </div>

              {/* Section 1: Your Idea */}
              <div>
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                  Your Idea
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ideaName" className="text-white mb-2 block text-sm">
                      Idea Name / Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="ideaName"
                      name="ideaName"
                      value={formData.ideaName}
                      onChange={handleInputChange}
                      placeholder="e.g., AI Resume Builder for Developers"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="oneLiner" className="text-white mb-2 block text-sm">
                      One-Liner Description <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="oneLiner"
                      name="oneLiner"
                      value={formData.oneLiner}
                      onChange={handleInputChange}
                      maxLength={150}
                      placeholder="e.g., Helps developers create ATS-optimized resumes using AI in 5 minutes"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
                    />
                    <p className="text-xs text-neutral-500 mt-1 text-right">{formData.oneLiner.length}/150</p>
                  </div>

                  <div>
                    <Label htmlFor="problemSolved" className="text-white mb-2 block text-sm">
                      Problem You Solve <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="problemSolved"
                      name="problemSolved"
                      value={formData.problemSolved}
                      onChange={handleInputChange}
                      placeholder="e.g., Developers spend hours writing resumes that get rejected by ATS systems..."
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 min-h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetCustomer" className="text-white mb-2 block text-sm">
                      Who Has This Problem? <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="targetCustomer"
                      name="targetCustomer"
                      value={formData.targetCustomer}
                      onChange={handleInputChange}
                      placeholder="e.g., Software developers with 2-5 years experience actively job hunting"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Quick Context */}
              <div>
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                  Quick Context
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessType" className="text-white mb-2 block text-sm">
                      Business Type <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.businessType} onValueChange={(value) => handleSelectChange("businessType", value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/10">
                        <SelectItem value="SaaS">SaaS / Software</SelectItem>
                        <SelectItem value="Service">Service Business</SelectItem>
                        <SelectItem value="Physical Product">Physical Product</SelectItem>
                        <SelectItem value="Info Product">Info Product / Course</SelectItem>
                        <SelectItem value="Agency">Agency / Consulting</SelectItem>
                        <SelectItem value="Marketplace">Marketplace / Platform</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-white mb-2 block text-sm">
                      Industry / Niche <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., HR Tech, Developer Tools, Career Services"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priceRange" className="text-white mb-2 block text-sm">
                      Price Range <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.priceRange} onValueChange={(value) => handleSelectChange("priceRange", value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select price range..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/10">
                        <SelectItem value="$0-50">$0 - $50</SelectItem>
                        <SelectItem value="$50-200">$50 - $200</SelectItem>
                        <SelectItem value="$200-500">$200 - $500</SelectItem>
                        <SelectItem value="$500-2000">$500 - $2,000</SelectItem>
                        <SelectItem value="$2000+">$2,000+</SelectItem>
                        <SelectItem value="Not sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="revenueModel" className="text-white mb-2 block text-sm">
                      Revenue Model <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.revenueModel} onValueChange={(value) => handleSelectChange("revenueModel", value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select revenue model..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/10">
                        <SelectItem value="One-time">One-time Purchase</SelectItem>
                        <SelectItem value="Subscription">Subscription / Recurring</SelectItem>
                        <SelectItem value="Freemium">Freemium</SelectItem>
                        <SelectItem value="Commission">Commission / Marketplace Fee</SelectItem>
                        <SelectItem value="Advertising">Advertising</SelectItem>
                        <SelectItem value="Multiple">Multiple Revenue Streams</SelectItem>
                        <SelectItem value="Not sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="geographicFocus" className="text-white mb-2 block text-sm">
                      Geographic Focus <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.geographicFocus} onValueChange={(value) => handleSelectChange("geographicFocus", value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select target market..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-white/10">
                        <SelectItem value="Local">Local (city/region)</SelectItem>
                        <SelectItem value="National">National (one country)</SelectItem>
                        <SelectItem value="Global">Global (worldwide)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section 3: Email */}
              <div>
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                  Get Your Results
                </h4>
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block text-sm">
                    Your Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 mt-6"
              >
                {loading ? "Analyzing Your Idea..." : "Get My Free Pulse Check"}
              </Button>

              <p className="text-xs text-neutral-500 text-center">
                Your idea is safe. We never share or sell your information.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
