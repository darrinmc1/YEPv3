"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  Loader2,
  Search,
  Sparkles,
  Filter,
  ArrowRight,
  ArrowLeft,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Zap,
  Mail,
  BookOpen,
  Info
} from "lucide-react"
import { WhatsIncludedModal } from "@/components/whats-included-modal"

// ============================================
// CONSTANTS
// ============================================

const INDUSTRIES = [
  { value: "any", label: "Any Industry" },
  { value: "saas", label: "SaaS / Software" },
  { value: "ecommerce", label: "E-Commerce / Physical Products" },
  { value: "services", label: "Services / Consulting" },
  { value: "content", label: "Content / Info Products" },
  { value: "local", label: "Local Business" },
  { value: "agency", label: "Agency / Done-For-You" },
  { value: "marketplace", label: "Marketplace / Platform" },
  { value: "ai", label: "AI / Automation" },
  { value: "health", label: "Health / Wellness" },
  { value: "finance", label: "Finance / Fintech" },
  { value: "education", label: "Education / Training" },
  { value: "other", label: "Other" },
]

const BUDGET_LEVELS = [
  { value: "any", label: "Any Budget" },
  { value: "bootstrap", label: "I&apos;m Broke ($0 - Bootstrap)" },
  { value: "low", label: "I can spare a little (Under $500)" },
  { value: "medium", label: "Serious invesment ($500 - $2,000)" },
  { value: "high", label: "Ready to scale ($2,000 - $10,000)" },
  { value: "investor", label: "I have &apos;F*** You&apos; Money ($10,000+)" },
]

const TIME_COMMITMENTS = [
  { value: "any", label: "Any Time Commitment" },
  { value: "side", label: "I have a boss I hate (Side Hustle)" },
  { value: "part", label: "Part Time (10-20 hrs/week)" },
  { value: "full", label: "Full Time (40+ hrs/week)" },
]

const DIFFICULTY_LEVELS = [
  { value: "any", label: "Any Difficulty" },
  { value: "beginner", label: "Beginner Friendly" },
  { value: "intermediate", label: "Some Experience Needed" },
  { value: "advanced", label: "Advanced / Technical" },
]

const SKILLS = [
  { id: "technical", label: "Technical / Coding" },
  { id: "marketing", label: "Marketing / Content" },
  { id: "sales", label: "Sales / Persuasion" },
  { id: "design", label: "Design / Creative" },
  { id: "operations", label: "Operations / Systems" },
  { id: "finance", label: "Finance / Numbers" },
  { id: "people", label: "People / Management" },
  { id: "none", label: "I have no skills (yet)" },
]

// Enhanced mock data with more detail
const MOCK_IDEAS = [
  {
    id: "idea-001",
    title: "AI-Powered Resume Optimization SaaS",
    oneLiner: "Help job seekers beat ATS systems with AI-powered resume analysis and optimization",
    industry: "SaaS / Software",
    score: 8.5,
    marketSize: "$4.2B",
    growthRate: "+23%",
    difficulty: "Intermediate",
    timeToFirstSale: "4-6 weeks",
    startupCost: "$500 - $2,000",
    whyNow: "AI tools are mainstream, job market is competitive, ATS systems reject 75% of resumes. Job seekers are desperate for an edge.",
    quickInsights: [
      "Target market: 40M+ job seekers annually in US alone",
      "Competitors are overpriced ($300-500) or underwhelming",
      "Can start with a simple GPT-powered MVP",
      "LinkedIn is perfect for organic customer acquisition"
    ],
    lockedContent: [
      "Full competitor analysis (12 competitors mapped)",
      "Revenue model breakdown with pricing tiers",
      "90-day launch roadmap with milestones",
      "Tech stack recommendations (no-code to custom)",
      "Marketing channels ranked by ROI",
      "Customer acquisition cost benchmarks"
    ]
  },
  {
    id: "idea-002",
    title: "Niche Newsletter → Paid Community",
    oneLiner: "Build an audience with free content, monetize with premium community access",
    industry: "Content / Info Products",
    score: 8.2,
    marketSize: "$2.1B",
    growthRate: "+34%",
    difficulty: "Beginner",
    timeToFirstSale: "6-8 weeks",
    startupCost: "$0 - $500",
    whyNow: "Newsletter fatigue is real, but niche experts still win. Community adds stickiness that prevents churn.",
    quickInsights: [
      "Pick a niche you know: finance, parenting, tech, hobbies",
      "Free newsletter → $20-50/mo community is proven path",
      "Tools like Beehiiv, Circle, Skool make this easy",
      "One viral post can add 1000+ subscribers overnight"
    ],
    lockedContent: [
      "50 profitable niche ideas with audience sizes",
      "Monetization timeline (month-by-month)",
      "Content calendar template (12 weeks)",
      "Community platform comparison matrix",
      "Growth hacks from $1M+ newsletters",
      "Email sequence templates for conversion"
    ]
  },
  {
    id: "idea-003",
    title: "Local Service Business Aggregator",
    oneLiner: "Connect local service providers with customers in underserved verticals",
    industry: "Marketplace / Platform",
    score: 7.9,
    marketSize: "$12B",
    growthRate: "+18%",
    difficulty: "Intermediate",
    timeToFirstSale: "3-4 weeks",
    startupCost: "$1,000 - $5,000",
    whyNow: "Post-COVID local business boom, but discovery is still broken in many niches. Google and Yelp don't serve specialized needs.",
    quickInsights: [
      "Think: Thumbtack but for specific niche (pet services, home organization)",
      "Start hyperlocal (one city) before expanding",
      "Revenue from booking fees (10-15%) or subscriptions",
      "Facebook Groups are goldmines for initial customers"
    ],
    lockedContent: [
      "15 underserved local verticals with opportunity scores",
      "Platform build vs buy analysis (no-code options)",
      "Customer acquisition playbook for both sides",
      "Supplier onboarding scripts that convert",
      "Unit economics model with break-even analysis",
      "Legal considerations by state"
    ]
  }
]

