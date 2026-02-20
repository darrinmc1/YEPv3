"use client"

// app/dashboard/page.tsx
// User dashboard — shows saved roadmaps, progress, and preference settings

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RoadmapDashboard, { RoadmapData } from "@/components/roadmap-dashboard"
import AiCoachChat from "@/components/ai-coach-chat"

interface SavedRoadmapSummary {
  id: string
  title: string
  businessType: string
  industry: string
  totalWeeks: number
  firstSaleTarget: string
  createdAt: string
  completedTasks: string[]
  totalTasks: number
  status: string
  preferences: {
    coachingStyle: string
    nudgeFrequency: string
    contentDepth: string
  }
}

const NUDGE_LABELS: Record<string, string> = {
  daily: "Daily updates",
  every_few_days: "Every few days",
  weekly: "Weekly check-ins",
  on_request: "Only when I ask",
}

const COACHING_LABELS: Record<string, string> = {
  direct: "Direct — just tell me what to do",
  explain_why: "Explain why — show me the reasoning",
  hand_holding: "Hand holding — walk me through it",
  challenging: "Push me — call me out",
}

const DEPTH_LABELS: Record<string, string> = {
  essential: "Essential only — bullet points",
  balanced: "Balanced — key concepts + examples",
  deep_dive: "Deep dive — full explanations",
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<SavedRoadmapSummary[]>([])
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData | null>(null)
  const [activeCompleted, setActiveCompleted] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState<string | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState("")
  const [chatOpen, setChatOpen] = useState(false)
  const [chatRoadmapId, setChatRoadmapId] = useState<string | undefined>(undefined)
  const [chatRoadmapTitle, setChatRoadmapTitle] = useState<string | undefined>(undefined)
  const [chatCoachingStyle, setChatCoachingStyle] = useState<string>("direct")
  const [nudgeSending, setNudgeSending] = useState<string | null>(null)
  const [nudgeMsg, setNudgeMsg] = useState<{ id: string; msg: string } | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") loadRoadmaps()
  }, [status])

  async function loadRoadmaps() {
    setLoading(true)
    try {
      const res = await fetch("/api/generate-roadmap")
      const data = await res.json()
      setRoadmaps(data.roadmaps || [])
    } catch { }
    setLoading(false)
  }

  async function openRoadmap(id: string) {
    const res = await fetch(`/api/get-roadmap?id=${id}`)
    const data = await res.json()
    if (data.roadmap) {
      setActiveRoadmap(data.roadmap)
      setActiveCompleted(data.completedTasks || [])
    }
  }

  async function sendNudge(roadmapId: string, requestType = 'check_in') {
    setNudgeSending(roadmapId)
    setNudgeMsg(null)
    try {
      const res = await fetch('/api/coach-nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId, requestType }),
      })
      const data = await res.json()
      setNudgeMsg({ id: roadmapId, msg: data.success ? '✓ Nudge sent to your inbox!' : '✗ Could not send nudge' })
      setTimeout(() => setNudgeMsg(null), 4000)
    } catch {
      setNudgeMsg({ id: roadmapId, msg: '✗ Could not send nudge' })
      setTimeout(() => setNudgeMsg(null), 4000)
    }
    setNudgeSending(null)
  }

  async function saveSettings(roadmapId: string, updates: {
    nudgeFrequency?: string
    coachingStyle?: string
    contentDepth?: string
  }) {
    setSavingSettings(true)
    setSettingsMsg("")
    try {
      const res = await fetch("/api/roadmap-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, ...updates }),
      })
      const data = await res.json()
      if (data.success) {
        setSettingsMsg("✓ Saved")
        // Update local state
        setRoadmaps(prev => prev.map(r =>
          r.id === roadmapId
            ? { ...r, preferences: { ...r.preferences, ...updates } }
            : r
        ))
        setTimeout(() => setSettingsMsg(""), 2000)
      }
    } catch { }
    setSavingSettings(false)
  }

  if (status === "loading" || loading) {
    return <div style={{ minHeight: "100vh", background: "#08080F", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontFamily: "system-ui, sans-serif" }}>Loading your dashboard...</div>
  }

  if (activeRoadmap) {
    return (
      <RoadmapDashboard
        roadmap={activeRoadmap}
        initialCompleted={activeCompleted}
        onStartOver={() => { setActiveRoadmap(null); loadRoadmaps() }}
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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 6 }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ color: "#888", fontSize: 15 }}>
            {roadmaps.length > 0 ? "Pick up where you left off, or start a new plan." : "Let&apos;s build your personalised launch roadmap."}
          </p>
        </div>

        {/* No roadmaps */}
        {roadmaps.length === 0 && (
          <div style={{ background: "#0F0F1E", border: "2px dashed #2A2A3E", borderRadius: 20, padding: "60px 40px", textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>No roadmap yet</h2>
            <p style={{ color: "#888", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.6 }}>
              Answer a few questions and we&apos;ll build your personalised day-by-day launch plan — adapted to your hours, coaching style, and goals.
            </p>
            <Link href="/build-roadmap" style={{ display: "inline-block", background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 20px rgba(249,115,22,0.3)" }}>
              🚀 Build My Roadmap
            </Link>
          </div>
        )}

        {/* Roadmap cards */}
        {roadmaps.map(r => {
          const pct = r.totalTasks > 0 ? Math.round((r.completedTasks.length / r.totalTasks) * 100) : 0
          const isSettingsOpen = settingsOpen === r.id

          return (
            <div key={r.id} style={{ background: "#0F0F1E", border: "1px solid #1E1E30", borderRadius: 18, marginBottom: 20, overflow: "hidden" }}>
              {/* Card header */}
              <div style={{ padding: "24px 24px 20px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#F97316", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{r.businessType} · {r.industry}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{r.totalWeeks} week plan · First sale target: {r.firstSaleTarget}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: pct > 0 ? "#22C55E" : "#888" }}>{pct}%</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{r.completedTasks.length}/{r.totalTasks} tasks</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 3, background: "#1A1A28" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#F97316,#22C55E)", transition: "width 0.4s" }} />
              </div>

              {/* Preferences summary bar */}
              <div style={{ padding: "14px 24px", background: "#0A0A14", borderTop: "1px solid #1A1A28", borderBottom: "1px solid #1A1A28", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                <PreferencePill icon="🎯" label="Updates" value={NUDGE_LABELS[r.preferences.coachingStyle] ?? r.preferences.nudgeFrequency} />
                <PreferencePill icon="🗣" label="Coaching" value={r.preferences.coachingStyle} />
                <PreferencePill icon="📖" label="Detail" value={r.preferences.contentDepth} />
                <button
                  onClick={() => setSettingsOpen(isSettingsOpen ? null : r.id)}
                  style={{ marginLeft: "auto", fontSize: 12, color: "#F97316", background: "none", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}
                >
                  {isSettingsOpen ? "Close settings" : "⚙ Change settings"}
                </button>
              </div>

              {/* Settings panel — inline, expands below preferences */}
              {isSettingsOpen && (
                <SettingsPanel
                  roadmap={r}
                  onSave={(updates) => saveSettings(r.id, updates)}
                  saving={savingSettings}
                  message={settingsMsg}
                />
              )}

              {/* Actions */}
              <div style={{ padding: "16px 24px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  onClick={() => openRoadmap(r.id)}
                  style={{ flex: 1, minWidth: 160, background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", border: "none", padding: "11px 0", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  Continue Roadmap →
                </button>
                <button
                  onClick={() => sendNudge(r.id, 'check_in')}
                  disabled={nudgeSending === r.id}
                  title="Get a personalised coaching nudge emailed to you"
                  style={{ background: "transparent", border: "1px solid rgba(249,115,22,0.3)", color: "#F97316", padding: "10px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {nudgeSending === r.id ? "Sending..." : "⚡ Nudge me"}
                </button>
                {nudgeMsg?.id === r.id && (
                  <span style={{ fontSize: 12, color: nudgeMsg.msg.startsWith('✓') ? '#22C55E' : '#F87171', fontWeight: 600 }}>{nudgeMsg.msg}</span>
                )}
                <div style={{ fontSize: 11, color: "#444", marginLeft: "auto" }}>
                  Started {new Date(r.createdAt).toLocaleDateString("en-AU")}
                </div>
              </div>
            </div>
          )
        })}

        {/* New roadmap button */}
        {roadmaps.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Link href="/build-roadmap" style={{ display: "inline-block", background: "transparent", border: "2px solid #2A2A3E", color: "#888", textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
              + Build Another Roadmap
            </Link>
          </div>
        )}

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
          {[
            { href: "/explore-ideas", label: "💡 Explore Ideas", desc: "Browse 1,000+ validated opportunities" },
            { href: "/validate-idea", label: "🔍 Validate an Idea", desc: "Free AI analysis" },
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

// ─── Small sub-components ─────────────────────────────────────────────────────

function PreferencePill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 11, color: "#555" }}>{label}:</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>{value}</span>
    </div>
  )
}

function SettingsPanel({ roadmap, onSave, saving, message }: {
  roadmap: SavedRoadmapSummary
  onSave: (updates: any) => void
  saving: boolean
  message: string
}) {
  const [nudge, setNudge] = useState(roadmap.preferences.nudgeFrequency)
  const [coaching, setCoaching] = useState(roadmap.preferences.coachingStyle)
  const [depth, setDepth] = useState(roadmap.preferences.contentDepth)

  const hasChanges = nudge !== roadmap.preferences.nudgeFrequency ||
    coaching !== roadmap.preferences.coachingStyle ||
    depth !== roadmap.preferences.contentDepth

  return (
    <div style={{ padding: "20px 24px 24px", borderBottom: "1px solid #1A1A28", background: "#080810" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Plan Preferences — changes take effect on next email & plan update
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>

        {/* Nudge frequency */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#AAA", marginBottom: 8 }}>📬 How often should I check in?</div>
          {[
            { v: "daily", l: "Daily", d: "Keep me accountable every day" },
            { v: "every_few_days", l: "Every few days", d: "Gentle reminders" },
            { v: "weekly", l: "Weekly", d: "Just milestone check-ins" },
            { v: "on_request", l: "Only when I ask", d: "I'll come to you" },
          ].map(o => (
            <SettingRow key={o.v} selected={nudge === o.v} onClick={() => setNudge(o.v)} label={o.l} desc={o.d} />
          ))}
        </div>

        {/* Coaching style */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#AAA", marginBottom: 8 }}>🗣 Coaching style</div>
          {[
            { v: "direct", l: "Direct", d: "Just tell me what to do" },
            { v: "explain_why", l: "Explain Why", d: "Show me the reasoning" },
            { v: "hand_holding", l: "Hand Holding", d: "Walk me through it" },
            { v: "challenging", l: "Push Me", d: "Call me out when I slack" },
          ].map(o => (
            <SettingRow key={o.v} selected={coaching === o.v} onClick={() => setCoaching(o.v)} label={o.l} desc={o.d} />
          ))}
        </div>

        {/* Content depth */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#AAA", marginBottom: 8 }}>📖 How much detail in updates?</div>
          {[
            { v: "essential", l: "Essential Only", d: "Bullet points, no fluff" },
            { v: "balanced", l: "Balanced", d: "Key points with examples" },
            { v: "deep_dive", l: "Deep Dive", d: "Full explanations & case studies" },
          ].map(o => (
            <SettingRow key={o.v} selected={depth === o.v} onClick={() => setDepth(o.v)} label={o.l} desc={o.d} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => onSave({ nudgeFrequency: nudge, coachingStyle: coaching, contentDepth: depth })}
          disabled={!hasChanges || saving}
          style={{ background: hasChanges ? "linear-gradient(135deg,#F97316,#EF4444)" : "#1A1A28", color: hasChanges ? "#fff" : "#444", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: hasChanges ? "pointer" : "not-allowed" }}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
        {message && <span style={{ fontSize: 13, color: "#22C55E", fontWeight: 700 }}>{message}</span>}
        {!hasChanges && <span style={{ fontSize: 12, color: "#444" }}>No changes</span>}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#444", lineHeight: 1.6 }}>
        These settings control: how often you receive email updates, the tone of your coaching emails, and how much detail is included in task explanations and weekly summaries.
      </div>
    </div>
  )
}

function SettingRow({ selected, onClick, label, desc }: { selected: boolean; onClick: () => void; label: string; desc: string }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", padding: "7px 0", cursor: "pointer", textAlign: "left" }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected ? "#F97316" : "#2A2A3E"}`, background: selected ? "#F97316" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected && <div style={{ width: 5, height: 5, background: "#fff", borderRadius: "50%" }} />}
      </div>
      <span style={{ fontSize: 13, fontWeight: selected ? 700 : 400, color: selected ? "#F5F5F0" : "#888" }}>{label}</span>
      <span style={{ fontSize: 11, color: "#555", marginLeft: 2 }}>— {desc}</span>
    </button>
  )
}
