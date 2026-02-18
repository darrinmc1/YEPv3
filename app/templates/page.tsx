import { SiteHeader } from "@/components/site-header"
import { TemplateShowcase } from "@/components/template-showcase"
import { AppverseFooter } from "@/components/appverse-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Templates & Resources | YourExitPlans",
  description: "Professional business templates, roadmaps, AI prompts, and resources to launch your business faster.",
}

export default function TemplatesPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2">
            <span className="text-xs uppercase tracking-wider text-blue-400">Templates & Resources</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Professional Templates to <span className="text-blue-400">Launch Faster</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Battle-tested templates, frameworks, and resources used by successful founders. Buy individually or save with bundles.
          </p>
        </div>

        <TemplateShowcase />
      </section>

      <AppverseFooter />
    </main>
  )
}
