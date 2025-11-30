"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Mail } from "lucide-react"
import { ExitPlansLogo } from "@/components/exit-plans-logo"

export function AppverseFooter() {
  return (
    <footer className="bg-black/40 border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20">
                <ExitPlansLogo className="text-blue-400" size={20} />
              </div>
              <span>YourExitPlans</span>
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
              <a href="mailto:info@yourexitplans.com" aria-label="Email">
                <Mail className="h-5 w-5 text-neutral-400 hover:text-white" />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} YourExitPlans. All rights reserved.</p>
            <div className="flex flex-col md:flex-row items-center gap-4 text-neutral-400">
              <a href="mailto:info@yourexitplans.com" className="hover:text-white transition-colors">
                General: info@yourexitplans.com
              </a>
              <a href="mailto:help@yourexitplans.com" className="hover:text-white transition-colors">
                Support: help@yourexitplans.com
              </a>
              <a href="mailto:admin@yourexitplans.com" className="hover:text-white transition-colors">
                Business: admin@yourexitplans.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}