"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Lightbulb } from "lucide-react"
import { CharacterCounter } from "@/components/character-counter"
import { IdeaFormData } from "./types"

interface IdeaFormStep1Props {
    formData: IdeaFormData
    setFormData: (data: IdeaFormData) => void
    onNext: () => void
    isValid: boolean
}

export function IdeaFormStep1({ formData, setFormData, onNext, isValid }: IdeaFormStep1Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Tell Us About Your Idea</h3>
            </div>

            <div className="space-y-2">
                <Label htmlFor="ideaName" className="text-white">
                    Idea Name <span className="text-red-400">*</span>
                </Label>
                <Input
                    id="ideaName"
                    placeholder="e.g., AI-powered fitness coach for busy professionals"
                    value={formData.ideaName}
                    onChange={(e) => setFormData({ ...formData, ideaName: e.target.value })}
                    className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
                    maxLength={100}
                />
                <CharacterCounter value={formData.ideaName} min={3} max={100} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="oneLiner" className="text-white">
                    One-Liner Description <span className="text-red-400">*</span>
                </Label>
                <Input
                    id="oneLiner"
                    placeholder="What is it in one sentence?"
                    value={formData.oneLiner}
                    onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
                    className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500"
                    maxLength={200}
                />
                <CharacterCounter value={formData.oneLiner} min={10} max={200} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="problemSolved" className="text-white">
                    What Problem Does It Solve? <span className="text-red-400">*</span>
                </Label>
                <Textarea
                    id="problemSolved"
                    placeholder="Describe the problem your idea addresses..."
                    value={formData.problemSolved}
                    onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                    className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 min-h-24"
                    maxLength={500}
                />
                <CharacterCounter value={formData.problemSolved} min={20} max={500} />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={onNext}
                    disabled={!isValid}
                    className="bg-blue-500 text-black hover:bg-blue-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
