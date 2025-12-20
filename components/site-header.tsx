"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap, DollarSign, HelpCircle, BookOpen, LogIn, Home, ChevronDown, Lightbulb, Rocket, TrendingUp, Target } from "lucide-react"
import { ExitPlansLogo } from "@/components/exit-plans-logo"

export function SiteHeader() {
  const [isPricingOpen, setIsPricingOpen] = useState(false)

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "#features", label: "How It Works", icon: Zap },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/About", label: "About", icon: BookOpen },
    { href: "/login", label: "Login", icon: LogIn },
  ]

  const pricingOptions = [
    {
      title: "Free Idea Validation",
      description: "Test your business idea with AI-powered analysis",
      icon: Lightbulb,
      href: "/validate-idea",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    {
      title: "Ideas Stream",
      description: "Get validated business ideas delivered to you",
      icon: Rocket,
      href: "#pricing",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30",
    },
    {
      title: "Implementation",
      description: "Full business setup and launch support",
      icon: Target,
      href: "#pricing",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
    },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full border border-white/10">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20">
              <ExitPlansLogo className="text-blue-400" size={20} />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">
              YourExit<span className="text-blue-400">Plans</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">
            {links.filter(l => l.href !== "/login").map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-blue-400 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}

            {/* Pricing Mega Menu */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsPricingOpen(true)}
                onMouseLeave={() => setIsPricingOpen(false)}
                className="flex items-center gap-1 hover:text-blue-400 transition-colors font-medium"
              >
                Pricing
                <ChevronDown className={`h-4 w-4 transition-transform ${isPricingOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {isPricingOpen && (
                <div
                  onMouseEnter={() => setIsPricingOpen(true)}
                  onMouseLeave={() => setIsPricingOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {pricingOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className={`flex items-start gap-4 p-4 rounded-xl border ${option.borderColor} ${option.bgColor} hover:scale-[1.02] transition-all group`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${option.bgColor} shrink-0`}>
                          <option.icon className={`h-6 w-6 ${option.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${option.color} group-hover:text-white transition-colors`}>
                            {option.title}
                          </h3>
                          <p className="text-sm text-neutral-400 mt-1">
                            {option.description}
                          </p>
                        </div>
                        <ChevronDown className="h-5 w-5 text-neutral-500 -rotate-90 group-hover:text-blue-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              <Link href="/validate-idea">Get Started Free</Link>
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
                    <ExitPlansLogo className="text-blue-400" size={20} />
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

                  {/* Pricing Options in Mobile */}
                  <div className="px-4 py-2">
                    <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">Pricing</p>
                    {pricingOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-400/10 transition-colors mb-2"
                      >
                        <option.icon className={`h-5 w-5 ${option.color} shrink-0 mt-0.5`} />
                        <div>
                          <p className={`text-sm font-medium ${option.color}`}>{option.title}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">{option.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
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
                    <Link href="/validate-idea">Get Started Free</Link>
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
