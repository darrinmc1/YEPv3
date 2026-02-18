"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Copy, Check } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface TemplateGeneratorProps {
    templateId: string
    category: string
}

export function TemplateGenerator({ templateId, category }: TemplateGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [content, setContent] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/generate-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    templateId,
                }),
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setContent(data.content)
        } catch (error) {
            console.error('Generation failed:', error)
            // Ideally show a toast here
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20 shrink-0">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <div className="w-full">
                    <h3 className="text-xl font-bold text-white mb-2">Instant AI Generation</h3>
                    <p className="text-neutral-300 mb-4">
                        Want to generate this specific {category === 'roadmap' ? 'roadmap' : 'template'} tailored to your business right now?
                    </p>

                    {!content && (
                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-500 text-white border-none shadow-lg shadow-purple-900/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate with Gemini
                                </>
                            )}
                        </Button>
                    )}

                    {content && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-purple-400">Generated Draft</span>
                                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-neutral-400 hover:text-white">
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto p-6 rounded-xl bg-black/50 border border-purple-500/20 font-mono text-sm text-neutral-300 prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={handleGenerate}
                                    variant="outline"
                                    disabled={isLoading}
                                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
