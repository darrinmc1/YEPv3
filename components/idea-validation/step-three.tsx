"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle2, DollarSign } from "lucide-react"
import { IdeaFormData } from "./types"

interface IdeaFormStep3Props {
    formData: IdeaFormData
    setFormData: (data: IdeaFormData) => void
    onSubmit: () => void
    onBack: () => void
    isValid: boolean
}

export function IdeaFormStep3({ formData, setFormData, onSubmit, onBack, isValid }: IdeaFormStep3Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Get Your Free Analysis</h3>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
                <h4 className="text-lg font-semibold text-white mb-3">What You&apos;ll Receive:</h4>
                <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-neutral-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span>Market validation score and analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span>Competitor landscape overview</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span>Quick wins and red flags</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        <span>Recommended next steps</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                    Email Address <span className="text-red-400">*</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
                />
                <p className="text-xs text-neutral-500">
                    We&apos;ll email you a copy of the analysis. No spam, ever.
                </p>
            </div>

            <div className="flex justify-between">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={!isValid}
                    className="bg-blue-500 text-black hover:bg-blue-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed px-8"
                >
                    Analyze My Idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
