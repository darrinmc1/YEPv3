"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Zap, Clock, Mail, Lightbulb, Rocket, ArrowRight } from "lucide-react"

type Feature = { text: string; highlight?: boolean }

function FeatureItem({ text, highlight = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${highlight ? "text-green-400" : "text-blue-400"}`} />
      <span className={`text-sm ${highlight ? "text-white font-medium" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

export function Pricing() {
  const [purchasePath, setPurchasePath] = useState<"need-idea" | "have-idea">("need-idea")
  const [billingType, setBillingType] = useState<"one-time" | "subscription">("one-time")

  return (
    <section id="pricing" className="text-white">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-8">
          <div className="mx-auto mb-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-medium text-white border border-blue-400/30 bg-blue-400/10">
            <Zap className="mr-2 h-3 w-3 text-blue-400" />
            Simple Pricing
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get Your <span className="text-blue-400">Exit Plan</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-300">
            Whether you need an idea or have your own — we&apos;ve got the right plan for you.
          </p>
        </div>

        {/* Path Selection - Primary Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-2xl p-1.5 bg-neutral-800/80 border border-white/10">
            <button
              onClick={() => setPurchasePath("need-idea")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${purchasePath === "need-idea"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-neutral-400 hover:text-white"
                }`}
            >
              <Lightbulb className="h-4 w-4" />
              I Need an Idea
            </button>
            <button
              onClick={() => setPurchasePath("have-idea")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${purchasePath === "have-idea"
                  ? "bg-green-500 text-white shadow-lg"
                  : "text-neutral-400 hover:text-white"
                }`}
            >
              <Rocket className="h-4 w-4" />
              I Have My Own Idea
            </button>
          </div>
        </div>

        {/* Secondary Toggle - Billing Type */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full p-1 bg-neutral-800/50 border border-white/10">
            <button
              onClick={() => setBillingType("one-time")}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${billingType === "one-time"
                  ? "bg-white/10 text-white"
                  : "text-neutral-500 hover:text-white"
                }`}
            >
              One-Time Purchase
            </button>
            <button
              onClick={() => setBillingType("subscription")}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${billingType === "subscription"
                  ? "bg-white/10 text-white"
                  : "text-neutral-500 hover:text-white"
                }`}
            >
              Monthly Subscription
            </button>
          </div>
        </div>

        {/* ===================== */}
        {/* PATH A: NEED AN IDEA */}
        {/* ===================== */}
        {purchasePath === "need-idea" && billingType === "one-time" && (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-purple-400">
                Get pre-researched, AI-validated business ideas with full market analysis
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
              {/* Single Idea - $29 */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-purple-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                    Single Idea
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$29</div>
                    <span className="pb-1 text-sm text-neutral-400">one-time</span>
                  </div>
                  <p className="text-sm text-neutral-400">1 pre-researched Exit Plan</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    <a href="/checkout?plan=single-idea">Get Single Idea</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-3">What&apos;s Included:</p>
                  <ul className="grid gap-2.5">
                    {[
                      "1 AI-validated business idea",
                      "Full market research (10+ pages)",
                      "Competitor analysis (5 competitors)",
                      "Market size & growth data",
                      "Revenue model breakdown",
                      "Target customer profile",
                      "30-day quick-start checklist",
                      "Instant PDF download",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Idea Bundle - $49 */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border-2 border-purple-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <div className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-purple-500 text-white">
                  Best Value
                </div>
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                    Idea Bundle
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$49</div>
                    <span className="pb-1 text-sm text-neutral-400">one-time</span>
                  </div>
                  <p className="text-sm text-neutral-400">3 Exit Plans — pick your favorite</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-purple-500 text-white hover:bg-purple-400"
                  >
                    <a href="/checkout?plan=idea-bundle">Get Idea Bundle</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-3">What&apos;s Included:</p>
                  <ul className="grid gap-2.5">
                    {[
                      "3 AI-validated business ideas",
                      "Full market research for each",
                      "Competitor analysis (5+ per idea)",
                      "Compare & choose your favorite",
                      "90-day implementation roadmap",
                      "6 business templates",
                      "Revenue projections for each",
                      "Priority email support",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                  <div className="mt-6 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20">
                    <p className="text-xs text-neutral-400 text-center">
                      <span className="text-purple-400 font-semibold">Save $38</span> vs buying 3 separately
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ===================== */}
        {/* PATH B: HAVE MY OWN IDEA */}
        {/* ===================== */}
        {purchasePath === "have-idea" && billingType === "one-time" && (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-green-400">
                Implementation plans and tools to launch YOUR business idea
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
              {/* Quick Start - $29 */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-green-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                    Quick Start
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$29</div>
                    <span className="pb-1 text-sm text-neutral-400">one-time</span>
                  </div>
                  <p className="text-sm text-neutral-400">30-day action plan for your idea</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    <a href="/checkout?plan=quick-start">Get Quick Start</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-3">What&apos;s Included:</p>
                  <ul className="grid gap-2.5">
                    {[
                      "Personalized 30-day action plan",
                      "Week-by-week milestones",
                      "Daily task checklists",
                      "3 essential templates",
                      "Quick-start resource guide",
                      "Basic tech stack suggestions",
                      "Instant PDF download",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                  <div className="mt-4 p-2 rounded-lg bg-neutral-800/50 border border-white/10">
                    <p className="text-xs text-neutral-500 text-center">
                      Best for: Testing an idea quickly
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Launch System - $49 */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border-2 border-green-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <div className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-green-500 text-white">
                  Most Popular
                </div>
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Launch System
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$49</div>
                    <span className="pb-1 text-sm text-neutral-400">one-time</span>
                  </div>
                  <p className="text-sm text-neutral-400">90-day roadmap + full toolkit</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-green-500 text-white hover:bg-green-400"
                  >
                    <a href="/checkout?plan=launch-system">Get Launch System</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-3">What&apos;s Included:</p>
                  <ul className="grid gap-2.5">
                    {[
                      "Personalized 90-day roadmap",
                      "Week-by-week implementation guide",
                      "Daily action checklists",
                      "6 business templates",
                      "25 AI prompts for your business",
                      "Tech stack recommendations",
                      "Pricing strategy framework",
                      "Customer acquisition playbook",
                      "Email support",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                  <div className="mt-4 p-2 rounded-lg bg-green-500/10 border border-green-400/20">
                    <p className="text-xs text-neutral-400 text-center">
                      Best for: Serious launches
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Complete Build - $99 */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-blue-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Complete Build
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$99</div>
                    <span className="pb-1 text-sm text-neutral-400">one-time</span>
                  </div>
                  <p className="text-sm text-neutral-400">120-day system + advanced tools</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-blue-500 text-white hover:bg-blue-400"
                  >
                    <a href="/checkout?plan=complete-build">Get Complete Build</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-3">What&apos;s Included:</p>
                  <ul className="grid gap-2.5">
                    {[
                      "Everything in Launch System",
                      "Extended 120-day roadmap",
                      "7-day email launch sequence",
                      "Sales page copy templates",
                      "Social media content calendar",
                      "Competitor analysis framework",
                      "Financial projection templates",
                      "Legal checklist (LLC, contracts)",
                      "Scaling playbook (Month 4+)",
                      "Priority email support",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                  <div className="mt-4 p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs text-neutral-400 text-center">
                      Best for: Building to scale
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ===================== */}
        {/* SUBSCRIPTIONS - NEED IDEA */}
        {/* ===================== */}
        {purchasePath === "need-idea" && billingType === "subscription" && (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-purple-400">
                Fresh AI-validated business ideas delivered every month
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
              {/* Lite - $9/mo */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-purple-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                    Lite
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$9</div>
                    <span className="pb-1 text-sm text-neutral-400">/month</span>
                  </div>
                  <p className="text-sm text-neutral-400">1 new idea per month</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    <a href="/checkout?plan=lite-ideas">Start Lite</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5">
                    {[
                      "1 Exit Plan per month",
                      "Full market research",
                      "Competitor overview",
                      "Basic templates",
                      "Community access (read-only)",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pro - $29/mo */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border-2 border-purple-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <div className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-purple-500 text-white">
                  Popular
                </div>
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                    Pro
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$29</div>
                    <span className="pb-1 text-sm text-neutral-400">/month</span>
                  </div>
                  <p className="text-sm text-neutral-400">All ideas (4 per month)</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-purple-500 text-white hover:bg-purple-400"
                  >
                    <a href="/checkout?plan=pro-ideas">Start Pro</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5">
                    {[
                      "All 4 Exit Plans per month",
                      "Full market research each",
                      "Deep competitor analysis",
                      "Full template library",
                      "Community access (full)",
                      "Live monthly Q&A",
                      "Implementation guides",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Premium - $49/mo */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-blue-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Premium
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$49</div>
                    <span className="pb-1 text-sm text-neutral-400">/month</span>
                  </div>
                  <p className="text-sm text-neutral-400">Everything + personalized help</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-blue-500 text-white hover:bg-blue-400"
                  >
                    <a href="/checkout?plan=premium-ideas">Start Premium</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5">
                    {[
                      "Everything in Pro",
                      "Early access to new ideas",
                      "Monthly strategy review",
                      "Priority support (48hr)",
                      "Advanced frameworks",
                      "8 detailed case studies",
                      "Quarterly strategy call",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* ===================== */}
        {/* SUBSCRIPTIONS - HAVE IDEA */}
        {/* ===================== */}
        {purchasePath === "have-idea" && billingType === "subscription" && (
          <>
            <div className="text-center mb-8">
              <p className="text-sm text-green-400">
                Ongoing support and resources to build YOUR business
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
              {/* Builder Lite - $9/mo */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-green-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                    Builder Lite
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$9</div>
                    <span className="pb-1 text-sm text-neutral-400">/month</span>
                  </div>
                  <p className="text-sm text-neutral-400">Basic ongoing support</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    <a href="/checkout?plan=builder-lite">Start Builder Lite</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5">
                    {[
                      "Monthly template updates",
                      "Community access (read-only)",
                      "Monthly Q&A replay",
                      "Resource library access",
                      "Basic email support",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Builder Pro - $29/mo */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border-2 border-green-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <div className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-green-500 text-white">
                  Popular
                </div>
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Builder Pro
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$29</div>
                    <span className="pb-1 text-sm text-neutral-400">/month</span>
                  </div>
                  <p className="text-sm text-neutral-400">Full builder toolkit</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-green-500 text-white hover:bg-green-400"
                  >
                    <a href="/checkout?plan=builder-pro">Start Builder Pro</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5">
                    {[
                      "Full template library (15+)",
                      "New templates monthly",
                      "Community access (full)",
                      "Live monthly Q&A",
                      "AI prompt library (50+)",
                      "Progress tracking tools",
                      "Priority email support",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Builder Premium - $49/mo */}
              <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 transition-all duration-300 hover:border-blue-400/40">
                <CardHeader className="space-y-3 pb-4">
                  <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Builder Premium
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <div className="text-4xl font-bold tracking-tight">$49</div>
                    <span className="pb-1 text-sm text-neutral-400">/month</span>
                  </div>
                  <p className="text-sm text-neutral-400">Personalized guidance</p>
                  <Button
                    asChild
                    className="w-full rounded-full px-4 py-5 text-base font-semibold transition-all hover:scale-[1.02] bg-blue-500 text-white hover:bg-blue-400"
                  >
                    <a href="/checkout?plan=builder-premium">Start Builder Premium</a>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="grid gap-2.5">
                    {[
                      "Everything in Builder Pro",
                      "Monthly plan review (AI)",
                      "Personalized feedback",
                      "Priority support (48hr)",
                      "Advanced frameworks",
                      "Quarterly strategy call",
                      "Early access to new tools",
                    ].map((f, i) => (
                      <FeatureItem key={i} text={f} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Comparison Helper */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h4 className="font-semibold text-white mb-2">Not sure which to choose?</h4>
            <p className="text-sm text-neutral-400 mb-4">
              {purchasePath === "need-idea"
                ? "Start with a Single Idea ($29) to test the quality. Upgrade to Bundle if you want options."
                : "Start with Quick Start ($29) if you just need direction. Get Launch System ($49) if you're serious about launching."}
            </p>
            <Button asChild variant="link" className="text-blue-400 hover:text-blue-300">
              <a href="/explore-ideas">
                Or explore free ideas first →
              </a>
            </Button>
          </div>
        </div>

        {/* Coming Soon: Gold & Platinum */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Want More? <span className="text-amber-400">Gold & Platinum</span> Coming Soon
            </h3>
            <p className="text-neutral-400">
              Done-for-you implementation, 1-on-1 coaching, and exclusive partnerships
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Gold Waitlist */}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-center">
              <div className="inline-flex items-center gap-2 text-amber-400 mb-3">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Gold — Coming Soon</span>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                52-week guides, tech stacks, financial projections, hiring roadmaps
              </p>
              <Button
                asChild
                variant="outline"
                className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
              >
                <a href="/waitlist?tier=gold" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Join Gold Waitlist
                </a>
              </Button>
            </div>

            {/* Platinum Waitlist */}
            <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6 text-center">
              <div className="inline-flex items-center gap-2 text-purple-400 mb-3">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Platinum — Limited Spots</span>
              </div>
              <p className="text-sm text-neutral-400 mb-4">
                Exclusive idea rights, weekly calls, custom research, investor intros
              </p>
              <Button
                asChild
                variant="outline"
                className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
              >
                <a href="/waitlist?tier=platinum" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Apply for Platinum
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-neutral-400 text-sm">
            Questions?{" "}
            <a href="mailto:support@YourExitPlans.com" className="font-semibold text-blue-400 hover:underline">
              Email us
            </a>{" "}
            — we&apos;re happy to help you choose.
          </p>
        </div>
      </div>
    </section>
  )
}
