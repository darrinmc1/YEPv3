"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Users, DollarSign, CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react"

// TypeScript Interfaces
interface IdeaFormData {
  ideaName: string
  oneLiner: string
  problemSolved: string
  targetCustomer: string
  businessType: string
  industry: string
  priceRange: string
  email: string
}

interface AnalysisResult {
  marketValidation: {
    score: number
    summary: string
    keyInsights: string[]
  }
  competitorLandscape: {
    competition: string
    opportunities: string[]
  }
  quickWins: string[]
  redFlags: string[]
  nextSteps: string[]
}

interface LimitReachedResponse {
  error: string
  message: string
  resetTime?: string
}

type FormStatus = "idle" | "loading" | "success" | "error" | "rate-limited"

const BUSINESS_TYPES = [
  "SaaS (Software as a Service)",
  "E-commerce Store",
  "Marketplace Platform",
  "Service Business",
  "Content/Education",
  "Agency",
  "Mobile App",
  "Physical Product",
  "Other"
]

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "E-commerce/Retail",
  "Food & Beverage",
  "Marketing/Advertising",
  "Entertainment",
  "Professional Services",
  "Other"
]

const PRICE_RANGES = [
  "Free (ad-supported)",
  "Under $10",
  "$10-$50",
  "$50-$100",
  "$100-$500",
  "$500-$1000",
  "$1000+",
  "Not sure yet"
]

