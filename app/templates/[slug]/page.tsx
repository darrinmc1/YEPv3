import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ShoppingCart, ArrowLeft, Sparkles, Eye } from "lucide-react"
import { templates } from "@/lib/data/templates"
import { TemplateGenerator } from "@/components/template-generator"
import Link from "next/link"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export function generateStaticParams() {
    return templates.map((template) => ({
        slug: template.id,
    }))
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const template = templates.find((t) => t.id === slug)

    if (!template) {
        return {
            title: "Template Not Found",
        }
    }

    return {
        title: `${template.name} | YourExitPlans`,
        description: template.description,
    }
}

export default async function TemplatePage({ params }: PageProps) {
    const { slug } = await params
    const template = templates.find((t) => t.id === slug)

    if (!template) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <SiteHeader />

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <Link href="/templates" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Templates
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-blue-500/10">
                                    <template.icon className="h-8 w-8 text-blue-400" />
                                </div>
                                <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/5 uppercase tracking-wider">
                                    {template.category}
                                </Badge>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{template.name}</h1>
                            <p className="text-xl text-neutral-300 leading-relaxed">{template.description}</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                What&apos;s Included
                            </h2>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {template.whatYouGet.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                        <span className="text-neutral-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Eye className="h-5 w-5 text-blue-400" />
                                Preview
                            </h2>
                            <div className="p-6 rounded-xl bg-black/40 border border-blue-400/20 font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                                <div className="mb-4 pb-4 border-b border-white/10 text-blue-400 font-semibold">
                                    {template.example.title}
                                </div>
                                {template.example.preview.join('\n')}
                            </div>
                        </div>

                        {/* AI Generation Placeholder */}
                        {/* AI Generation */}
                        <TemplateGenerator templateId={template.id} category={template.category} />
                    </div>

                    {/* Right Column: Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-6 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl">
                            <div className="mb-6">
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-5xl font-bold text-white">${template.price}</span>
                                    <span className="text-neutral-400 mb-2">USD</span>
                                </div>
                                <p className="text-sm text-neutral-400">One-time payment • Lifetime access</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <Button className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-900/20">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Buy Now
                                </Button>
                                <p className="text-xs text-center text-neutral-500">
                                    Secure checkout via Stripe. Instant download.
                                </p>
                            </div>

                            {template.bundledIn.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-sm font-medium text-green-400 mb-3">Also included in:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {template.bundledIn.map((bundle) => (
                                            <Link
                                                key={bundle}
                                                href="/validate-idea#pricing"
                                                className="text-xs px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20 transition-colors"
                                            >
                                                {bundle === "quick-start" && "Quick Start Bundle"}
                                                {bundle === "launch-system" && "Launch System"}
                                                {bundle === "complete-build" && "Complete Build"}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AppverseFooter />
        </main>
    )
}
