"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, AlertCircle, Loader2 } from "lucide-react"
import { IdeaFormData, AnalysisResult, LimitReachedResponse, FormStatus } from "./idea-validation/types"
import { IdeaFormStep1 } from "./idea-validation/step-one"
import { IdeaFormStep2 } from "./idea-validation/step-two"
import { IdeaFormStep3 } from "./idea-validation/step-three"
import { AnalysisResultDisplay } from "./idea-validation/analysis-result"

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
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

      if (!webhookUrl) {
        throw new Error("Webhook URL not configured")
      }

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
        <AnalysisResultDisplay result={analysisResult} onReset={resetForm} />
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

      {currentStep === 1 && (
        <IdeaFormStep1
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          isValid={validateStep(1)}
        />
      )}

      {currentStep === 2 && (
        <IdeaFormStep2
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onBack={handleBack}
          isValid={validateStep(2)}
        />
      )}

      {currentStep === 3 && (
        <IdeaFormStep3
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onBack={handleBack}
          isValid={validateStep(3)}
        />
      )}
    </div>
  )
}
