"use client"

// components/roadmap-dashboard.tsx
// Interactive day-by-day roadmap view. Syncs completed tasks to the database.

import { useState, useMemo, useCallback } from "react"

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  action: { label: "Action", color: "#60A5FA", bg: "rgba(96,165,250,0.1)", icon: "⚡" },
  research: { label: "Research", color: "#A78BFA", bg: "rgba(167,139,250,0.1)", icon: "🔍" },
  creation: { label: "Create", color: "#34D399", bg: "rgba(52,211,153,0.1)", icon: "✏️" },
  outreach: { label: "Outreach", color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: "📬" },
  review: { label: "Review", color: "#FBBF24", bg: "rgba(251,191,36,0.1)", icon: "📋" },
  milestone: { label: "Milestone", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: "🎯" },
}

export interface RoadmapData {
  id: string
  generated_at: string
  intake_summary: {
    business_name: string
    business_type: string
    hours_per_week: string
    timeline_weeks: number
    first_sale_target: string
    coaching_style: string
  }
  executive_summary: string
  coach_message: string
  phases: any[]
  tasks: any[]
  total_days: number
  total_weeks: number
  milestones: { day: number; label: string; description: string }[]
}

export default function RoadmapDashboard({
  roadmap,
  initialCompleted = [],
  onStartOver,
}: {
  roadmap: RoadmapData
  initialCompleted?: string[]
  onStartOver?: () => void
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [activeView, setActiveView] = useState<"today" | "week" | "all">("today")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [saving, setSaving] = useState(false)

  const saveProgress = useCallback(async (newCompleted: Set<string>) => {
    setSaving(true)
    try {
      await fetch("/api/roadmap-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId: roadmap.id, completedTasks: [...newCompleted] }),
      })
    } catch (e) { console.warn("Progress save failed", e) }
    finally { setSaving(false) }
  }, [roadmap.id])

  function toggleTask(id: string) {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      saveProgress(next)
      return next
    })
  }

  const todayTasks = useMemo(() => roadmap.tasks.filter((t: any) => t.day === currentDay), [roadmap.tasks, currentDay])
  const weekTasks = useMemo(() => roadmap.tasks.filter((t: any) => t.week === Math.ceil(currentDay / 7)), [roadmap.tasks, currentDay])
  const progressPct = useMemo(() => roadmap.tasks.length ? Math.round((completed.size / roadmap.tasks.length) * 100) : 0, [completed, roadmap.tasks])
  const nextMilestone = useMemo(() => roadmap.milestones.find((m: any) => m.day > currentDay), [roadmap.milestones, currentDay])

  const displayTasks = activeView === "today" ? todayTasks : activeView === "week" ? weekTasks : roadmap.tasks

  return (
    <div style={{ minHeight: "100vh", background: "#08080F", color: "#F5F5F0", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1A1A2E", background: "#0A0A14", position: "sticky", top: 0, zIndex: 40, padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#F97316" }}>YourExitPlans</span>
            <span style={{ color: "#333" }}>|</span>
            <span style={{ fontSize: 14, color: "#888" }}>My Roadmap</span>
            {saving && <span style={{ fontSize: 12, color: "#555" }}>saving...</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {onStartOver && <button onClick={onStartOver} style={{ fontSize: 12, color: "#666", background: "none", border: "none", cursor: "pointer" }}>+ New Roadmap</button>}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase" }}>Overall Progress</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: progressPct > 0 ? "#22C55E" : "#888" }}>{progressPct}%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 80px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 28 }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Plan summary */}
          <Card>
            <Label12>Your Plan</Label12>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{roadmap.intake_summary.business_name || roadmap.intake_summary.business_type}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 14, lineHeight: 1.6 }}>{roadmap.coach_message}</div>
            {[
              ["Duration", `${roadmap.total_weeks} weeks`],
              ["First sale target", roadmap.intake_summary.first_sale_target],
              ["Hours/week", roadmap.intake_summary.hours_per_week],
              ["Coaching style", roadmap.intake_summary.coaching_style],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px solid #1A1A28" }}>
                <span style={{ color: "#666" }}>{k}</span>
                <span style={{ fontWeight: 700, color: "#DDD" }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Day navigator */}
          <Card>
            <Label12>Navigate Days</Label12>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <NavBtn onClick={() => setCurrentDay(d => Math.max(1, d - 1))}>←</NavBtn>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 26, color: "#F97316" }}>Day {currentDay}</div>
                <div style={{ fontSize: 12, color: "#666" }}>Week {Math.ceil(currentDay / 7)} of {roadmap.total_weeks}</div>
              </div>
              <NavBtn onClick={() => setCurrentDay(d => Math.min(roadmap.total_days, d + 1))}>→</NavBtn>
            </div>
            <input type="range" min={1} max={roadmap.total_days} value={currentDay} onChange={e => setCurrentDay(Number(e.target.value))} style={{ width: "100%", accentColor: "#F97316" }} />
          </Card>

          {/* Next milestone */}
          {nextMilestone && (
            <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 14, padding: 16 }}>
              <Label12 color="#F97316">Next Milestone</Label12>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{nextMilestone.label}</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{nextMilestone.description}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#F97316" }}>Day {nextMilestone.day} · {nextMilestone.day - currentDay} days away</div>
            </div>
          )}

          {/* Phase progress */}
          {roadmap.phases.length > 0 && (
            <Card>
              <Label12>Phase Progress</Label12>
              {roadmap.phases.map((phase: any) => {
                const pts = roadmap.tasks.filter((t: any) => t.phase === phase.number)
                const pct = pts.length ? Math.round((pts.filter((t: any) => completed.has(t.id)).length / pts.length) * 100) : 0
                return (
                  <div key={phase.number} style={{ padding: "8px 0", borderBottom: "1px solid #1A1A28" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: pct === 100 ? "#22C55E" : "#DDD" }}>{phase.number}. {phase.name}</span>
                      <span style={{ fontSize: 11, color: "#666" }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#1A1A28", borderRadius: 99, height: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22C55E" : "#F97316", borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                  </div>
                )
              })}
            </Card>
          )}
        </div>

        {/* Main */}
        <div>
          {/* Executive summary */}
          {activeView === "all" && roadmap.executive_summary && (
            <Card style={{ marginBottom: 20 }}>
              <Label12 color="#F97316">Your Personalised Plan Overview</Label12>
              <div style={{ fontSize: 14, color: "#CCC", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{roadmap.executive_summary}</div>
            </Card>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0F0F1E", border: "1px solid #1E1E30", borderRadius: 12, padding: 4 }}>
            {(["today", "week", "all"] as const).map(v => (
              <button key={v} onClick={() => setActiveView(v)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: activeView === v ? "#F97316" : "transparent", color: activeView === v ? "#fff" : "#888", fontWeight: 700, fontSize: 13 }}>
                {v === "today" ? `Today (Day ${currentDay})` : v === "week" ? `This Week (${weekTasks.length})` : `Full Plan (${roadmap.tasks.length})`}
              </button>
            ))}
          </div>

          {/* Tasks */}
          {displayTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>No tasks scheduled today</div>
              <div style={{ fontSize: 14 }}>Rest day or you&apos;re ahead of schedule.</div>
              <button onClick={() => setCurrentDay(d => d + 1)} style={{ marginTop: 20, background: "#F97316", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>View tomorrow →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {displayTasks.map((task: any, i: number) => {
                const cfg = TYPE_CONFIG[task.type] ?? TYPE_CONFIG.action
                const done = completed.has(task.id)
                const isExpanded = expanded === task.id

                return (
                  <div key={task.id} style={{ background: done ? "#0A110A" : "#0F0F1E", border: `1px solid ${done ? "#166534" : task.is_milestone ? "rgba(249,115,22,0.4)" : "#1E1E30"}`, borderRadius: 14, overflow: "hidden", opacity: done ? 0.75 : 1 }}>
                    <div onClick={() => setExpanded(isExpanded ? null : task.id)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <button onClick={e => { e.stopPropagation(); toggleTask(task.id) }} style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${done ? "#22C55E" : "#333"}`, background: done ? "#22C55E" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                        {done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: cfg.bg, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
                          {task.is_milestone && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "rgba(249,115,22,0.15)", color: "#F97316" }}>⭐ {task.milestone_label}</span>}
                          {activeView !== "today" && <span style={{ fontSize: 10, color: "#555", padding: "2px 6px" }}>Day {task.day}</span>}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: done ? "#666" : "#F5F5F0", textDecoration: done ? "line-through" : "none", marginBottom: 3 }}>{task.title}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>⏱ {task.time_estimate} · {task.phase_name}</div>
                      </div>
                      <span style={{ color: "#444", fontSize: 14, flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "0 18px 18px 52px", borderTop: "1px solid #1A1A28" }}>
                        <p style={{ fontSize: 14, color: "#CCC", lineHeight: 1.7, marginTop: 14 }}>{task.description}</p>
                        {task.completion_criteria && (
                          <div style={{ marginTop: 10, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E", marginBottom: 3, textTransform: "uppercase" }}>Done when:</div>
                            <div style={{ fontSize: 13, color: "#AAA" }}>{task.completion_criteria}</div>
                          </div>
                        )}
                        {task.resources?.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Resources</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {task.resources.map((r: string, i: number) => <span key={i} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: "#1A1A2E", border: "1px solid #2A2A40", color: "#AAA" }}>{r}</span>)}
                            </div>
                          </div>
                        )}
                        <button onClick={() => toggleTask(task.id)} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, background: done ? "transparent" : "#22C55E", border: done ? "1px solid #166834" : "none", color: done ? "#22C55E" : "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          {done ? "↩ Mark Incomplete" : "✓ Mark Complete"}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "#0F0F1E", border: "1px solid #1E1E30", borderRadius: 14, padding: 18, ...style }}>{children}</div>
}

function Label12({ children, color }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: color ?? "#888", textTransform: "uppercase", marginBottom: 10 }}>{children}</div>
}

function NavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #2A2A3E", background: "#0A0A14", color: "#888", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</button>
}
