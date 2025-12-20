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
  // Structured data for both pathways
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://yourexitplans.com/",
    name: "YourExitPlans | AI-Powered Business Opportunities & Implementation",
    description:
      "Two pathways to business success: Get validated business ideas with AI analysis, OR get step-by-step implementation plans to launch your idea in 120 days.",
    url: "https://yourexitplans.com/",
    mainEntity: {
      "@type": "Organization",
      name: "YourExitPlans",
      url: "https://yourexitplans.com",
    },
    hasPart: [
      {
        "@type": "Product",
        name: "Business Ideas Stream",
        description: "AI-powered business opportunity analysis with validated market research",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "999",
        },
      },
      {
        "@type": "Product",
        name: "Implementation Stream",
        description: "120-day step-by-step business launch roadmap with daily action plans",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "25",
          highPrice: "999",
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