export function IdeaValidationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [formData, setFormData] = useState<IdeaFormData>({
    ideaName: "",
    oneLiner: "",
    problemSolved: "",
    targetCustomer: "",
    businessType: "",
    industry: "",
    priceRange: "",
    email: ""
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [resetTime, setResetTime] = useState("")

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  // Field validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          formData.ideaName.trim().length >= 3 &&
          formData.oneLiner.trim().length >= 10 &&
          formData.problemSolved.trim().length >= 20
        )
      case 2:
        return (
          formData.targetCustomer.trim().length >= 10 &&
          formData.businessType !== "" &&
          formData.industry !== "" &&
          formData.priceRange !== ""
        )
      case 3:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(formData.email)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setStatus("loading")
    setErrorMessage("")

    try {
      const webhookUrl = "/api/validate-idea"

      // Webhook URL is handled by the API route

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.status === 429) {
        const limitData: LimitReachedResponse = await response.json()
        setStatus("rate-limited")
        setErrorMessage(limitData.message)
        setResetTime(limitData.resetTime || "")
        return
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to analyze your idea. Please try again."
      )
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setStatus("idle")
    setFormData({
      ideaName: "",
      oneLiner: "",
      problemSolved: "",
      targetCustomer: "",
      businessType: "",
      industry: "",
      priceRange: "",
      email: ""
    })
    setAnalysisResult(null)
    setErrorMessage("")
    setResetTime("")
  }

  // Render loading state
  if (status === "loading") {
    return (
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-16 w-16 text-blue-400 animate-spin mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Analyzing Your Idea...</h3>
          <p className="text-neutral-400 mb-4">
            Our AI is validating your business concept against market data
          </p>
          <p className="text-sm text-neutral-500">This typically takes 30-60 seconds</p>
          <div className="mt-8 w-full max-w-md">
            <div className="space-y-3 text-left text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Running market validation analysis...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Checking competitor landscape...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Identifying opportunities and risks...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render success state
  if (status === "success" && analysisResult) {
    return (
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-400/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h3>
          <p className="text-neutral-400">Here&apos;s what we found about your idea</p>
        </div>

        <div className="space-y-6">
          {/* Market Validation */}
          <Card className="bg-black/40 border-blue-400/20">
            <CardHeader>
              <CardTitle className="text-white">Market Validation Score</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Progress value={analysisResult.marketValidation.score} className="flex-1" />
                <span className="text-2xl font-bold text-blue-400">
                  {analysisResult.marketValidation.score}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300 mb-4">{analysisResult.marketValidation.summary}</p>
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                Key Insights:
              </h4>
              <ul className="space-y-2">
                {analysisResult.marketValidation.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Competitor Landscape */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Competitor Landscape</CardTitle>
              <CardDescription className="text-neutral-400">
                {analysisResult.competitorLandscape.competition}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                Opportunities:
              </h4>
              <ul className="space-y-2">
                {analysisResult.competitorLandscape.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Wins & Red Flags */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-green-400/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  Quick Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.quickWins.map((win, index) => (
                    <li key={index} className="text-sm text-neutral-300">
                      • {win}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-red-400/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Red Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.redFlags.map((flag, index) => (
                    <li key={index} className="text-sm text-neutral-300">
                      • {flag}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="bg-black/40 border-blue-400/20">
            <CardHeader>
              <CardTitle className="text-white">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {analysisResult.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-neutral-300">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-400/10 text-blue-400 font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
          <h4 className="text-xl font-bold text-white mb-2">Ready to Take Action?</h4>
          <p className="text-neutral-300 mb-4">
            Upgrade to get detailed implementation plans, market research reports, and ongoing support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-blue-500 text-black hover:bg-blue-400 font-semibold">
              View Pricing Plans
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-white/20 text-white hover:bg-white/10">
              Validate Another Idea
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render rate limit state
  if (status === "rate-limited") {
    return (
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-400/10 mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Free Analysis Limit Reached</h3>
          <p className="text-neutral-400 mb-4">{errorMessage}</p>
          {resetTime && (
            <p className="text-sm text-neutral-500 mb-6">Reset time: {resetTime}</p>
          )}
          <div className="p-6 rounded-xl bg-black/40 border border-blue-400/20 mb-6 w-full">
            <h4 className="text-lg font-semibold text-white mb-2">Want Unlimited Validations?</h4>
            <p className="text-neutral-300 mb-4">
              Upgrade to unlock unlimited idea validations, deeper analysis, and implementation plans.
            </p>
            <Button className="w-full bg-blue-500 text-black hover:bg-blue-400 font-semibold">
              View Pricing Plans
            </Button>
          </div>
          <Button variant="ghost" onClick={resetForm} className="text-neutral-400 hover:text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Render error state
  if (status === "error") {
    return (
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-400/10 mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h3>
          <p className="text-neutral-400 mb-6">{errorMessage}</p>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="bg-blue-500 text-black hover:bg-blue-400 font-semibold">
              Try Again
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-white/20 text-white hover:bg-white/10">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render form steps (idle state)
  return (
    <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10">
            <Lightbulb className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Validate Your Business Idea</h2>
            <p className="text-sm text-neutral-400">Free AI-powered analysis in 60 seconds</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step 1: Idea Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Tell Us About Your Idea</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ideaName" className="text-white">
              Idea Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="ideaName"
              placeholder="e.g., AI-powered fitness coach for busy professionals"
              value={formData.ideaName}
              onChange={(e) => setFormData({ ...formData, ideaName: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
            />
            <p className="text-xs text-neutral-500">Min 3 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="oneLiner" className="text-white">
              One-Liner Description <span className="text-red-400">*</span>
            </Label>
            <Input
              id="oneLiner"
              placeholder="What is it in one sentence?"
              value={formData.oneLiner}
              onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
            />
            <p className="text-xs text-neutral-500">Min 10 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemSolved" className="text-white">
              What Problem Does It Solve? <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="problemSolved"
              placeholder="Describe the problem your idea addresses..."
              value={formData.problemSolved}
              onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 min-h-24"
            />
            <p className="text-xs text-neutral-500">Min 20 characters</p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!validateStep(1)}
              className="bg-blue-500 text-black hover:bg-blue-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Context */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Market Context</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetCustomer" className="text-white">
              Who Is Your Target Customer? <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="targetCustomer"
              placeholder="Describe your ideal customer..."
              value={formData.targetCustomer}
              onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 min-h-20"
            />
            <p className="text-xs text-neutral-500">Min 10 characters</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-white">
                Business Type <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                <SelectTrigger id="businessType" className="bg-black/40 border-white/20 text-white w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-white">
                Industry <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger id="industry" className="bg-black/40 border-white/20 text-white w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry} className="text-white">
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceRange" className="text-white">
              Expected Price Range <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.priceRange} onValueChange={(value) => setFormData({ ...formData, priceRange: value })}>
              <SelectTrigger id="priceRange" className="bg-black/40 border-white/20 text-white w-full">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range} value={range} className="text-white">
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!validateStep(2)}
              className="bg-blue-500 text-black hover:bg-blue-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Email & Submit */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Get Your Free Analysis</h3>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
            <h4 className="text-lg font-semibold text-white mb-3">What You&apos;ll Receive:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Market validation score and analysis</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Competitor landscape overview</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Quick wins and red flags</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Recommended next steps</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
            />
            <p className="text-xs text-neutral-500">
              We&apos;ll email you a copy of the analysis. No spam, ever.
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(3)}
              className="bg-blue-500 text-black hover:bg-blue-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed px-8"
            >
              Analyze My Idea
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
