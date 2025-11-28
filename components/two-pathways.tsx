"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lightbulb, Rocket, CheckCircle2, Crown, Zap, ArrowRight } from "lucide-react"
import { IdeasPricingModal } from "@/components/ideas-pricing-modal"
import { ImplementationPricingModal } from "@/components/implementation-pricing-modal"

export function TwoPathways() {
  const [ideasOpen, setIdeasOpen] = useState(false)
  const [implementationOpen, setImplementationOpen] = useState(false)

  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          <span className="text-xs uppercase tracking-wider text-blue-400">Choose Your Path</span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Two Ways to <span className="text-blue-400">Build Your Business</span>
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Need a validated business idea? Or ready to launch the one you have?
        </p>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mt-2">
          Choose your pathway below.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        {/* IDEAS PATHWAY */}
        <div className="relative group">
          <div className="liquid-glass border border-white/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 h-full flex flex-col">
            {/* Icon and Title Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-400/10 shrink-0">
                <Lightbulb className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Need a Business Idea?
              </h3>
            </div>
            <p className="text-neutral-300 mb-6">
              Get AI-validated business opportunities with deep market research, competitor analysis, and revenue models.
            </p>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">What You Get:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Weekly validated business opportunities</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Deep market analysis & competitor research</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Revenue models & financial projections</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Implementation roadmaps (Gold tier+)</span>
                </li>
              </ul>
            </div>

            {/* Pricing Preview */}
            <div className="mb-6 p-4 rounded-lg bg-black/40 border border-white/10">
              <p className="text-xs text-neutral-400 mb-2">5 Tiers Available:</p>
              <div className="flex items-center gap-2 text-sm text-white">
                <span className="font-semibold">FREE</span>
                <span className="text-neutral-500">•</span>
                <span>$25</span>
                <span className="text-neutral-500">•</span>
                <span>$99/qtr</span>
                <span className="text-neutral-500">•</span>
                <span>$249/mo</span>
                <span className="text-neutral-500">•</span>
                <span>$999/mo</span>
              </div>
            </div>

            {/* CTA Button */}
            <Dialog open={ideasOpen} onOpenChange={setIdeasOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full rounded-full bg-blue-500 px-6 py-6 text-base font-semibold text-black hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(59,130,246,0.3)] group"
                >
                  <span>Explore Business Ideas</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl sm:max-w-6xl lg:max-w-7xl max-h-[90vh] overflow-y-auto liquid-glass border-blue-400/30">
                <IdeasPricingModal onClose={() => setIdeasOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* IMPLEMENTATION PATHWAY */}
        <div className="relative group">
          <div className="liquid-glass border border-white/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 h-full flex flex-col">
            {/* Icon and Title Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-400/10 shrink-0">
                <Rocket className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Ready to Launch Your Idea?
              </h3>
            </div>
            <p className="text-neutral-300 mb-6">
              Get step-by-step daily action plans to launch YOUR idea.
            </p>

            {/* What You Get */}
            <div className="mb-6 space-y-3 flex-grow">
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">What You Get:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Daily action plans for 30-120 days</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Week-by-week roadmaps & checklists</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Tech stack recommendations & templates</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Works with YOUR idea OR our ideas</span>
                </li>
              </ul>
            </div>

            {/* Pricing Preview */}
            <div className="mb-6 p-4 rounded-lg bg-black/40 border border-white/10">
              <p className="text-xs text-neutral-400 mb-2">4 Tiers Available:</p>
              <div className="flex items-center gap-2 text-sm text-white">
                <span>$25/mo or $99</span>
                <span className="text-neutral-500">•</span>
                <span>$50/mo or $198</span>
                <span className="text-neutral-500">•</span>
                <span>$75/mo or $297</span>
                <span className="text-neutral-500">•</span>
                <span>$199/mo</span>
              </div>
            </div>

            {/* CTA Button */}
            <Dialog open={implementationOpen} onOpenChange={setImplementationOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full rounded-full bg-blue-500 px-6 py-6 text-base font-semibold text-black hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(59,130,246,0.3)] group"
                >
                  <span>Get Launch Roadmap</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl sm:max-w-6xl lg:max-w-7xl max-h-[90vh] overflow-y-auto liquid-glass border-blue-400/30">
                <ImplementationPricingModal onClose={() => setImplementationOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-12 text-center">
        <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
          <span className="font-semibold text-blue-400">Not sure which path?</span> Start with our FREE weekly business ideas to explore opportunities, 
          then upgrade to implementation when you&apos;re ready to launch.
        </p>
      </div>
    </section>
  )
}
