"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CheckCircle2, ArrowRight, X, Zap, Target, Rocket, Mail, FileText, Calendar, TrendingUp, Users, DollarSign } from "lucide-react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  plan: "quick-start" | "launch-system" | "complete-build"
  ideaName: string
}

export function PricingModal({ isOpen, onClose, plan, ideaName }: PricingModalProps) {
  const planDetails = getPlanDetails(plan)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                <planDetails.icon className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400 uppercase">{planDetails.badge}</span>
              </div>
              <DialogTitle className="text-3xl font-bold text-white mb-2">
                {planDetails.name}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 text-base">
                {planDetails.subtitle}
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogHeader>

        {/* Price */}
        <div className="flex items-baseline gap-2 my-6">
          <span className="text-5xl font-bold text-white">${planDetails.price}</span>
          <span className="text-xl text-neutral-400">one-time</span>
        </div>

        {/* Value Highlight */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="font-semibold text-green-400">Total Value: ${planDetails.totalValue}</span>
          </div>
          <p className="text-sm text-neutral-300">
            You save ${planDetails.totalValue - planDetails.price} ({Math.round(((planDetails.totalValue - planDetails.price) / planDetails.totalValue) * 100)}% off)
          </p>
        </div>

        {/* What's Included */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            Everything Included:
          </h3>

          {planDetails.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <section.icon className="h-5 w-5 text-blue-400" />
                {section.title}
              </h4>
              <ul className="space-y-2 ml-7">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bonus Items */}
        {planDetails.bonuses && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
            <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Bonus Items:
            </h4>
            <ul className="space-y-2">
              {planDetails.bonuses.map((bonus, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-neutral-300">{bonus}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Guarantee */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-400/20">
          <p className="text-sm text-neutral-300 text-center">
            <span className="font-semibold text-blue-400">30-Day Money-Back Guarantee</span> — If you&apos;re not satisfied, we&apos;ll refund you 100%. No questions asked.
          </p>
        </div>

        {/* Browse Individual Items */}
        <div className="mt-4 text-center">
          <Link
            href="/templates"
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Or browse and buy individual templates →
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 space-y-3">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-6 text-lg"
          >
            <Link href={`/checkout?plan=${plan}&idea=${encodeURIComponent(ideaName)}`}>
              Get {planDetails.name} Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-neutral-400 hover:text-white"
          >
            Not right now
          </Button>
        </div>

        {/* For your idea */}
        <p className="text-center text-xs text-neutral-500 mt-4">
          Customized for: <span className="text-white font-semibold">{ideaName}</span>
        </p>
      </DialogContent>
    </Dialog>
  )
}

// Plan details configurations
function getPlanDetails(plan: "quick-start" | "launch-system" | "complete-build") {
  switch (plan) {
    case "quick-start":
      return {
        name: "Quick Start",
        subtitle: "Launch your idea in 30 days with focused execution",
        price: 29,
        totalValue: 197,
        badge: "Perfect for Beginners",
        icon: Zap,
        sections: [
          {
            title: "30-Day Launch Roadmap",
            icon: Calendar,
            items: [
              "Week-by-week action plan with daily tasks",
              "Milestone tracking and progress checklists",
              "Time management templates for busy founders",
              "Launch countdown planner with deadlines"
            ]
          },
          {
            title: "Core Business Templates",
            icon: FileText,
            items: [
              "One-page business plan template",
              "Customer interview script (10 questions)",
              "Simple landing page wireframe and copy template",
              "Email validation sequence (3 emails)"
            ]
          },
          {
            title: "Quick Win Strategies",
            icon: Target,
            items: [
              "5 no-code tools to build your MVP fast",
              "Customer acquisition tactics for $0 budget",
              "Pre-launch checklist (25 critical items)",
              "First 100 users playbook"
            ]
          }
        ],
        bonuses: [
          "30-minute video walkthrough of the roadmap",
          "Community access for questions and support",
          "Weekly email check-ins to keep you accountable"
        ]
      }

    case "launch-system":
      return {
        name: "Launch System",
        subtitle: "Complete 90-day system to build, launch, and grow",
        price: 49,
        totalValue: 497,
        badge: "Most Popular",
        icon: Rocket,
        sections: [
          {
            title: "90-Day Implementation Roadmap",
            icon: Calendar,
            items: [
              "Phase 1: Validation (Days 1-30) - Customer discovery",
              "Phase 2: Build (Days 31-60) - MVP development",
              "Phase 3: Launch (Days 61-90) - Go-to-market",
              "Weekly sprint planning templates",
              "Daily task breakdowns with time estimates",
              "Milestone celebration tracker"
            ]
          },
          {
            title: "Complete Business Templates (6)",
            icon: FileText,
            items: [
              "Full business plan template (15 pages)",
              "Financial projections spreadsheet",
              "Customer persona worksheets (3 templates)",
              "Competitive analysis framework",
              "Product roadmap template",
              "Pitch deck template (12 slides)"
            ]
          },
          {
            title: "AI Prompts Library (25+)",
            icon: Zap,
            items: [
              "Market research prompts (5)",
              "Content creation prompts (8)",
              "Sales copy and messaging prompts (7)",
              "Customer support prompts (5)",
              "Custom ChatGPT instructions for your niche"
            ]
          },
          {
            title: "Marketing Playbook",
            icon: TrendingUp,
            items: [
              "Content marketing calendar (90 days)",
              "Social media strategy and templates",
              "SEO basics for your landing page",
              "Email marketing sequences (10 emails)",
              "Paid ads quick-start guide ($500 budget)"
            ]
          },
          {
            title: "Deep Competitor Analysis",
            icon: Users,
            items: [
              "Top 10 competitors breakdown",
              "Pricing comparison matrix",
              "Feature gap analysis",
              "Positioning recommendations",
              "Differentiation strategy guide"
            ]
          }
        ],
        bonuses: [
          "Private Slack/Discord community access",
          "2 group coaching calls (live Q&A)",
          "Lifetime updates to all templates",
          "Access to template library ($97 value)"
        ]
      }

    case "complete-build":
      return {
        name: "Complete Build",
        subtitle: "End-to-end 120-day system from idea to revenue",
        price: 99,
        totalValue: 997,
        badge: "Maximum Value",
        icon: Rocket,
        sections: [
          {
            title: "120-Day Revenue Roadmap",
            icon: Calendar,
            items: [
              "Phase 1: Foundation (Days 1-30) - Research & validation",
              "Phase 2: Build (Days 31-60) - MVP & brand development",
              "Phase 3: Launch (Days 61-90) - Go-to-market execution",
              "Phase 4: Scale (Days 91-120) - Growth & optimization",
              "Daily execution plan with time blocks",
              "Weekly OKRs and accountability framework",
              "Monthly review and pivot guidelines"
            ]
          },
          {
            title: "Everything from Launch System PLUS:",
            icon: CheckCircle2,
            items: [
              "All 25+ AI prompts",
              "All 6 business templates",
              "90-day marketing playbook",
              "Full competitor analysis",
              "Complete roadmap and tracking"
            ]
          },
          {
            title: "Advanced Email Sequences",
            icon: Mail,
            items: [
              "Pre-launch email sequence (7 emails)",
              "Launch week sequence (5 emails)",
              "Onboarding automation (12 emails)",
              "Sales funnel sequences (15 emails)",
              "Re-engagement campaigns (6 emails)",
              "Subject line formulas library (100+)",
              "Email copywriting guide with examples"
            ]
          },
          {
            title: "Scaling Playbook",
            icon: TrendingUp,
            items: [
              "Revenue optimization strategies",
              "Pricing strategy framework (value-based)",
              "Upsell and cross-sell systems",
              "Customer retention playbook",
              "Referral program templates",
              "Partnerships and collaboration guide",
              "Metrics dashboard and KPI tracking",
              "Financial modeling for growth"
            ]
          },
          {
            title: "Sales & Conversion System",
            icon: DollarSign,
            items: [
              "Sales page templates and formulas",
              "A/B testing framework and tools",
              "Conversion rate optimization checklist",
              "Landing page teardowns (10 examples)",
              "Sales call scripts and objection handling",
              "Proposal and contract templates",
              "Payment processing setup guide"
            ]
          },
          {
            title: "Team & Operations",
            icon: Users,
            items: [
              "Hiring guide for first employees/contractors",
              "Job description templates (5 roles)",
              "Onboarding and training SOPs",
              "Project management system setup",
              "Legal and compliance checklist",
              "Tool stack recommendations by budget"
            ]
          }
        ],
        bonuses: [
          "4 private 1-on-1 coaching calls (30 min each, $800 value)",
          "Personalized roadmap review and feedback",
          "VIP community access with weekly mastermind calls",
          "Custom AI assistant trained on your business",
          "Early access to all future updates and products",
          "Priority email support (24-hour response)",
          "LinkedIn profile and personal branding guide"
        ]
      }
  }
}
