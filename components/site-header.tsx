"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap, DollarSign, HelpCircle, BookOpen, LogIn } from "lucide-react"

export function SiteHeader() {
  const links = [
    { href: "#features", label: "How It Works", icon: Zap },
    { href: "#pricing", label: "Pricing", icon: DollarSign },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/About", label: "About", icon: BookOpen },
    { href: "/login", label: "Login", icon: LogIn },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full border border-white/10">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">
              YourExit<span className="text-blue-400">Plans</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-blue-400 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-blue-400 transition-colors">
              Log in
            </Link>
            <Button
              asChild
              className="bg-blue-500 text-black font-semibold rounded-full px-6 py-2.5
                         hover:bg-blue-400 hover:shadow-lg hover:scale-[1.02]
                         transition-all"
            >
              <Link href="#pricing">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-blue-400/30 bg-black/60 text-blue-400 hover:bg-black/80 hover:border-blue-400/50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-white/20 p-0 w-64 flex flex-col">
                {/* Brand Header */}
                <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="font-bold tracking-tight text-white text-lg">
                    YourExit<span className="text-blue-400">Plans</span>
                  </span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-200">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-400/10 hover:text-blue-400 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-blue-400/70">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-white/10 p-4 space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-blue-400/50 text-blue-400 bg-black/60 hover:bg-black/80"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-blue-500 text-black font-semibold rounded-full px-6 py-2.5
                               hover:bg-blue-400 hover:shadow-lg hover:scale-[1.02]
                               transition-all"
                  >
                    <Link href="#pricing">Get Started Free</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
