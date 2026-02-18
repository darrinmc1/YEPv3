"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, X, Sparkles } from "lucide-react"

interface WhatsIncludedModalProps {
  productType: "research" | "implementation" | "idea-bundle" | "implementation-addon" | "premium-bundle"
  ideaName?: string
  trigger?: React.ReactNode
}

export function WhatsIncludedModal({ productType, ideaName, trigger }: WhatsIncludedModalProps) {
  const [open, setOpen] = useState(false)

  const content = getProductContent(productType, ideaName)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
        >
          What&apos;s included?
        </Button>
      )}

      <DialogContent className="bg-black/95 border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
            {content.title}
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Price */}
          <div className="text-center py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
            <div className="text-4xl font-bold text-white">${content.price}</div>
            {content.originalValue && (
              <div className="text-sm text-neutral-400 mt-1">
                ${content.originalValue} value • Save ${content.originalValue - content.price}
              </div>
            )}
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">What You Get:</h3>
            <div className="space-y-3">
              {content.includes.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-neutral-400 mt-1">{item.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Option */}
          {content.upgradeOption && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/20">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-purple-400">Want to implement this idea?</div>
                  <div className="text-sm text-neutral-300 mt-1">{content.upgradeOption.text}</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-6 border-t border-white/10">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-6"
            >
              <Link href={content.checkoutUrl}>
                Get {content.buttonText} — ${content.price}
              </Link>
            </Button>
            <p className="text-xs text-center text-neutral-500 mt-3">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getProductContent(productType: string, ideaName?: string) {
  switch (productType) {
    case "research":
      return {
        title: ideaName ? `Research Report: ${ideaName}` : "Full Idea Research Report",
        price: 9,
        buttonText: "Research Report",
        checkoutUrl: `/checkout?plan=research${ideaName ? `&idea=${encodeURIComponent(ideaName)}` : ''}`,
        includes: [
          {
            title: "Market Opportunity Analysis",
            description: "TAM, SAM, SOM breakdown with growth trends and timing"
          },
          {
            title: "Complete Competitor Analysis",
            description: "Top 10 competitors with pricing, features, strengths, and weaknesses"
          },
          {
            title: "Target Customer Profile",
            description: "Demographics, pain points, buying behavior, and where to find them"
          },
          {
            title: "Revenue Potential Breakdown",
            description: "Pricing models, customer lifetime value, and realistic revenue projections"
          },
          {
            title: "Entry Barriers & Challenges",
            description: "What makes this hard, what could go wrong, and how to mitigate risks"
          },
          {
            title: "Detailed Cost Breakdown",
            description: "Line-by-line breakdown of startup costs with specific tools and pricing"
          },
          {
            title: "Success Factors",
            description: "What you need to win: skills, budget, timeline, and resources"
          },
          {
            title: "10% Off Your Next Purchase",
            description: "Get 10% off your next $9 research report ($8.10)"
          }
        ],
        upgradeOption: {
          text: "Add Implementation Plan (+$20) for step-by-step roadmap and resources"
        }
      }

    case "implementation":
      return {
        title: ideaName ? `Complete Plan: ${ideaName}` : "Research + Implementation Plan",
        price: 29,
        originalValue: 38,
        buttonText: "Complete Plan",
        checkoutUrl: `/checkout?plan=implementation${ideaName ? `&idea=${encodeURIComponent(ideaName)}` : ''}`,
        includes: [
          {
            title: "Everything in Research Report ($9)",
            description: "Market analysis, competitors, customer profile, revenue potential"
          },
          {
            title: "90-Day Launch Roadmap",
            description: "Week-by-week action plan with daily tasks and milestones"
          },
          {
            title: "Tech Stack & Tools Guide",
            description: "Specific platforms, services, and tools to build your MVP"
          },
          {
            title: "Marketing Channel Strategy",
            description: "Where to find customers, content ideas, and acquisition tactics"
          },
          {
            title: "Launch Checklist",
            description: "Pre-launch, launch day, and post-launch tasks with templates"
          },
          {
            title: "Financial Model Template",
            description: "Revenue projections, costs, pricing calculator, and break-even analysis"
          },
          {
            title: "Detailed Cost Breakdown",
            description: "Line-by-line breakdown showing exactly what you'll spend and where"
          },
          {
            title: "Customer Acquisition Playbook",
            description: "Scripts, email templates, and outreach strategies for first 100 customers"
          },
          {
            title: "10% Off Your Next Purchase",
            description: "Get 10% off your next complete plan ($26.10)"
          }
        ]
      }

    case "idea-bundle":
      return {
        title: "7 Ideas Bundle",
        price: 49,
        originalValue: 63,
        buttonText: "7 Ideas Bundle",
        checkoutUrl: "/checkout?plan=idea-bundle",
        includes: [
          {
            title: "7 Complete Research Reports",
            description: "Full $9 research report for each of 7 pre-selected ideas"
          },
          {
            title: "Market Analysis for Each Idea",
            description: "Opportunity size, growth trends, and timing for all 7"
          },
          {
            title: "Competitor Breakdowns",
            description: "Top 10 competitors analyzed for each idea"
          },
          {
            title: "Customer Profiles",
            description: "Target audience and acquisition channels for each"
          },
          {
            title: "Revenue Potential",
            description: "Pricing strategies and financial projections for all 7"
          },
          {
            title: "Risk & Success Factors",
            description: "What could go wrong and what you need to win"
          },
          {
            title: "Comparison Matrix",
            description: "Side-by-side comparison to help you pick the best fit"
          },
          {
            title: "10% Off Your Next Purchase",
            description: "Buy another 7-idea bundle and save 10% ($44.10)"
          }
        ]
      }

    case "premium-bundle":
      return {
        title: "10 Ideas + Implementation Plan",
        price: 99,
        originalValue: 119,
        buttonText: "Premium Bundle",
        checkoutUrl: "/checkout?plan=premium-bundle",
        includes: [
          {
            title: "10 Complete Research Reports",
            description: "Full $9 research report for each of 10 pre-selected ideas"
          },
          {
            title: "Generic Implementation Plan",
            description: "Universal 90-day roadmap that works for any business idea"
          },
          {
            title: "Market Analysis for Each Idea",
            description: "Opportunity size, growth trends, and timing for all 10"
          },
          {
            title: "Competitor Breakdowns",
            description: "Top 10 competitors analyzed for each idea"
          },
          {
            title: "Customer Profiles",
            description: "Target audience and acquisition channels for each"
          },
          {
            title: "Revenue Potential",
            description: "Pricing strategies and financial projections for all 10"
          },
          {
            title: "Comparison Matrix",
            description: "Side-by-side comparison to help you pick the best fit"
          },
          {
            title: "Tech Stack & Tools Guide",
            description: "Platform recommendations and no-code solutions"
          },
          {
            title: "Marketing Playbook",
            description: "Customer acquisition strategies and content templates"
          },
          {
            title: "Launch Checklist",
            description: "Pre-launch through post-launch action items"
          },
          {
            title: "10% Off Your Next Purchase",
            description: "Buy another premium bundle and save 10% ($89.10)"
          }
        ]
      }

    case "implementation-addon":
      return {
        title: "Implementation Add-on",
        price: 29,
        buttonText: "Implementation Plan",
        checkoutUrl: "/checkout?plan=implementation-addon",
        includes: [
          {
            title: "90-Day Launch Roadmap",
            description: "Week-by-week action plan with daily tasks and milestones"
          },
          {
            title: "Tech Stack & Tools Guide",
            description: "Specific platforms, services, and tools to build your MVP"
          },
          {
            title: "Marketing Channel Strategy",
            description: "Where to find customers, content ideas, and acquisition tactics"
          },
          {
            title: "Launch Checklist",
            description: "Pre-launch, launch day, and post-launch tasks with templates"
          },
          {
            title: "Financial Model Template",
            description: "Revenue projections, costs, pricing calculator, and break-even analysis"
          },
          {
            title: "Customer Acquisition Playbook",
            description: "Scripts, email templates, and outreach strategies for first 100 customers"
          }
        ]
      }

    default:
      return {
        title: "Product Details",
        price: 0,
        buttonText: "Get Started",
        checkoutUrl: "/checkout",
        includes: []
      }
  }
}
