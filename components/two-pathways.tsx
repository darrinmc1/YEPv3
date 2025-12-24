"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lightbulb, Rocket, CheckCircle2, Crown, Zap, ArrowRight, Search, TestTube, Hammer } from "lucide-react"
import { IdeasPricingModal } from "@/components/ideas-pricing-modal"
import { ImplementationPricingModal } from "@/components/implementation-pricing-modal"

export function TwoPathways() {
  const [ideasOpen, setIdeasOpen] = useState(false)
  const [implementationOpen, setImplementationOpen] = useState(false)

  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-400">Choose Your Route</span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Three Routes to <span className="text-blue-400">Your Exit Plan</span>
        </h2>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Whether you need inspiration, validation, or a full roadmap—start here.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3 max-w-7xl mx-auto">
        {/* ROUTE 1: EXPLORE */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-purple-400/40 transition-all duration-300 h-full flex flex-col backdrop-blur-xl">
            {/* Icon and Title Header */}
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 border border-purple-400/20">
                <Search className="h-7 w-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Explore Ideas
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  See what's possible—no commitment
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>AI-generated sample business idea</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Market overview & opportunity score</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Revenue model basics</span>
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20 text-center">
              <p className="text-2xl font-bold text-purple-400">FREE</p>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              className="w-full rounded-full bg-purple-500 px-6 py-5 text-base font-bold text-white hover:bg-purple-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] group"
            >
              <a href="/sample-idea" className="flex items-center justify-center">
                <span>Generate Sample Idea</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        {/* ROUTE 2: VALIDATE */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-green-400/40 transition-all duration-300 h-full flex flex-col backdrop-blur-xl">
            {/* Icon and Title Header */}
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400/10 border border-green-400/20">
                <TestTube className="h-7 w-7 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Validate Your Idea
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Get a free preview, upgrade for full report
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Free Preview:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span>Opportunity score (1-10)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span>Basic market viability</span>
                </li>
              </ul>
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 mt-4">Upgrade to $29:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-green-400/60 shrink-0 mt-0.5" />
                  <span>Full validation report</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-green-400/60 shrink-0 mt-0.5" />
                  <span>Competitor analysis</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-green-400/60 shrink-0 mt-0.5" />
                  <span>Revenue projections & PDF</span>
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-400/20 text-center">
              <p className="text-2xl font-bold text-green-400">FREE</p>
              <p className="text-xs text-neutral-400 mt-1">to start</p>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              className="w-full rounded-full bg-green-500 px-6 py-5 text-base font-bold text-white hover:bg-green-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] group"
            >
              <a href="/validate-idea" className="flex items-center justify-center">
                <span>Start Free</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        {/* ROUTE 3: BUILD */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-blue-400/40 transition-all duration-300 h-full flex flex-col backdrop-blur-xl">
            {/* Icon and Title Header */}
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/10 border border-blue-400/20">
                <Hammer className="h-7 w-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Build Your Business
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  See the roadmap outline, pay to unlock
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Free Outline:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Week-by-week milestone preview</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Sample day-1 action items</span>
                </li>
              </ul>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 mt-4">Unlock for $29-$49:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400/60 shrink-0 mt-0.5" />
                  <span>Full 30/60/90/120-day plans</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400/60 shrink-0 mt-0.5" />
                  <span>Daily action checklists</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-400/60 shrink-0 mt-0.5" />
                  <span>Tech stack & templates</span>
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-400/20 text-center">
              <p className="text-2xl font-bold text-blue-400">FREE</p>
              <p className="text-xs text-neutral-400 mt-1">to start</p>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              className="w-full rounded-full bg-blue-500 px-6 py-5 text-base font-bold text-white hover:bg-blue-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
            >
              <a href="/build" className="flex items-center justify-center">
                <span>Start Free</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-16 text-center">
        <p className="text-neutral-500 text-sm max-w-2xl mx-auto">
          <span className="font-semibold text-neutral-300">All routes start FREE.</span> Try any path risk-free—see a sample idea, get your opportunity score, or preview your roadmap.
          <br className="hidden sm:block" />
          Only pay if you want the full breakdown. No credit card required to start.
        </p>
      </div>
    </section>
  )
}
