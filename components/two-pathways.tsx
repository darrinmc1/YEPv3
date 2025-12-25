"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Search, TestTube, Rocket } from "lucide-react"

export function TwoPathways() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-400">Choose Your Path</span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Where Are You <span className="text-blue-400">Right Now?</span>
        </h2>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Whether you need an idea, want to test one, or are ready to build — we&apos;ve got you covered.
        </p>
      </div>

      {/* 3 Route Cards */}
      <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
        
        {/* ROUTE 1: EXPLORE - I Need an Idea */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-purple-400/40 transition-all duration-300 h-full flex flex-col backdrop-blur-xl">
            {/* Icon */}
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-400/10 border border-purple-400/20">
                <Search className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  I Need an Idea
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Browse 1000+ pre-researched business opportunities
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">What You Get:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Curated weekly business ideas</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Market size & opportunity scores</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>Filter by industry, budget, skills</span>
                </li>
              </ul>
            </div>

            {/* Price Tag */}
            <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20 text-center">
              <p className="text-2xl font-bold text-purple-400">FREE</p>
            </div>

            {/* CTA */}
            <Button
              asChild
              className="w-full rounded-full bg-purple-500 px-6 py-5 text-base font-bold text-white hover:bg-purple-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] group"
            >
              <a href="/explore-ideas" className="flex items-center justify-center">
                <span>Find Me an Idea</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        {/* ROUTE 2: VALIDATE - I Have an Idea */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-blue-400/40 transition-all duration-300 h-full flex flex-col backdrop-blur-xl">
            {/* Icon */}
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400/10 border border-blue-400/20">
                <TestTube className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  I Have an Idea
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Test your idea with AI-powered validation
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">What You Get:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Instant validation score (1-10)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Market viability check</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>&quot;Worth pursuing?&quot; verdict</span>
                </li>
              </ul>
            </div>

            {/* Price Tag */}
            <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-400/20 text-center">
              <p className="text-2xl font-bold text-blue-400">FREE</p>
            </div>

            {/* CTA */}
            <Button
              asChild
              className="w-full rounded-full bg-blue-500 px-6 py-5 text-base font-bold text-white hover:bg-blue-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
            >
              <a href="/validate-idea" className="flex items-center justify-center">
                <span>Test My Idea</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        {/* ROUTE 3: BUILD - Ready to Launch */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-green-400/40 transition-all duration-300 h-full flex flex-col backdrop-blur-xl">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>

            {/* Icon */}
            <div className="flex flex-col items-center text-center gap-4 mb-6 mt-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400/10 border border-green-400/20">
                <Rocket className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ready to Launch
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Get a complete Exit Plan with everything you need
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">What You Get:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span>Complete market research (10+ pages)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span>Step-by-step action plan</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span>Templates & tools included</span>
                </li>
              </ul>
            </div>

            {/* Price Tag */}
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-400/20 text-center">
              <p className="text-2xl font-bold text-green-400">From $29</p>
            </div>

            {/* CTA */}
            <Button
              asChild
              className="w-full rounded-full bg-green-500 px-6 py-5 text-base font-bold text-white hover:bg-green-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] group"
            >
              <a href="#pricing" className="flex items-center justify-center">
                <span>Get My Exit Plan</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-12 text-center">
        <p className="text-neutral-500 text-sm max-w-2xl mx-auto">
          <span className="font-semibold text-neutral-300">Not sure where to start?</span>{" "}
          Try &quot;Find Me an Idea&quot; — it&apos;s free, and you can upgrade anytime.
        </p>
      </div>
    </section>
  )
}
