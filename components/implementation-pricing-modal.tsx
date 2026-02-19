"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Crown } from "lucide-react"

const ACCENT = "#3B82F6"

type Feature = { text: string; muted?: boolean }

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-400" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

interface ImplementationPricingModalProps {
  onClose: () => void
}

export function ImplementationPricingModal({ onClose }: ImplementationPricingModalProps) {
  const [paymentType, setPaymentType] = useState<"monthly" | "onetime">("onetime")

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">
          Invest in Your &apos;Quit Day&apos;
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto mb-6">
          Cheaper than an MBA, faster than trial-and-error, and actually useful.
        </p>

        {/* Payment Toggle */}
        <div className="inline-flex items-center gap-1 rounded-full p-1 liquid-glass border border-white/20">
          <button
            onClick={() => setPaymentType("onetime")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${paymentType === "onetime"
              ? "bg-blue-500 text-black shadow-lg"
              : "text-neutral-400 hover:text-white"
              }`}
          >
            One-Time Payment
          </button>
          <button
            onClick={() => setPaymentType("monthly")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${paymentType === "monthly"
              ? "bg-blue-500 text-black shadow-lg"
              : "text-neutral-400 hover:text-white"
              }`}
          >
            Monthly
          </button>
        </div>
        {paymentType === "monthly" && (
          <p className="text-xs text-neutral-500 mt-2">
            Get plans month-by-month over 4 months
          </p>
        )}
        {paymentType === "onetime" && (
          <p className="text-xs text-neutral-500 mt-2">
            Get all 120 days of plans immediately
          </p>
        )}
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Starter Tier */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20">
          <CardHeader className="space-y-3 pb-4">
            <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
              Starter
            </div>
            <div className="flex items-end gap-2 text-white">
              {paymentType === "onetime" ? (
                <>
                  <div className="text-3xl font-bold tracking-tight">$99</div>
                  <span className="pb-1 text-sm text-neutral-400">one-time</span>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold tracking-tight">$25</div>
                  <span className="pb-1 text-sm text-neutral-400">/month × 4</span>
                </>
              )}
            </div>
            <Button
              asChild
              className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT, color: "#000000" }}
            >
              <Link href="#contact">Get Started</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-neutral-400 mb-4">
              Perfect for dipping your toe in without losing a foot (30-day plan).
            </p>
            <ul className="grid gap-2.5">
              {[
                "Core daily action items",
                "Foundation & setup week-by-week",
                "Essential checklists",
                "Basic tech stack recommendations",
                "Self-guided implementation",
                "Works with ANY idea (yours or ours)",
              ].map((f, i) => (
                <FeatureItem key={i} text={f} />
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Silver Tier */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20">
          <div
            className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "#1f1f1f", color: ACCENT }}
          >
            Best Value
          </div>
          <CardHeader className="space-y-3 pb-4">
            <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
              Silver
            </div>
            <div className="flex items-end gap-2 text-white">
              {paymentType === "onetime" ? (
                <>
                  <div className="text-3xl font-bold tracking-tight">$198</div>
                  <span className="pb-1 text-sm text-neutral-400">one-time</span>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold tracking-tight">$50</div>
                  <span className="pb-1 text-sm text-neutral-400">/month × 4</span>
                </>
              )}
            </div>
            <Button
              asChild
              className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT, color: "#000000" }}
            >
              <Link href="#contact">Get Silver</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-neutral-400 mb-4">
              The &quot;I&apos;m actually doing this&quot; package (90-day plan).
            </p>
            <ul className="grid gap-2.5">
              {[
                "Everything in Starter",
                "Detailed 90-day roadmap",
                "Weekly strategy guidance",
                "Marketing & growth frameworks",
                "Customer acquisition strategies",
                "Pricing & positioning guides",
                "Weekly email support",
              ].map((f, i) => (
                <FeatureItem key={i} text={f} />
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Gold Tier */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass-enhanced border border-blue-400/30">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" style={{ color: ACCENT }} />
              <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                Gold
              </div>
            </div>
            <div className="flex items-end gap-2 text-white">
              {paymentType === "onetime" ? (
                <>
                  <div className="text-3xl font-bold tracking-tight">$297</div>
                  <span className="pb-1 text-sm text-neutral-400">one-time</span>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold tracking-tight">$75</div>
                  <span className="pb-1 text-sm text-neutral-400">/month × 4</span>
                </>
              )}
            </div>
            <Button
              asChild
              className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT, color: "#000000" }}
            >
              <Link href="#contact">Go Gold</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-neutral-400 mb-4">
              The complete toolkit. No excuses left (120-day plan).
            </p>
            <ul className="grid gap-2.5">
              {[
                "Everything in Silver",
                "Complete 120-day roadmap",
                "Regional market customization",
                "Financial modeling templates",
                "Hiring & team building guides",
                "Legal & compliance checklists",
                "Tech stack decision trees",
                "Priority email support",
                "Personalized milestone tracking",
              ].map((f, i) => (
                <FeatureItem key={i} text={f} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Platinum - Full Width */}
      <Card className="relative overflow-hidden rounded-2xl liquid-glass-enhanced border-2 border-blue-400 mb-6">
        <div
          className="absolute right-0 top-0 rounded-bl-2xl px-4 py-2 text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: ACCENT, color: "#000000" }}
        >
          White-Glove Service
        </div>
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" style={{ color: ACCENT }} />
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              Platinum Partnership
            </div>
          </div>
          <div className="flex items-end gap-2 text-white">
            {paymentType === "onetime" ? (
              <>
                <div className="text-3xl font-bold tracking-tight">$999</div>
                <span className="pb-1 text-sm text-neutral-400">/6 months</span>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight">$199</div>
                <span className="pb-1 text-sm text-neutral-400">/month × 6</span>
              </>
            )}
          </div>
          <Button
            asChild
            className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: ACCENT, color: "#000000" }}
          >
            <Link href="#contact">Apply for Platinum</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs mb-4" style={{ color: ACCENT }}>
            We basically co-found the company with you. Serious builders only.
          </p>
          <div className="grid gap-2.5 md:grid-cols-2">
            <ul className="space-y-2.5">
              {[
                "Everything in Gold",
                "Weekly 1-on-1 check-in calls",
                "Regional partnership introductions",
                "Custom market research",
                "Dedicated implementation support",
              ].map((f, i) => (
                <FeatureItem key={i} text={f} />
              ))}
            </ul>
            <ul className="space-y-2.5">
              {[
                "Priority response (24hr SLA)",
                "Custom templates & resources",
                "Investor intro database",
                "Pivot & strategy recommendations",
                "Monthly progress reviews",
              ].map((f, i) => (
                <FeatureItem key={i} text={f} />
              ))}
            </ul>
          </div>
          <div className="mt-4 rounded-lg bg-black/40 p-3 border border-blue-400/30">
            <p className="text-xs text-neutral-300">
              <span className="font-semibold" style={{ color: ACCENT }}>
                Serious builders only.
              </span>{" "}
              Get hands-on support to launch faster with weekly strategic guidance and regional partnerships.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Note */}
      <div className="text-center">
        <p className="text-neutral-400 text-sm mb-4">
          <span className="font-semibold" style={{ color: ACCENT }}>Works with YOUR idea or OURS.</span>{" "}
          Already have a business idea? Use these plans to launch it. Need an idea first?{" "}
          <button
            onClick={onClose}
            className="font-semibold hover:underline"
            style={{ color: ACCENT }}
          >
            Check out our Ideas pathway →
          </button>
        </p>
      </div>
    </div>
  )
}
