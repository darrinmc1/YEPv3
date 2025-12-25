import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { TwoPathways } from "@/components/two-pathways"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { AdShowcase } from "@/components/ad-showcase"
import { IdeaTeaser } from "@/components/idea-teaser"
import { AppverseFooter } from "@/components/appverse-footer"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for the 3 routes + pricing
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://yourexitplans.com/",
    name: "YourExitPlans | AI-Powered Business Ideas & Exit Plans",
    description:
      "Discover validated business ideas with market research, competitor analysis, and step-by-step implementation guides. Start FREE or get your complete Exit Plan from $29.",
    url: "https://yourexitplans.com/",
    mainEntity: {
      "@type": "Organization",
      name: "YourExitPlans",
      url: "https://yourexitplans.com",
    },
    hasPart: [
      {
        "@type": "Product",
        name: "Explore Ideas",
        description: "Browse 1000+ pre-researched business opportunities filtered by industry, budget, and skills. Free to explore.",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
        },
      },
      {
        "@type": "Product",
        name: "Validate Your Idea",
        description: "Test your business idea with AI-powered validation. Get instant opportunity scores and market viability checks.",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
        },
      },
      {
        "@type": "Product",
        name: "Starter Exit Plan",
        description: "1 complete Exit Plan with full market research, competitor analysis, and 30-day action plan.",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "29",
        },
      },
      {
        "@type": "Product",
        name: "Builder Bundle",
        description: "3 complete Exit Plans with 90-day roadmaps, templates, AI prompts, and email sequences.",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "49",
        },
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        
        {/* Three Routes Section - Main Product Selector */}
        <section id="choose-your-path">
          <TwoPathways />
        </section>
        
        <Features />
        <IdeaTeaser />
        
        {/* Pricing Section */}
        <Pricing />
        
        <AdShowcase />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  )
}
