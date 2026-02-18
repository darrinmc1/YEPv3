"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Crown, X } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"

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

interface IdeasPricingModalProps {
  onClose: () => void
}

export function IdeasPricingModal({ onClose }: IdeasPricingModalProps) {
  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">
          Buy Your Next <span className="text-blue-400">Big Thing</span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Don't spend 6 months building something nobody wants. Start with a winner.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* FREE Tier */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20">
          <CardHeader className="space-y-3 pb-4">
            <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
              FREE
            </div>
            <div className="flex items-end gap-2 text-white">
              <div className="text-3xl font-bold tracking-tight">$0</div>
              <span className="pb-1 text-sm text-neutral-400">forever</span>
            </div>
            <Button
              asChild
              className="w-full rounded-full px-4 py-2 text-sm font-medium transition-all bg-green-500 text-black hover:bg-green-400 font-semibold"
            >
              <a href="/validate-idea">Validate Your Idea</a>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-neutral-400 mb-4">Look around, kick the tires, see what's possible.</p>
            <ul className="grid gap-2.5">
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
        </Card>

        {/* Starter - $19 */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass border border-white/20">
          <CardHeader className="space-y-3 pb-4">
            <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
              Starter
            </div>
            <div className="flex items-end gap-2 text-white">
              <div className="text-3xl font-bold tracking-tight">$19</div>
              <span className="pb-1 text-sm text-neutral-400">per month</span>
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
            <p className="text-xs text-neutral-400 mb-4">One great idea, fully researched. Cheaper than lunch.</p>
            <ul className="grid gap-2.5">
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
        </Card>

        {/* Silver - $99/quarter */}
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
              <div className="text-3xl font-bold tracking-tight">$99</div>
              <span className="pb-1 text-sm text-neutral-400">/quarter</span>
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
            <p className="text-xs text-neutral-400 mb-4">A semester's worth of business case studies for $99.</p>
            <ul className="grid gap-2.5">
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
        </Card>
      </div>

      {/* Gold & Platinum - Full Width Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gold - $249/month */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass-enhanced border border-blue-400/30">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" style={{ color: ACCENT }} />
              <div className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
                Gold
              </div>
            </div>
            <div className="flex items-end gap-2 text-white">
              <div className="text-3xl font-bold tracking-tight">$249</div>
              <span className="pb-1 text-sm text-neutral-400">/month</span>
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
            <div className="grid gap-2.5">
              <ul className="space-y-2.5">
                {[
                  "Everything in Silver",
                  "52-week implementation guide",
                  "Tech stack recommendations",
                  "Hiring roadmap + job descriptions",
                  "Financial projections (3 scenarios)",
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
        </Card>

        {/* Platinum - $999/month */}
        <Card className="relative overflow-hidden rounded-2xl liquid-glass-enhanced border-2 border-blue-400">
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
              <div className="text-3xl font-bold tracking-tight">$999</div>
              <span className="pb-1 text-sm text-neutral-400">/month</span>
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
            <div className="grid gap-2.5">
              <ul className="space-y-2.5">
                {[
                  "Everything in Gold",
                  "EXCLUSIVE: Idea removed from public access",
                  "Weekly strategic check-ins",
                  "Priority email support",
                  "Custom market research on demand",
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
        </Card>
      </div>

      {/* Bottom Note */}
      <div className="mt-8 text-center">
        <p className="text-neutral-400 text-sm">
          Not sure which plan? Start with{" "}
          <a href="#signup" className="font-semibold hover:underline" style={{ color: ACCENT }}>
            FREE weekly ideas
          </a>{" "}
          and upgrade anytime.
        </p>
      </div>
    </div>
  )
}
