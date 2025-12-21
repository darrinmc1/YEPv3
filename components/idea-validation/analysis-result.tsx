"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { AnalysisResult } from "./types"

interface AnalysisResultDisplayProps {
    result: AnalysisResult
    onReset: () => void
}

export function AnalysisResultDisplay({ result, onReset }: AnalysisResultDisplayProps) {
    return (
        <div className="space-y-6">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-400/10 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h3>
                <p className="text-neutral-400">Here&apos;s what we found about your idea</p>
            </div>

            <div className="space-y-6">
                {/* Market Validation */}
                <Card className="bg-black/40 border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-white">Market Validation Score</CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                            <Progress value={result.marketValidation.score} className="flex-1" />
                            <span className="text-2xl font-bold text-blue-400">
                                {result.marketValidation.score}%
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-300 mb-4">{result.marketValidation.summary}</p>
                        <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                            Key Insights:
                        </h4>
                        <ul className="space-y-2">
                            {result.marketValidation.keyInsights.map((insight, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                                    <span>{insight}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Competitor Landscape */}
                <Card className="bg-black/40 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Competitor Landscape</CardTitle>
                        <CardDescription className="text-neutral-400">
                            {result.competitorLandscape.competition}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                            Opportunities:
                        </h4>
                        <ul className="space-y-2">
                            {result.competitorLandscape.opportunities.map((opportunity, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-neutral-300">
                                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                                    <span>{opportunity}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Quick Wins & Red Flags */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-black/40 border-green-400/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                Quick Wins
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {result.quickWins.map((win, index) => (
                                    <li key={index} className="text-sm text-neutral-300">
                                        • {win}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-red-400/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                                Red Flags
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {result.redFlags.map((flag, index) => (
                                    <li key={index} className="text-sm text-neutral-300">
                                        • {flag}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Next Steps */}
                <Card className="bg-black/40 border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-white">Recommended Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-2">
                            {result.nextSteps.map((step, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-neutral-300">
                                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-400/10 text-blue-400 font-semibold shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="mt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            </div>

            {/* CTA Section */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
                <h4 className="text-xl font-bold text-white mb-2">Ready to Take Action?</h4>
                <p className="text-neutral-300 mb-4">
                    Upgrade to get detailed implementation plans, market research reports, and ongoing support.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-blue-500 text-black hover:bg-blue-400 font-semibold">
                        View Pricing Plans
                    </Button>
                    <Button variant="outline" onClick={onReset} className="border-white/20 text-white hover:bg-white/10">
                        Validate Another Idea
                    </Button>
                </div>
            </div>
        </div>
    )
}
