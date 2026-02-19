"use client"

// app/build-roadmap/page.tsx
// Intake → Generating → Dashboard flow

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import IntakeFlow, { IntakeData } from "@/components/intake-flow"
import RoadmapDashboard, { RoadmapData } from "@/components/roadmap-dashboard"

type Step = "intake" | "generating" | "dashboard" | "error"

const LOADING_MSGS = [
  "Reading your answers...",
  "Calculating your timeline based on your hours...",
  "Building your personalised phase breakdown...",
  "Writing industry-specific tasks for your business...",
  "Adding extra support for your weak areas...",
  "Matching your coaching style...",
  "Finding the right experts for your journey...",
  "Final review — making sure this is actually useful...",
]

export default function BuildRoadmapPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<Step>("intake")
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [error, setError] = useState("")
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/build-roadmap")
    return null
  }

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", background: "#08080F", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>Loading...</div>
  }

  async function handleIntakeComplete(intakeData: IntakeData) {
    setStep("generating")
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[idx])
    }, 3000)

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...intakeData, tier: "starter", intake_completed_at: new Date().toISOString() }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (!res.ok || !data.success) throw new Error(data.error ?? "Generation failed")
      setRoadmap(data.roadmap)
      setStep("dashboard")
    } catch (err) {
      clearInterval(interval)
      setError(String(err))
      setStep("error")
    }
  }

  if (step === "intake") return <IntakeFlow onComplete={handleIntakeComplete} />

  if (step === "generating") return (
    <div style={{ minHeight: "100vh", background: "#08080F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ position: "relative", marginBottom: 48 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#F97316,#EF4444 60%,#7C3AED)", animation: "pulse 2s ease-in-out infinite", boxShadow: "0 0 60px rgba(249,115,22,0.4)" }} />
      </div>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <h1 style={{ fontWeight: 900, fontSize: 26, marginBottom: 8, color: "#F5F5F0" }}>Building Your Roadmap</h1>
        <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>Your AI coach is reading everything you told us and building a plan for your specific situation.</p>
        <div style={{ background: "#0F0F1E", border: "1px solid #1E1E30", borderRadius: 10, padding: "14px 18px" }}>
          <span style={{ fontSize: 14, color: "#F97316", fontStyle: "italic" }}>{loadingMsg}</span>
        </div>
        <p style={{ fontSize: 12, color: "#444", marginTop: 16 }}>Takes 15–30 seconds.</p>
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }`}</style>
    </div>
  )

  if (step === "error") return (
    <div style={{ minHeight: "100vh", background: "#08080F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
        <h1 style={{ fontWeight: 800, fontSize: 22, color: "#F5F5F0", marginBottom: 8 }}>Something went sideways</h1>
        <p style={{ color: "#888", marginBottom: 24, lineHeight: 1.6 }}>{error || "We couldn't generate your roadmap right now."}</p>
        <button onClick={() => setStep("intake")} style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Try Again</button>
      </div>
    </div>
  )

  return <RoadmapDashboard roadmap={roadmap!} onStartOver={() => { setRoadmap(null); setStep("intake") }} />
}
