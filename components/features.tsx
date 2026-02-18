"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, Target, Rocket, Database, CheckCircle } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Stop Researching. <span className="text-blue-400">Start Launching.</span>
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Seriously, stop researching. We transform market signals into validated, actionable business opportunities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {/* Feature 1: AI Market Analysis */}
        <Card className="liquid-glass border border-white/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">AI-Powered Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300">
              We read the entire internet so you don't have to. Our AI scans Reddit, Trends, and G2 to find what people actually want to buy.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Sentiment analysis from 10+ data sources</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Competitor gap identification</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Market timing validation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Feature 2: Validated Opportunities */}
        <Card className="liquid-glass border border-white/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">Pre-Validated Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300">
              We score ideas like a strict university professor. If it's not a 9/10, you won't see it so don't ask.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Market size & growth data</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Revenue potential projections</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Difficulty ratings for founders</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Feature 3: Implementation Guides */}
        <Card className="liquid-glass border border-white/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
              <Rocket className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">Step-by-Step Roadmaps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300">
              A daily to-do list that treats you like a focused CEO, not a confused intern.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>No-code to custom build paths</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Week-by-week action plans</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Legal & compliance checklists</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Feature 4: Market Timing */}
        <Card className="liquid-glass border border-white/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">Perfect Timing Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300">
              Catch the wave before it crashes. We track trends so you don't launch a crypto exchange in 2022.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>90-day trend momentum tracking</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Regulatory & tech catalysts</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Saturation risk assessment</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Feature 5: Data Sources */}
        <Card className="liquid-glass border border-white/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
              <Database className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-xl text-white">Multi-Source Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300">
              Aggregate insights from Reddit, Twitter, Google Trends, G2, Facebook Groups, and more
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Real user pain points & sentiment</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Community size & engagement</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Keyword search volume data</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Feature 6: Business Frameworks */}
        <Card className="liquid-glass border border-white/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <CardTitle className="text-xl text-white">Proven Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-300">
              Apply battle-tested frameworks: Value Equation, A.C.P., Market Matrix, Value Ladder
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Audience/Community/Product fit</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Revenue progression models</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-neutral-400">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Competitive positioning</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* How It Works Section */}
      <div className="mt-20">
        <h3 className="text-center text-3xl font-bold text-white mb-12">
          How It <span className="text-blue-400">Works</span>
        </h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-400/10 text-2xl font-bold text-blue-400">
              1
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">AI Discovers Opportunities</h4>
            <p className="text-sm text-neutral-400">
              Our AI scans Reddit, Twitter, Google Trends, and 10+ data sources to identify emerging market gaps and
              untapped demand
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-400/10 text-2xl font-bold text-blue-400">
              2
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Deep Validation & Analysis</h4>
            <p className="text-sm text-neutral-400">
              Every idea gets a full market report with competitor analysis, revenue models, and execution difficulty
              ratings
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-400/10 text-2xl font-bold text-blue-400">
              3
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Launch With Confidence</h4>
            <p className="text-sm text-neutral-400">
              Get step-by-step roadmaps, tech stacks, and implementation guides to go from idea to revenue in weeks
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
