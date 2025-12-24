import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { TwoPathways } from "@/components/two-pathways"
import { Features } from "@/components/features"
import { AdShowcase } from "@/components/ad-showcase"
import { IdeaTeaser } from "@/components/idea-teaser"
import { AppverseFooter } from "@/components/appverse-footer"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for three routes
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://yourexitplans.com/",
    name: "YourExitPlans | Free AI Business Validation - Start Risk-Free",
    description:
      "All routes start FREE. Explore ideas, validate your business, or preview your 120-day roadmap. No credit card required. Upgrade only if you want the full report.",
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
        description: "Free AI-generated sample business idea with market overview and opportunity score - email required to receive",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
        },
      },
      {
        "@type": "Product",
        name: "Validate Your Idea",
        description: "Free opportunity score and market viability check. Upgrade to $29 for full validation report with competitor analysis and revenue projections.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "29",
        },
      },
      {
        "@type": "Product",
        name: "Build Your Business",
        description: "Free roadmap outline with week-by-week milestones. Unlock full 120-day action plan for $29-$49.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "49",
        },
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        
        {/* Two Pathways Section - Main Product Selector - Scroll Target */}
        <section id="choose-your-path">
          <TwoPathways />
        </section>
        
        <Features />
        <IdeaTeaser />
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
