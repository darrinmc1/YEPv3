"use client"

import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Lightbulb, BarChart, Users, Loader2, Search, TrendingUp, MessageSquare } from "lucide-react"

// --- Step 1: Paste your Google Sheet CSV URL here ---
const GOOGLE_SHEET_CSV_URL = "YOUR_PUBLISHED_GOOGLE_SHEET_URL_HERE"

interface Idea {
  title: string
  description: string
  marketSize: string
  competition: string
}
interface ResearchLink {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

// A simple utility to parse CSV text into an array of objects
function parseCSV(text: string): Idea[] {
  const lines = text.trim().split("\n")
  const headers = lines[0].split(",").map(h => h.trim())
  const ideas: Idea[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim())
    const idea = headers.reduce((obj, header, index) => {
      obj[header as keyof Idea] = values[index]
      return obj
    }, {} as Idea)
    ideas.push(idea)
  }
  return ideas
}

export function IdeaTeaser() {
  const [isLoading, setIsLoading] = useState(false)
  const [idea, setIdea] = useState<Idea | null>(null)
  const [userIdea, setUserIdea] = useState("")
  const [researchLinks, setResearchLinks] = useState<ResearchLink[]>([])

  const handleGenerateClick = async () => {
    setIsLoading(true)
    setResearchLinks([]) // Clear previous research
    try {
      const response = await fetch(GOOGLE_SHEET_CSV_URL)
      // Handle case where the URL is not set yet
      if (!response.ok) {
        setIdea({ title: "Error", description: "Could not fetch sample ideas. Please check the configuration.", marketSize: "N/A", competition: "N/A" });
        return;
      }
      const csvText = await response.text()
      const ideas = parseCSV(csvText)
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)]
      setIdea(randomIdea)
    } catch (error) {
      setIdea({ title: "Error", description: "Failed to load ideas. Please try again later.", marketSize: "N/A", competition: "N/A" });
    } finally {
      setIsLoading(false)
    }
  }

  const handleResearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userIdea.trim()) return

    const encodedIdea = encodeURIComponent(userIdea)
    const links: ResearchLink[] = [
      {
        name: "Google Trends",
        url: `https://trends.google.com/trends/explore?q=${encodedIdea}`,
        icon: TrendingUp,
      },
      { name: "Market Size", url: `https://www.google.com/search?q=${encodedIdea}+market+size`, icon: BarChart },
      { name: "Competitors", url: `https://www.google.com/search?q=competitors+for+${encodedIdea}`, icon: Users },
      {
        name: "Community Discussion",
        url: `https://www.reddit.com/search/?q=${encodedIdea}`,
        icon: MessageSquare,
      },
    ]
    setResearchLinks(links)
  }

  const handleReset = () => {
    setIdea(null)
    setResearchLinks([])
    setUserIdea("")
  }

  return (
    <section className="py-16 sm:py-24 bg-black/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Want a Free Business Idea? (Yes, really)
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300">
          Don&apos;t spend 6 months building something nobody wants. Click the button to get a winner.
        </p>

        <div className="mt-8 min-h-[240px] flex items-center justify-center">
          {!idea && !isLoading && (
            <Button
              onClick={handleGenerateClick}
              disabled={isLoading}
              size="lg"
              className="rounded-full bg-blue-500 px-8 py-6 text-base font-semibold text-black hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(198,255,58,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Steal This Idea"
              )}
            </Button>
          )}

          {isLoading && (
            <Button disabled size="lg" className="rounded-full bg-blue-500 px-8 py-6 text-base font-semibold text-black">
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            </Button>
          )}

          {idea && (
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/40 p-8 text-left backdrop-blur-sm animate-fade-in-up">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">{idea.title}</h3>
              </div>
              <p className="mt-3 text-neutral-300">{idea.description}</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-400" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                      Market Size
                    </h4>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-white">{idea.marketSize}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-400" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                      Competition
                    </h4>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-white">{idea.competition}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section for user to add their own idea */}
        <div className="mt-16 border-t border-white/10 pt-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Have Your Own Idea?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300">
            Enter it below to get instant links for preliminary research.
          </p>

          <form onSubmit={handleResearchSubmit} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userIdea}
              onChange={e => setUserIdea(e.target.value)}
              placeholder="e.g., 'A subscription box for dog toys'"
              className="w-full rounded-full border border-white/20 bg-black/30 px-6 py-4 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <Button type="submit" size="lg" className="rounded-full font-semibold">
              <Search className="mr-2 h-5 w-5" />
              Research
            </Button>
          </form>

          {(idea || researchLinks.length > 0) && !isLoading && (
            <Button onClick={handleReset} variant="link" className="mt-8 text-neutral-400 hover:text-white">
              Reset and try another
            </Button>
          )}

          {researchLinks.length > 0 && (
            <div className="mt-8 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
              {researchLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline", className: "justify-start gap-3 py-6 text-base border-white/20 hover:bg-white/5 hover:text-white" })}
                >
                  <link.icon className="h-5 w-5 text-blue-400" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}