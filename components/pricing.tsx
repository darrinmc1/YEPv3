"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Crown, Zap } from "lucide-react"

type Feature = { text: string; muted?: boolean }

const ACCENT = "#3B82F6"

const rotatingWords = ["Success", "Growth", "Wealth", "Adventure"]

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-400" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

export function Pricing() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % rotatingWords.length)
        setOpacity(1)
      }, 500) // Corresponds to the duration of the fade-out transition
    }, 3000) // Change word every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="pricing" className="text-white" itemScope itemType="https://schema.org/PriceSpecification">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-medium text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", border: `1px solid ${ACCENT}` }}
          >
            <Zap className="mr-2 h-3 w-3" style={{ color: ACCENT }} />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" itemProp="name">
            Choose Your Path to{" "}
            <span
              key={currentIndex}
              className="text-blue-400 transition-opacity duration-500"
              style={{ opacity: opacity }}
            >
              {rotatingWords[currentIndex]}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-300" itemProp="description">
            From free weekly ideas to exclusive execution partnerships. Pick the level that fits your ambition.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* FREE Tier */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-blue-400/40"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider" itemProp="name">
                FREE
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-3xl font-bold tracking-tight" itemProp="price">
                  $0
                </div>
                <span className="pb-1 text-sm text-neutral-400">forever</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <Button
                asChild
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all"
                style={{ backgroundColor: "#262626", color: "#ffffff", border: "1px solid #404040" }}
              >
                <a href="#signup">Get Started Free</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-neutral-400 mb-4">Perfect for exploring opportunities</p>
              <ul className="grid gap-2.5" itemProp="description">
                {[
                  "Weekly email with idea outline",
                  "Opportunity score breakdown",
                  "Market size & growth data",
                  "\"Why Now?\" timing analysis",
                  "Difficulty rating",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Basic - $25 */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-blue-400/40"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider" itemProp="name">
                Starter
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-3xl font-bold tracking-tight" itemProp="price">
                  $25
                </div>
                <span className="pb-1 text-sm text-neutral-400">per idea</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <Button
                asChild
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{ backgroundColor: ACCENT, color: "#000000" }}
              >
                <a href="#contact">Buy Single Idea</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-neutral-400 mb-4">Self-guided deep dive on one opportunity</p>
              <ul className="grid gap-2.5" itemProp="description">
                {[
                  "Full 3-5 page analysis report",
                  "Target customer profiles",
                  "Competitive landscape (3-5 competitors)",
                  "Revenue model options",
                  "Reddit sentiment + Google Trends",
                  "Startup cost estimates",
                  "Quick-start 10-step checklist",
                  "Instant access after payment",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Silver - $99/quarter */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-blue-400/40"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <div
              className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: "#1f1f1f", color: ACCENT }}
            >
              Best Value
            </div>
            <CardHeader className="space-y-3 pb-4">
              <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider" itemProp="name">
                Silver
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-3xl font-bold tracking-tight" itemProp="price">
                  $99
                </div>
                <span className="pb-1 text-sm text-neutral-400">/quarter</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <Button
                asChild
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{ backgroundColor: ACCENT, color: "#000000" }}
              >
                <a href="#contact">Subscribe Now</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-neutral-400 mb-4">All ideas for 3 months (~12-13 ideas)</p>
              <ul className="grid gap-2.5" itemProp="description">
                {[
                  "Everything in Starter for ALL ideas",
                  "Detailed 10+ competitor analysis",
                  "Go-to-market strategy outline",
                  "Customer acquisition by channel",
                  "First 90-day execution roadmap",
                  "Risk analysis + mitigation",
                  "5-year market trends",
                  "Framework scoring (Value Eq, A.C.P.)",
                  "SEO keyword opportunities",
                ].map((f, i) => (
                  <FeatureItem key={i} text={f} />
                ))}
              </ul>
            </CardContent>
            <CardFooter />
          </Card>
        </div>

        {/* Gold & Platinum - Full Width Cards */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Gold - $249/month */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass-enhanced border border-blue-400/30 shadow-[0_12px_40px_rgba(198,255,58,0.15)] transition-all duration-300 hover:shadow-[0_16px_50px_rgba(198,255,58,0.25)]"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" style={{ color: ACCENT }} />
                <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider" itemProp="name">
                  Gold
                </div>
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-3xl font-bold tracking-tight" itemProp="price">
                  $249
                </div>
                <span className="pb-1 text-sm text-neutral-400">/month</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <Button
                asChild
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{ backgroundColor: ACCENT, color: "#000000" }}
              >
                <a href="#contact">Go Gold</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-neutral-400 mb-4">Everything + complete implementation blueprints</p>
              <div className="grid gap-2.5 md:grid-cols-2" itemProp="description">
                <ul className="space-y-2.5">
                  {[
                    "Everything in Silver",
                    "52-week implementation guide",
                    "Tech stack recommendations",
                    "Hiring roadmap + job descriptions",
                    "Financial projections (3 scenarios)",
                  ].map((f, i) => (
                    <FeatureItem key={i} text={f} />
                  ))}
                </ul>
                <ul className="space-y-2.5">
                  {[
                    "12-month P&L + break-even",
                    "Legal/regulatory checklists",
                    "Partnership/supplier leads",
                    "Pricing strategy workshop",
                    "Sales playbook + scripts",
                  ].map((f, i) => (
                    <FeatureItem key={i} text={f} />
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter />
          </Card>

          {/* Platinum - $999/month + 10% */}
          <Card
            className="relative overflow-hidden rounded-2xl liquid-glass-enhanced border-2 border-blue-400 shadow-[0_16px_50px_rgba(198,255,58,0.25)] transition-all duration-300"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <div
              className="absolute right-0 top-0 rounded-bl-2xl px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: ACCENT, color: "#000000" }}
            >
              Only 10 Slots
            </div>
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" style={{ color: ACCENT }} />
                <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Platinum Partnership
                </div>
              </div>
              <div className="flex items-end gap-2 text-white">
                <div className="text-3xl font-bold tracking-tight" itemProp="price">
                  $999
                </div>
                <span className="pb-1 text-sm text-neutral-400">/month</span>
                <meta itemProp="priceCurrency" content="USD" />
              </div>
              <Button
                asChild
                className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: ACCENT, color: "#000000" }}
              >
                <a href="#contact">Apply for Platinum</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs mb-4" style={{ color: ACCENT }}>
                Exclusive rights + weekly strategic check-ins (6-month minimum)
              </p>
              <div className="grid gap-2.5 md:grid-cols-2" itemProp="description">
                <ul className="space-y-2.5">
                  {[
                    "Everything in Gold",
                    "EXCLUSIVE: Idea removed from public access",
                    "Personalized strategy calls",
                    "Priority email support (SLA)",
                    "Custom market research on demand",
                  ].map((f, i) => (
                    <FeatureItem key={i} text={f} />
                  ))}
                </ul>
                <ul className="space-y-2.5">
                  {[
                    "Introductions to developers/agencies",
                    "Investor database access",
                    "Custom pitch deck template",
                    "Monthly competitive intelligence",
                    "Pivot recommendations",
                  ].map((f, i) => (
                    <FeatureItem key={i} text={f} />
                  ))}
                </ul>
              </div>
              <div className="mt-4 rounded-lg bg-black/40 p-3 border border-blue-400/30">
                <p className="text-xs text-neutral-300">
                  <span className="font-semibold" style={{ color: ACCENT }}>
                    First-come, first-served.
                  </span>{" "}
                  When you claim an idea, no one else can access it. Build with exclusive market advantage.
                </p>
              </div>
            </CardContent>
            <CardFooter />
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-neutral-400 text-sm">
            Not sure which plan? Start with{" "}
            <a href="#signup" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              FREE weekly ideas
            </a>{" "}
            and upgrade anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
