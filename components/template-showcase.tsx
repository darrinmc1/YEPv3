"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Calendar, Mail, Zap, TrendingUp, Users, DollarSign,
  CheckCircle2, Eye, ShoppingCart, Package
} from "lucide-react"
import { templates } from "@/lib/data/templates"
import Link from "next/link"

export function TemplateShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", label: "All Templates", icon: Package },
    { id: "roadmap", label: "Roadmaps", icon: Calendar },
    { id: "template", label: "Business Templates", icon: FileText },
    { id: "ai-prompt", label: "AI Prompts", icon: Zap },
    { id: "email", label: "Email Sequences", icon: Mail },
    { id: "marketing", label: "Marketing", icon: TrendingUp },
    { id: "sales", label: "Sales", icon: DollarSign }
  ]

  const filteredTemplates = selectedCategory === "all"
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            variant={selectedCategory === cat.id ? "default" : "ghost"}
            className={selectedCategory === cat.id
              ? "bg-blue-500 hover:bg-blue-400 text-white"
              : "text-white hover:bg-white/10"
            }
          >
            <cat.icon className="h-4 w-4 mr-2" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="bg-black/40 border-white/10 hover:border-blue-400/30 transition-all flex flex-col h-full">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <template.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${template.price}</div>
                  <div className="text-xs text-neutral-500">one-time</div>
                </div>
              </div>
              <CardTitle className="text-white text-lg line-clamp-1">{template.name}</CardTitle>
              <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{template.description}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* What You Get - Preview */}
              <div className="mb-4 flex-1">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-2">What You Get:</h4>
                <ul className="space-y-1">
                  {template.whatYouGet.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                  {template.whatYouGet.length > 3 && (
                    <li className="text-xs text-blue-400">+ {template.whatYouGet.length - 3} more items</li>
                  )}
                </ul>
              </div>

              {/* Bundled In */}
              <div className="mb-6 h-12">
                {template.bundledIn.length > 0 && (
                  <>
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-2">Included In:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.bundledIn.slice(0, 2).map((bundle) => (
                        <Badge key={bundle} variant="outline" className="text-[10px] px-1.5 py-0.5 border-green-400/20 text-green-400">
                          {bundle === "quick-start" && "Quick Start"}
                          {bundle === "launch-system" && "Launch System"}
                          {bundle === "complete-build" && "Complete Build"}
                        </Badge>
                      ))}
                      {template.bundledIn.length > 2 && (
                        <span className="text-xs text-neutral-500 self-center">...</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-blue-400/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <Link href={`/templates/${template.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Link>
                </Button>
                <Button
                  onClick={() => window.location.href = `/checkout?item=${template.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-400 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy ${template.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bundle CTA */}
      <div className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Want Everything? Save with Bundles</h3>
          <p className="text-neutral-300 mb-6">
            Get all templates, roadmaps, and resources in our complete systems
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/40">
              <div className="text-sm text-neutral-400 mb-1">Quick Start</div>
              <div className="text-2xl font-bold text-white mb-2">$29</div>
              <div className="text-xs text-neutral-500 mb-3">$197 value • Save $168</div>
              <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white text-sm">
                <a href="/validate-idea#pricing">View Bundle</a>
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-green-500/5 border-2 border-green-400/30">
              <div className="text-sm text-green-400 mb-1 font-semibold">Most Popular</div>
              <div className="text-2xl font-bold text-white mb-2">$49</div>
              <div className="text-xs text-neutral-500 mb-3">$497 value • Save $448</div>
              <Button asChild className="w-full bg-green-500 hover:bg-green-400 text-white text-sm">
                <a href="/validate-idea#pricing">View Bundle</a>
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-black/40">
              <div className="text-sm text-neutral-400 mb-1">Complete Build</div>
              <div className="text-2xl font-bold text-white mb-2">$99</div>
              <div className="text-xs text-neutral-500 mb-3">$997 value • Save $898</div>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-400 text-white text-sm">
                <a href="/validate-idea#pricing">View Bundle</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