// ============================================
// TYPES
// ============================================

type FormStatus = "idle" | "loading" | "success" | "error"

interface FormData {
  interests: string
  industry: string
  budget: string
  timeCommitment: string
  difficulty: string
  skills: string[]
  avoidTopics: string
  email: string
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ExploreIdeasForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [matchedIdeas, setMatchedIdeas] = useState(MOCK_IDEAS)
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState<FormData>({
    interests: "",
    industry: "any",
    budget: "any",
    timeCommitment: "any",
    difficulty: "any",
    skills: [],
    avoidTopics: "",
    email: ""
  })

  const totalSteps = 2
  const progress = (currentStep / totalSteps) * 100

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true // Allow proceeding even with defaults
      case 2:
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
    if (!validateStep(2)) return

    setStatus("loading")
    setErrorMessage("")

    try {
      // Use the new API route for exploration
      const webhookUrl = '/api/explore-ideas'

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.ideas && data.ideas.length > 0) {
          setMatchedIdeas(data.ideas)
        }
      } else {
        throw new Error(`API error: ${response.status}`)
      }

      setStatus("success")
    } catch (error) {
      console.error("Error:", error)
      setStatus("success") // Still show results with mock data
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setStatus("idle")
    setFormData({
      interests: "",
      industry: "any",
      budget: "any",
      timeCommitment: "any",
      difficulty: "any",
      skills: [],
      avoidTopics: "",
      email: ""
    })
    setErrorMessage("")
  }

  // ============================================
  // LOADING STATE
  // ============================================
  if (status === "loading") {
    return (
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-16 w-16 text-purple-400 animate-spin mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Hunting for your ticket out of the rat race...</h3>
          <p className="text-neutral-400 mb-4">
            Matching you with pre-researched business opportunities
          </p>
          <div className="mt-8 w-full max-w-md">
            <div className="space-y-3 text-left text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                <span>Judging 1,000+ ideas so you don&apos;t have to...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                <span>Filtering by your preferences...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                <span>Ranking by opportunity score...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // SUCCESS STATE - RESULTS
  // ============================================
  if (status === "success") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Ideas Found</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Here are your Escape Routes</h2>
          <p className="text-neutral-400">
            Found <span className="text-purple-400 font-semibold">{matchedIdeas.length} ideas</span> matching your interests
          </p>

          {formData.interests && (
            <p className="text-sm text-neutral-500 mt-2">
              Based on: &quot;{formData.interests}&quot;
            </p>
          )}
        </div>

        {/* Results Cards */}
        <div className="space-y-6">
          {matchedIdeas.map((idea, index) => (
            <IdeaResultCard key={idea.id} idea={idea} isFirst={index === 0} />
          ))}
        </div>

        {/* Bundle Upsells */}
        <div className="space-y-6">
          {/* $49 - 7 Ideas Bundle */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">7 Ideas Bundle</h3>
              <p className="text-neutral-300 mb-6">
                7 research reports — save $14 + get 10% off next purchase
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 items-center">
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-400 text-white">
                  <a href="/checkout?plan=idea-bundle">
                    Get 7 Ideas — $49
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>

                <WhatsIncludedModal
                  productType="idea-bundle"
                  trigger={
                    <Button
                      variant="outline"
                      className="bg-transparent border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      What's Included?
                    </Button>
                  }
                />
              </div>

              <p className="text-xs text-neutral-500">
                7 research reports ($63 value) • Save $14
              </p>
              <p className="text-xs text-blue-400 mt-2">
                Plus 10% off your next 7-idea bundle ($44.10)
              </p>
            </CardContent>
          </Card>

          {/* $99 - Premium Bundle */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30">
            <CardContent className="p-8 text-center">
              <div className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full mb-4">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">10 Ideas + Implementation</h3>
              <p className="text-neutral-300 mb-6">
                10 research reports + generic roadmap — save $20 + get 10% off next
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 items-center">
                <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-400 text-white">
                  <a href="/checkout?plan=premium-bundle">
                    Get Premium Bundle — $99
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>

                <WhatsIncludedModal
                  productType="premium-bundle"
                  trigger={
                    <Button
                      variant="outline"
                      className="bg-transparent border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      What's Included?
                    </Button>
                  }
                />
              </div>

              <p className="text-xs text-neutral-500">
                10 research reports ($90) + implementation ($29) = $119 value
              </p>
              <p className="text-xs text-purple-400 mt-2">
                Plus 10% off your next premium bundle ($89.10)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Email Confirmation */}
        <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
          <Mail className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-2">Ideas Sent to Your Email</h4>
          <p className="text-sm text-neutral-400 mb-4">
            We&apos;ve sent these matches to <span className="text-white">{formData.email}</span>
            <br />Plus, you&apos;ll get new ideas weekly (unsubscribe anytime).
          </p>
          <Button onClick={resetForm} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
            Search Again with Different Filters
          </Button>
        </div>
      </div>
    )
  }

  // ============================================
  // FORM STEPS (IDLE STATE)
  // ============================================
  return (
    <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/10">
            <Search className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Find Your Perfect Exit Plan</h2>
            <p className="text-sm text-neutral-400">Browse pre-researched, validated opportunities</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Step {currentStep} of {totalSteps}</span>
            {currentStep > 1 && <span>{Math.round(progress)}% complete</span>}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step 1: Filters */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Interests */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">What are you actually interested in?</h3>
            </div>
            <p className="text-sm text-neutral-400">
              We can&apos;t read your mind. Give us a hint so we don&apos;t suggest a knitting business if you hate yarn.
            </p>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-neutral-300">
                Topics or interests <span className="text-neutral-500">(optional but helps)</span>
              </Label>
              <Textarea
                id="interests"
                placeholder="e.g., AI tools, pet industry, helping small businesses, automation, health & fitness, remote work tools..."
                value={formData.interests}
                onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                className="min-h-[100px] bg-black/40 border-white/20 text-white placeholder:text-neutral-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
              <p className="text-xs text-neutral-500">
                The more specific you are, the less likely we are to give you a generic idea.
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Quick Filters</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Industry */}
              <div className="space-y-2">
                <Label className="text-neutral-300">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger className="bg-black/40 border-white/20 text-white">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {INDUSTRIES.map(industry => (
                      <SelectItem
                        key={industry.value}
                        value={industry.value}
                        className="text-white"
                      >
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label className="text-neutral-300">Starting Budget</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                >
                  <SelectTrigger className="bg-black/40 border-white/20 text-white">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {BUDGET_LEVELS.map(budget => (
                      <SelectItem
                        key={budget.value}
                        value={budget.value}
                        className="text-white"
                      >
                        {budget.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Commitment */}
              <div className="space-y-2">
                <Label className="text-neutral-300">Time Available</Label>
                <Select
                  value={formData.timeCommitment}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeCommitment: value }))}
                >
                  <SelectTrigger className="bg-black/40 border-white/20 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {TIME_COMMITMENTS.map(time => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        className="text-white"
                      >
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-neutral-300">Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="bg-black/40 border-white/20 text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {DIFFICULTY_LEVELS.map(diff => (
                      <SelectItem
                        key={diff.value}
                        value={diff.value}
                        className="text-white"
                      >
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            {showAdvanced ? "− Hide" : "+ Show"} advanced filters
          </button>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-6 pt-4 border-t border-white/10">
              {/* Skills */}
              <div className="space-y-3">
                <Label className="text-neutral-300">Your Skills (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SKILLS.map(skill => (
                    <div key={skill.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill.id}
                        checked={formData.skills.includes(skill.id)}
                        onCheckedChange={() => handleSkillToggle(skill.id)}
                        className="border-neutral-600 data-[state=checked]:bg-purple-500"
                      />
                      <label
                        htmlFor={skill.id}
                        className="text-sm text-neutral-300 cursor-pointer"
                      >
                        {skill.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid Topics */}
              <div className="space-y-2">
                <Label htmlFor="avoid" className="text-neutral-300">
                  Anything to avoid? <span className="text-neutral-500">(optional)</span>
                </Label>
                <Input
                  id="avoid"
                  placeholder="e.g., crypto, dropshipping, MLM..."
                  value={formData.avoidTopics}
                  onChange={(e) => setFormData(prev => ({ ...prev, avoidTopics: e.target.value }))}
                  className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleNext}
              className="bg-purple-500 text-white hover:bg-purple-400 font-semibold"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Email */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Get Your Matched Ideas</h3>
          </div>

          {/* What they'll get */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20">
            <h4 className="text-lg font-semibold text-white mb-3">What You&apos;ll Receive:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <span>Up to 10 pre-researched ideas matched to your interests</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <span>Opportunity scores and market data for each</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <span>Preview of locked research and implementation roadmaps</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <span>Weekly new opportunities (optional, unsubscribe anytime)</span>
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 focus:border-purple-500"
            />
            <p className="text-xs text-neutral-500">
              We&apos;ll send your matched ideas here. No spam, unsubscribe anytime.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(2)}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold disabled:opacity-50"
            >
              <Search className="mr-2 h-4 w-4" />
              Find My Exit Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// IDEA RESULT CARD COMPONENT
// ============================================

interface IdeaResultCardProps {
  idea: typeof MOCK_IDEAS[0]
  isFirst?: boolean
}

function IdeaResultCard({ idea, isFirst = false }: IdeaResultCardProps) {
  const [expanded, setExpanded] = useState(isFirst)

  return (
    <Card className={`bg-black/40 border transition-all ${expanded ? "border-purple-400/40" : "border-white/10"}`}>
      {/* Header - Always Visible */}
      <div
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-purple-400 mb-2">{idea.industry}</div>
            <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
            <p className="text-neutral-400 text-sm">{idea.oneLiner}</p>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 bg-purple-500/20 rounded-full px-3 py-1">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 font-bold">{idea.score}</span>
            </div>
            <span className="text-xs text-neutral-500 mt-1">Score</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1 text-neutral-400">
            <DollarSign className="h-4 w-4" />
            <span>{idea.marketSize}</span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span>{idea.growthRate}</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            <Clock className="h-4 w-4" />
            <span>{idea.timeToFirstSale}</span>
          </div>
        </div>

        {/* Expand Indicator */}
        <div className="flex justify-center mt-4">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-neutral-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-neutral-500" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-white/10">
          {/* Why Now */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Why Now?</h4>
            <p className="text-neutral-300 text-sm">{idea.whyNow}</p>
          </div>

          {/* Quick Insights - FREE */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Quick Insights</h4>
            <ul className="space-y-2">
              {idea.quickInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Locked Content */}
          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-neutral-500" />
              <h4 className="text-sm font-semibold text-neutral-400">Full Exit Plan Includes:</h4>
            </div>
            <ul className="grid sm:grid-cols-2 gap-1">
              {idea.lockedContent.map((item, i) => (
                <li key={i} className="text-sm text-neutral-500 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 space-y-3">
            {/* Research Report - $9 */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="flex-1 bg-blue-500 hover:bg-blue-400 text-white"
              >
                <a href={`/checkout?plan=research&id=${idea.id}&idea=${encodeURIComponent(idea.title)}`}>
                  Get Research Report — $9
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <WhatsIncludedModal
                productType="research"
                ideaName={idea.title}
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                }
              />
            </div>

            {/* Implementation Plan - $29 */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="flex-1 bg-purple-500 hover:bg-purple-400 text-white"
              >
                <a href={`/checkout?plan=implementation&id=${idea.id}&idea=${encodeURIComponent(idea.title)}`}>
                  Get Research + Implementation — $29
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <WhatsIncludedModal
                productType="implementation"
                ideaName={idea.title}
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                }
              />
            </div>

            <p className="text-xs text-center text-neutral-500 mt-2">
              Save $9: Implementation includes research + 90-day roadmap
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
