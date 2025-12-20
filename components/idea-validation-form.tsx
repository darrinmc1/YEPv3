"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, AlertCircle, Loader2, Clock, RefreshCw } from "lucide-react"
import { useDebounce } from "@/lib/performance"
import { getProgressAriaAttributes } from "@/lib/accessibility"
import { interactiveButton } from "@/lib/animations"
import { useFormAutoSave, useRateLimitTimer, useBeforeUnload } from "@/lib/form-utils"
import { IdeaFormData, AnalysisResult, LimitReachedResponse, FormStatus } from "./idea-validation/types"
import { IdeaFormStep1 } from "./idea-validation/step-one"
import { IdeaFormStep2 } from "./idea-validation/step-two"
import { IdeaFormStep3 } from "./idea-validation/step-three"
import { AnalysisResultDisplay } from "./idea-validation/analysis-result"

const initialFormData: IdeaFormData = {
  ideaName: "",
  oneLiner: "",
  problemSolved: "",
  targetCustomer: "",
  businessType: "",
  industry: "",
  priceRange: "",
  email: ""
}

export function IdeaValidationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [resetTime, setResetTime] = useState("")
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false)

  // Auto-save with recovery
  const {
    formData,
    setFormData,
    clearForm,
    hasUnsavedChanges,
    hasSavedData,
    lastSaved,
  } = useFormAutoSave("idea-validation-form", initialFormData)

  // Rate limit countdown
  const rateLimitTimer = useRateLimitTimer(resetTime)

  // Prevent navigation with unsaved changes
  useBeforeUnload(hasUnsavedChanges && status === "idle")

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  // Check for saved data on mount
  useEffect(() => {
    if (hasSavedData()) {
      setShowRecoveryPrompt(true)
    }
  }, [hasSavedData])

  const handleRecoverData = () => {
    toast.success("Form data recovered!")
    setShowRecoveryPrompt(false)
  }

  const handleStartFresh = () => {
    clearForm()
    setShowRecoveryPrompt(false)
    toast.info("Starting with a fresh form")
  }

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
        toast.error("Rate limit reached. Please try again later.")
        return
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
      setStatus("success")
      toast.success("Your idea has been analyzed!")
    } catch (error) {
      setStatus("error")
      const message = error instanceof Error
        ? error.message
        : "Failed to analyze your idea. Please try again."
      setErrorMessage(message)
      toast.error(message)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setStatus("idle")
    clearForm()
    setAnalysisResult(null)
    setErrorMessage("")
    setResetTime("")
    toast.success("Form reset successfully")
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
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Free Analysis Limit Reached</h3>
          <p className="text-neutral-400 mb-4">{errorMessage}</p>

          {/* Countdown Timer */}
          {rateLimitTimer.isActive && (
            <div className="mb-6 w-full max-w-md">
              <div className="p-4 rounded-lg bg-black/40 border border-yellow-400/20">
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="text-lg font-semibold">
                    Resets in {rateLimitTimer.formatTime()}
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-1000"
                    style={{ width: `${100 - rateLimitTimer.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          <div className="p-6 rounded-xl bg-black/40 border border-blue-400/20 mb-6 w-full">
            <h4 className="text-lg font-semibold text-white mb-2">Want Unlimited Validations?</h4>
            <p className="text-neutral-300 mb-4">
              Upgrade to unlock unlimited idea validations, deeper analysis, and implementation plans.
            </p>
            <Button className={`w-full bg-blue-500 text-black hover:bg-blue-400 font-semibold ${interactiveButton}`}>
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
      {/* Recovery Prompt */}
      {showRecoveryPrompt && (
        <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">Continue where you left off?</h4>
              <p className="text-sm text-neutral-300 mb-3">
                We found your previously saved form data. Would you like to continue or start fresh?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleRecoverData}
                  className="bg-blue-500 text-black hover:bg-blue-400"
                >
                  Continue
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStartFresh}
                  className="text-neutral-300 hover:text-white"
                >
                  Start Fresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10">
            <Lightbulb className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Validate Your Business Idea</h2>
            <p className="text-sm text-neutral-400">
              Free AI-powered analysis in 60 seconds
              {lastSaved && (
                <span className="ml-2 text-green-400">• Auto-saved {new Date(lastSaved).toLocaleTimeString()}</span>
              )}
            </p>
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
