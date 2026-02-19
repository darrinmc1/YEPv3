"use client"

// components/roadmap-settings-panel.tsx
// Settings panel for users to update their preferences after roadmap is created.
// These settings control: email frequency, content depth, coaching tone, plan status.

import { useState } from "react"

interface RoadmapSettings {
  nudgeFrequency: string
  contentDepth: string
  coachingStyle: string
  status: string
  startDate: string
}

const NUDGE_OPTIONS = [
  { value: "daily", label: "Daily", desc: "Every day I get today's task + a check-in", icon: "📅" },
  { value: "every_few_days", label: "Every Few Days", desc: "Check-ins every 2-3 days", icon: "📆" },
  { value: "weekly", label: "Weekly", desc: "One summary email each week", icon: "🗓️" },
  { value: "on_request", label: "Only When I Ask", desc: "No automatic emails — I'll come to you", icon: "🔕" },
]

const DEPTH_OPTIONS = [
  { value: "essential", label: "Essential Only", desc: "Bullet points and actions. No fluff." },
  { value: "balanced", label: "Balanced", desc: "Key concepts with examples." },
  { value: "deep_dive", label: "Deep Dive", desc: "Full explanations, case studies, expert refs." },
]

const COACHING_OPTIONS = [
  { value: "direct", label: "Direct", desc: "Tell me what to do. Skip the explanations." },
  { value: "explain_why", label: "Explain Why", desc: "Show me the reasoning behind each action." },
  { value: "hand_holding", label: "Hand Holding", desc: "Walk me through everything step by step." },
  { value: "challenging", label: "Push Me", desc: "Call me out. Be the tough coach." },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active", desc: "On track — keep sending updates", color: "#22C55E" },
  { value: "paused", label: "Paused", desc: "Taking a break — pause all emails", color: "#FBBF24" },
  { value: "completed", label: "Completed", desc: "I've finished this roadmap", color: "#60A5FA" },
]

export default function RoadmapSettingsPanel({
  roadmapId,
  initialSettings,
  onSaved,
  onClose,
}: {
  roadmapId: string
  initialSettings: RoadmapSettings
  onSaved?: (settings: RoadmapSettings) => void
  onClose?: () => void
}) {
  const [settings, setSettings] = useState<RoadmapSettings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  function update(key: keyof RoadmapSettings, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/roadmap-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, settings }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSaved(true)
      onSaved?.(settings)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  const s: React.CSSProperties = { fontFamily: "system-ui, sans-serif", color: "#F5F5F0" }

  return (
    <div style={{ ...s, background: "#0A0A14", border: "1px solid #1E1E30", borderRadius: 20, overflow: "hidden", maxWidth: 560 }}>
      {/* Header */}
      <div style={{ background: "#0F0F1E", borderBottom: "1px solid #1E1E30", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Roadmap Settings</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Change how your coach communicates with you</div>
        </div>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer", padding: 4 }}>✕</button>}
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Update frequency */}
        <section>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>How often should I check in?</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>This controls how often you receive emails and task reminders.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {NUDGE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => update("nudgeFrequency", o.value)} style={{ background: settings.nudgeFrequency === o.value ? "rgba(249,115,22,0.08)" : "#111120", border: `2px solid ${settings.nudgeFrequency === o.value ? "#F97316" : "#2A2A3E"}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{o.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: settings.nudgeFrequency === o.value ? "#F97316" : "#EEE" }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{o.desc}</div>
                </div>
                {settings.nudgeFrequency === o.value && <span style={{ marginLeft: "auto", color: "#F97316", fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Content depth */}
        <section>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>How much detail in updates?</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Applies to emails, task descriptions, and AI coach responses.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEPTH_OPTIONS.map(o => (
              <button key={o.value} onClick={() => update("contentDepth", o.value)} style={{ background: settings.contentDepth === o.value ? "rgba(249,115,22,0.08)" : "#111120", border: `2px solid ${settings.contentDepth === o.value ? "#F97316" : "#2A2A3E"}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: settings.contentDepth === o.value ? "#F97316" : "#EEE" }}>{o.label}</span>
                  <span style={{ fontSize: 12, color: "#777", marginLeft: 10 }}>{o.desc}</span>
                </div>
                {settings.contentDepth === o.value && <span style={{ color: "#F97316" }}>✓</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Coaching style */}
        <section>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Coaching tone</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>How your AI coach speaks to you.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {COACHING_OPTIONS.map(o => (
              <button key={o.value} onClick={() => update("coachingStyle", o.value)} style={{ background: settings.coachingStyle === o.value ? "rgba(249,115,22,0.08)" : "#111120", border: `2px solid ${settings.coachingStyle === o.value ? "#F97316" : "#2A2A3E"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: settings.coachingStyle === o.value ? "#F97316" : "#EEE", marginBottom: 3 }}>{o.label}</div>
                <div style={{ fontSize: 11, color: "#777", lineHeight: 1.4 }}>{o.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Plan status */}
        <section>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Plan status</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Pausing stops all automatic emails until you reactivate.</div>
          <div style={{ display: "flex", gap: 10 }}>
            {STATUS_OPTIONS.map(o => (
              <button key={o.value} onClick={() => update("status", o.value)} style={{ flex: 1, background: settings.status === o.value ? `rgba(${o.color === "#22C55E" ? "34,197,94" : o.color === "#FBBF24" ? "251,191,36" : "96,165,250"},0.1)` : "#111120", border: `2px solid ${settings.status === o.value ? o.color : "#2A2A3E"}`, borderRadius: 12, padding: "10px 8px", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: settings.status === o.value ? o.color : "#AAA", marginBottom: 2 }}>{o.label}</div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.3 }}>{o.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Start date */}
        <section>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Roadmap start date</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>This is what &quot;Day 1&quot; is calculated from. Adjust if you started late or want to reset.</div>
          <input
            type="date"
            value={settings.startDate ? settings.startDate.split("T")[0] : ""}
            onChange={e => update("startDate", new Date(e.target.value).toISOString())}
            style={{ background: "#111120", border: "2px solid #2A2A3E", borderRadius: 10, color: "#F5F5F0", fontSize: 14, padding: "10px 14px", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }}
          />
        </section>

        {/* Save button */}
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#EF4444" }}>{error}</div>}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? "#1E1E2E" : "linear-gradient(135deg,#F97316,#EF4444)", color: saving ? "#555" : "#fff", border: "none", padding: "14px 0", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer", boxShadow: saving ? "none" : "0 4px 20px rgba(249,115,22,0.3)", transition: "all 0.2s" }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Settings"}
        </button>

        <div style={{ fontSize: 12, color: "#555", textAlign: "center", marginTop: -12 }}>
          Changes take effect immediately. Email frequency updates apply to your next scheduled send.
        </div>
      </div>
    </div>
  )
}
