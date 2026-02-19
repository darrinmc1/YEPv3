import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | YourExitPlans",
  description: "Simple, transparent pricing for every stage of your business journey.",
}

const tiers = [
  {
    name: "Free Validation",
    price: "Free",
    description: "Find out if your idea is brilliant or terrible before you quit your job",
    features: [
      "AI opportunity score",
      "Top strength & biggest risk",
      "Why now analysis",
      "3 submissions per day",
    ],
    cta: "Validate Your Idea",
    href: "/validate-idea",
    highlight: false,
    color: "border-green-400/30",
    badge: null,
  },
  {
    name: "Research Report",
    price: "$9",
    description: "Everything you need to know about an idea without spending 40 hours on Google",
    features: [
      "10-page premium PDF report",
      "Market opportunity analysis",
      "Detailed cost breakdown",
      "Target customer analysis",
      "Revenue model insights",
    ],
    cta: "Get Report",
    href: "/explore-ideas",
    highlight: false,
    color: "border-blue-400/30",
    badge: null,
  },
  {
    name: "Research + Implementation",
    price: "$29",
    description: "Stop planning, start building. The kick in the pants you need to actually launch",
    features: [
      "Everything in Research Report",
      "90-day launch roadmap",
      "Tech stack recommendations",
      "Marketing strategy",
      "Daily action tasks",
    ],
    cta: "Get Started",
    href: "/implementation",
    highlight: true,
    color: "border-blue-400",
    badge: "Most Popular",
  },
  {
    name: "7 Ideas Bundle",
    price: "$49",
    description: "Explore and compare 7 validated business ideas (because betting on just one is risky)",
    features: [
      "7 full research reports",
      "Ideas comparison matrix",
      "Save $14 vs individual",
      "All industries covered",
      "Priority email delivery",
    ],
    cta: "Get Bundle",
    href: "/explore-ideas",
    highlight: false,
    color: "border-purple-400/30",
    badge: "Best Value",
  },
]

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#0a0a0a] text-white min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Simple, Transparent{" "}
              <span className="text-blue-400">Pricing</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Start free. Pay only for what you need. No subscriptions, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border ${tier.color} bg-white/5 p-6 flex flex-col ${tier.highlight ? "ring-2 ring-blue-400/50 bg-blue-400/5" : ""
                  }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-1">{tier.name}</h2>
                  <p className="text-neutral-400 text-sm mb-4">{tier.description}</p>
                  <div className="text-4xl font-bold text-blue-400">{tier.price}</div>
                  {tier.price !== "Free" && (
                    <p className="text-neutral-500 text-xs mt-1">one-time</p>
                  )}
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-300">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`block text-center py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${tier.highlight
                      ? "bg-blue-500 text-white hover:bg-blue-400"
                      : "border border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                    }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-400">
              Have questions?{" "}
              <Link href="/faq" className="text-blue-400 underline hover:text-blue-300">
                Check our FAQ
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-blue-400 underline hover:text-blue-300">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <AppverseFooter />
    </>
  )
}
