"use client"

// app/dashboard/page.tsx
// User dashboard — shown after login. Shows saved roadmaps and navigation.

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RoadmapDashboard, { RoadmapData } from "@/components/roadmap-dashboard"

interface SavedRoadmap {
  id: string
  title: string
  businessType: string
  totalWeeks: number
  firstSaleTarget: string
  createdAt: string
  completedTasks: string[]
  totalTasks: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([])
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData | null>(null)
  const [activeCompleted, setActiveCompleted] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/generate-roadmap")
        .then(r => r.json())
        .then(data => { setRoadmaps(data.roadmaps || []); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [status])

  async function openRoadmap(id: string, completed: string[]) {
    const res = await fetch(`/api/get-roadmap?id=${id}`)
    const data = await res.json()
    if (data.roadmap) {
      setActiveRoadmap(data.roadmap)
      setActiveCompleted(completed)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#08080F", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontFamily: "system-ui, sans-serif" }}>
        Loading your dashboard...
      </div>
    )
  }

  if (activeRoadmap) {
    return (
      <RoadmapDashboard
        roadmap={activeRoadmap}
        initialCompleted={activeCompleted}
        onStartOver={() => setActiveRoadmap(null)}
      />
    )
  }

  const firstName = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there"

  return (
    <div style={{ minHeight: "100vh", background: "#08080F", color: "#F5F5F0", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1A1A2E", background: "#0A0A14", padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ fontWeight: 900, fontSize: 18, color: "#F97316", textDecoration: "none" }}>YourExitPlans</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#888" }}>{session?.user?.email}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ fontSize: 12, color: "#666", background: "none", border: "1px solid #2A2A3E", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 6 }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ color: "#888", fontSize: 15 }}>
            {roadmaps.length > 0 ? "Pick up where you left off, or build a new roadmap." : "Let's build your personalised launch roadmap."}
          </p>
        </div>

        {/* No roadmaps yet */}
        {roadmaps.length === 0 && (
          <div style={{ background: "#0F0F1E", border: "2px dashed #2A2A3E", borderRadius: 20, padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>You don't have a roadmap yet</h2>
            <p style={{ color: "#888", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.6 }}>
              Answer a few questions about your business and we'll build you a personalised day-by-day launch plan.
            </p>
            <Link href="/build-roadmap" style={{ display: "inline-block", background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 20px rgba(249,115,22,0.3)" }}>
              🚀 Build My Roadmap
            </Link>
          </div>
        )}

        {/* Existing roadmaps */}
        {roadmaps.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
              {roadmaps.map(r => {
                const pct = r.totalTasks > 0 ? Math.round((r.completedTasks.length / r.totalTasks) * 100) : 0
                return (
                  <div key={r.id} style={{ background: "#0F0F1E", border: "1px solid #1E1E30", borderRadius: 16, padding: 20 }}>
                    <div style={{ fontSize: 11, color: "#F97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{r.businessType}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4, lineHeight: 1.3 }}>{r.title}</div>
                    <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                      {r.totalWeeks} weeks · First sale: {r.firstSaleTarget}
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#666" }}>Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: pct > 0 ? "#22C55E" : "#888" }}>{pct}%</span>
                      </div>
                      <div style={{ background: "#1A1A28", borderRadius: 99, height: 4 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "#22C55E", borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{r.completedTasks.length} of {r.totalTasks} tasks complete</div>
                    </div>

                    <button
                      onClick={() => openRoadmap(r.id, r.completedTasks)}
                      style={{ width: "100%", background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", border: "none", padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                    >
                      Continue →
                    </button>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 8, textAlign: "center" }}>
                      Created {new Date(r.createdAt).toLocaleDateString("en-AU")}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/build-roadmap" style={{ display: "inline-block", background: "transparent", border: "2px solid #2A2A3E", color: "#888", textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
                + Build Another Roadmap
              </Link>
            </div>
          </>
        )}

        {/* Quick links */}
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { href: "/explore-ideas", label: "💡 Explore Ideas", desc: "Browse 1,000+ validated opportunities" },
            { href: "/validate-idea", label: "🔍 Validate an Idea", desc: "Free AI analysis of your idea" },
            { href: "/templates", label: "📋 Templates", desc: "Business documents & tools" },
            { href: "/pricing", label: "⭐ Upgrade Plan", desc: "Unlock more features" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ background: "#0F0F1E", border: "1px solid #1E1E30", borderRadius: 12, padding: "16px", textDecoration: "none", display: "block" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#F5F5F0", marginBottom: 4 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{l.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
