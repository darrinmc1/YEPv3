"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Users } from "lucide-react"
import { IdeaFormData } from "./types"

interface IdeaFormStep2Props {
    formData: IdeaFormData
    setFormData: (data: IdeaFormData) => void
    onNext: () => void
    onBack: () => void
    isValid: boolean
}

const BUSINESS_TYPES = [
    "SaaS (Software as a Service)",
    "E-commerce Store",
    "Marketplace Platform",
    "Service Business",
    "Content/Education",
    "Agency",
    "Mobile App",
    "Physical Product",
    "Other"
]

const INDUSTRIES = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Real Estate",
    "E-commerce/Retail",
    "Food & Beverage",
    "Marketing/Advertising",
    "Entertainment",
    "Professional Services",
    "Other"
]

const PRICE_RANGES = [
    "Free (ad-supported)",
    "Under $10",
    "$10-$50",
    "$50-$100",
    "$100-$500",
    "$500-$1000",
    "$1000+",
    "Not sure yet"
]

export function IdeaFormStep2({ formData, setFormData, onNext, onBack, isValid }: IdeaFormStep2Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Market Context</h3>
            </div>

            <div className="space-y-2">
                <Label htmlFor="targetCustomer" className="text-white">
                    Who Is Your Target Customer? <span className="text-red-400">*</span>
                </Label>
                <Textarea
                    id="targetCustomer"
                    placeholder="Describe your ideal customer..."
                    value={formData.targetCustomer}
                    onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                    className="bg-black/40 border-white/20 text-white placeholder:text-neutral-500 min-h-20"
                />
                <p className="text-xs text-neutral-500">Min 10 characters</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-white">
                        Business Type <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                        <SelectTrigger id="businessType" className="bg-black/40 border-white/20 text-white w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                            {BUSINESS_TYPES.map((type) => (
                                <SelectItem key={type} value={type} className="text-white">
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">
                        Industry <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                        <SelectTrigger id="industry" className="bg-black/40 border-white/20 text-white w-full">
                            <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                            {INDUSTRIES.map((industry) => (
                                <SelectItem key={industry} value={industry} className="text-white">
                                    {industry}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="priceRange" className="text-white">
                    Expected Price Range <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.priceRange} onValueChange={(value) => setFormData({ ...formData, priceRange: value })}>
                    <SelectTrigger id="priceRange" className="bg-black/40 border-white/20 text-white w-full">
                        <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                        {PRICE_RANGES.map((range) => (
                            <SelectItem key={range} value={range} className="text-white">
                                {range}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-between">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
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
