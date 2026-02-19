"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Target,
  Zap,
  BookOpen,
  Mail
} from "lucide-react"

// ============================================
// TYPES
// ============================================

interface ValidationResult {
  ideaName: string
  score: number
  verdict: "strong" | "moderate" | "weak"
  summary: string
  marketSize: string
  growthRate: string
  competition: "low" | "medium" | "high"
  timing: "perfect" | "good" | "challenging"
  quickInsights: string[]
  concerns: string[]
  lockedContent: {
    competitors: number
    revenueModels: number
    marketingChannels: number
  }
}

interface ExploreResult {
  id: string
  title: string
  oneLiner: string
  industry: string
  score: number
  marketSize: string
  growthRate: string
  difficulty: string
  timeToFirstSale: string
  whyNow: string
  quickInsights: string[]
  lockedContent: string[]
}

// ============================================
// VALIDATION RESULTS COMPONENT
// ============================================

interface ValidationResultsProps {
  result: ValidationResult
  userEmail: string
  onReset: () => void
}

export function ValidationResults({ result, userEmail, onReset }: ValidationResultsProps) {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "strong": return "text-green-400"
      case "moderate": return "text-yellow-400"
      case "weak": return "text-red-400"
      default: return "text-blue-400"
    }
  }

  const getVerdictBg = (verdict: string) => {
    switch (verdict) {
      case "strong": return "bg-green-400/10 border-green-400/20"
      case "moderate": return "bg-yellow-400/10 border-yellow-400/20"
      case "weak": return "bg-red-400/10 border-red-400/20"
      default: return "bg-blue-400/10 border-blue-400/20"
    }
  }

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case "strong": return "Strong Opportunity"
      case "moderate": return "Worth Exploring"
      case "weak": return "Needs Work"
      default: return "Analysis Complete"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Score */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-4 ${getVerdictBg(result.verdict)}`}>
          <CheckCircle2 className={`h-4 w-4 ${getVerdictColor(result.verdict)}`} />
          <span className={`text-sm font-medium ${getVerdictColor(result.verdict)}`}>
            {getVerdictText(result.verdict)}
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">{result.ideaName}</h2>
        <p className="text-neutral-400">{result.summary}</p>
      </div>

      {/* Main Score Card */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-white">Opportunity Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className={`text-6xl font-bold mb-2 ${getVerdictColor(result.verdict)}`}>
              {result.score}<span className="text-2xl text-neutral-500">/10</span>
            </div>
            <Progress value={result.score * 10} className="w-full max-w-md h-3 mb-4" />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <DollarSign className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-neutral-400">Market Size</div>
                <div className="font-semibold text-white">{result.marketSize}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <div className="text-sm text-neutral-400">Growth</div>
                <div className="font-semibold text-white">{result.growthRate}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <Users className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <div className="text-sm text-neutral-400">Competition</div>
                <div className="font-semibold text-white capitalize">{result.competition}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <Clock className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                <div className="text-sm text-neutral-400">Timing</div>
                <div className="font-semibold text-white capitalize">{result.timing}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights - FREE */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-green-400" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.quickInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-amber-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              Things to Consider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.concerns.map((concern, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  {concern}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* LOCKED CONTENT - Upsell */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-400" />
            Unlock Your Full Implementation Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-300 mb-6">
            You&apos;ve validated your idea. Now get everything you need to launch it.
          </p>
          
          {/* What's Locked */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{result.lockedContent.competitors}</div>
              <div className="text-sm text-neutral-400">Competitor Profiles</div>
              <div className="text-xs text-neutral-500">with weaknesses & gaps</div>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{result.lockedContent.revenueModels}</div>
              <div className="text-sm text-neutral-400">Revenue Models</div>
              <div className="text-xs text-neutral-500">with pricing strategies</div>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{result.lockedContent.marketingChannels}</div>
              <div className="text-sm text-neutral-400">Marketing Channels</div>
              <div className="text-xs text-neutral-500">ranked by ROI</div>
            </div>
          </div>

          {/* Upsell Options */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-black/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">Quick Start</h4>
                  <p className="text-xs text-neutral-400">30-day action plan</p>
                </div>
                <div className="text-xl font-bold text-white">$29</div>
              </div>
              <ul className="space-y-1 mb-4">
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  30-day implementation roadmap
                </li>
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  Daily task checklists
                </li>
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  3 essential templates
                </li>
              </ul>
              <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white">
                <a href={`/checkout?plan=quick-start&idea=${encodeURIComponent(result.ideaName)}`}>
                  Get Quick Start
                </a>
              </Button>
            </div>

            <div className="p-4 rounded-xl border-2 border-green-400/50 bg-green-500/5 relative">
              <div className="absolute -top-2 right-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                RECOMMENDED
              </div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">Launch System</h4>
                  <p className="text-xs text-neutral-400">90-day complete toolkit</p>
                </div>
                <div className="text-xl font-bold text-green-400">$49</div>
              </div>
              <ul className="space-y-1 mb-4">
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  90-day implementation roadmap
                </li>
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  Full competitor analysis
                </li>
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  25 AI prompts + 6 templates
                </li>
                <li className="text-xs text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  Marketing playbook
                </li>
              </ul>
              <Button asChild className="w-full bg-green-500 hover:bg-green-400 text-white">
                <a href={`/checkout?plan=launch-system&idea=${encodeURIComponent(result.ideaName)}`}>
                  Get Launch System
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation */}
      <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
        <Mail className="h-8 w-8 text-blue-400 mx-auto mb-3" />
        <h4 className="font-semibold text-white mb-2">Results Sent to Your Email</h4>
        <p className="text-sm text-neutral-400 mb-4">
          We&apos;ve sent a copy of this validation to <span className="text-white">{userEmail}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onReset} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Validate Another Idea
          </Button>
          <Button asChild variant="link" className="text-blue-400">
            <a href="/explore-ideas">Or explore our pre-researched ideas →</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// EXPLORE RESULTS COMPONENT
// ============================================

interface ExploreResultsProps {
  results: ExploreResult[]
  userEmail: string
  filters: {
    industry?: string
    budget?: string
    interests?: string
  }
  onReset: () => void
}

export function ExploreResults({ results, userEmail, filters, onReset }: ExploreResultsProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 mb-4">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">Ideas Found</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Your Matched Exit Plans</h2>
        <p className="text-neutral-400">
          Found <span className="text-purple-400 font-semibold">{results.length} ideas</span> matching your interests
        </p>
        
        {filters.interests && (
          <p className="text-sm text-neutral-500 mt-2">
            Based on: &quot;{filters.interests}&quot;
          </p>
        )}
      </div>

      {/* Results Cards */}
      <div className="space-y-6">
        {results.map((idea, index) => (
          <ExploreIdeaCard key={idea.id} idea={idea} isFirst={index === 0} />
        ))}
      </div>

      {/* Bundle Upsell */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30">
        <CardContent className="p-8 text-center">
          <Zap className="h-10 w-10 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Want All {results.length}?</h3>
          <p className="text-neutral-300 mb-6">
            Get the Idea Bundle — {results.length} complete Exit Plans for the price of 2
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-400 text-white">
              <a href="/checkout?plan=idea-bundle">
                Get Idea Bundle — $49
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          
          <p className="text-xs text-neutral-500">
            Save ${(results.length * 29) - 49} vs buying separately
          </p>
        </CardContent>
      </Card>

      {/* Email Confirmation */}
      <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
        <Mail className="h-8 w-8 text-purple-400 mx-auto mb-3" />
        <h4 className="font-semibold text-white mb-2">Ideas Sent to Your Email</h4>
        <p className="text-sm text-neutral-400 mb-4">
          We&apos;ve sent these matches to <span className="text-white">{userEmail}</span>
          <br />Plus, you&apos;ll get new ideas weekly (unsubscribe anytime).
        </p>
        <Button onClick={onReset} variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Search Again with Different Filters
        </Button>
      </div>
    </div>
  )
}

// ============================================
// SINGLE IDEA CARD (for Explore Results)
// ============================================

interface ExploreIdeaCardProps {
  idea: ExploreResult
  isFirst?: boolean
}

function ExploreIdeaCard({ idea, isFirst = false }: ExploreIdeaCardProps) {
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
            <ul className="space-y-1">
              {idea.lockedContent.map((item, i) => (
                <li key={i} className="text-sm text-neutral-500 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button 
              asChild
              className="flex-1 bg-purple-500 hover:bg-purple-400 text-white"
            >
              <a href={`/checkout?plan=single-idea&id=${idea.id}`}>
                Get Full Exit Plan — $29
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Save for Later
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Need to import useState at the top for ExploreIdeaCard
import { useState } from "react"
