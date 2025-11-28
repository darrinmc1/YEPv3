"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Mail, Zap } from "lucide-react"

export function AppverseFooter() {
  return (
    <footer className="bg-black/40 border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold text-white">
              YourExitPlans
            </Link>
            <p className="mt-2 text-sm text-neutral-400">
              AI-Powered Business Opportunities & Market Intelligence
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-neutral-400 hover:text-white" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-neutral-400 hover:text-white" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <a href="mailto:contact@yourexitplans.com" aria-label="Email">
                <Mail className="h-5 w-5 text-neutral-400 hover:text-white" />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} YourExitPlans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}