"use client"

// components/intake-flow.tsx
// 5-stage conversational intake form

import { useState, useEffect, useRef } from "react"

export interface IntakeData {
  business: { description: string; type: string; stage: string; name: string }
  customer: { description: string; type: string; industry: string; problem_solved: string; competitors: string }
  resources: { hours_per_week: string; budget: string; strengths: string[]; biggest_gap: string }
  goals: { first_customer_timeline: string; revenue_12_month: string; success_definition: string }
  preferences: { coaching_style: string; nudge_frequency: string; content_depth: string; current_challenge: string }
}

const STAGES = [
  { number: 1, title: "The Big Picture", subtitle: "What are you building?", time: "2-3 min" },
  { number: 2, title: "Your Customer", subtitle: "Who's giving you money?", time: "2-3 min" },
  { number: 3, title: "Your Resources", subtitle: "What do you have to work with?", time: "2-3 min" },
  { number: 4, title: "Your Goals", subtitle: "Where does success live?", time: "1-2 min" },
  { number: 5, title: "Your Style", subtitle: "How should I coach you?", time: "1-2 min" },
]

const BUSINESS_TYPES = [
  { value: "service", label: "Service / Consulting", emoji: "🤝" },
  { value: "digital_product", label: "Digital Product", emoji: "💻" },
  { value: "saas", label: "SaaS / Software", emoji: "⚙️" },
  { value: "physical_product", label: "Physical Product", emoji: "📦" },
  { value: "content", label: "Content / Creator", emoji: "✍️" },
  { value: "local", label: "Local Business", emoji: "🏪" },
  { value: "marketplace", label: "Marketplace", emoji: "🔁" },
  { value: "hybrid", label: "Hybrid / Not Sure", emoji: "🤔" },
]

const STAGE_OPTIONS = [
  { value: "idea", label: "Just an idea in my head", emoji: "💭" },
  { value: "researching", label: "Researching and learning", emoji: "🔍" },
  { value: "validated", label: "Idea validated, ready to build", emoji: "✅" },
  { value: "building_mvp", label: "Currently building my MVP", emoji: "🔨" },
  { value: "have_mvp", label: "Have an MVP, need customers", emoji: "🚀" },
  { value: "first_customers", label: "Have a few customers already", emoji: "💰" },
  { value: "growing", label: "Growing and scaling", emoji: "📈" },
]

const HOURS_OPTIONS = [
  { value: "5-10", label: "5–10 hours/week", sub: "Side hustle pace" },
  { value: "10-20", label: "10–20 hours/week", sub: "Serious commitment" },
  { value: "20-40", label: "20–40 hours/week", sub: "Near full-time" },
  { value: "40+", label: "40+ hours/week", sub: "All in" },
]

const BUDGET_OPTIONS = [
  { value: "0", label: "$0 — bootstrapping", emoji: "🥾" },
  { value: "under_500", label: "Under $500", emoji: "💵" },
  { value: "500-2000", label: "$500 – $2,000", emoji: "💳" },
  { value: "2000-10000", label: "$2,000 – $10,000", emoji: "💰" },
  { value: "10000+", label: "$10,000+", emoji: "🏦" },
]

const SKILLS_OPTIONS = [
  "Writing / Content", "Design / Visual", "Coding / Tech", "Sales / Closing",
  "Marketing / Growth", "Operations / Systems", "Finance / Numbers",
  "Networking", "Teaching / Coaching", "Domain Expertise",
]

const COACHING_STYLES = [
  { value: "direct", label: "Direct", desc: "Just tell me what to do. Skip the explanations." },
  { value: "explain_why", label: "Explain Why", desc: "Show me the reasoning so I can adapt." },
  { value: "hand_holding", label: "Hand Holding", desc: "I'm new. Walk me through everything." },
  { value: "challenging", label: "Push Me", desc: "Call me out. Be the tough coach I need." },
]

const DEPTH_OPTIONS = [
  { value: "essential", label: "Essential Only", desc: "Bullet points and actions. Fast." },
  { value: "balanced", label: "Balanced", desc: "Key concepts + examples." },
  { value: "deep_dive", label: "Deep Dive", desc: "Full explanations, case studies, everything." },
]

export default function IntakeFlow({ onComplete }: { onComplete: (data: IntakeData) => void }) {
  const [stage, setStage] = useState(1)
  const [animating, setAnimating] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState<IntakeData>({
    business: { description: "", type: "", stage: "", name: "" },
    customer: { description: "", type: "", industry: "", problem_solved: "", competitors: "" },
    resources: { hours_per_week: "", budget: "", strengths: [], biggest_gap: "" },
    goals: { first_customer_timeline: "", revenue_12_month: "", success_definition: "" },
    preferences: { coaching_style: "", nudge_frequency: "", content_depth: "", current_challenge: "" },
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem("yep_intake_v2")
      if (saved) {
        const { d, s } = JSON.parse(saved)
        setData(d); setStage(s)
      }
    } catch { }
  }, [])

  useEffect(() => {
    localStorage.setItem("yep_intake_v2", JSON.stringify({ d: data, s: stage }))
    window.scrollTo(0, 0)
  }, [data, stage])

  function advance() {
    if (stage < 5) {
      setAnimating(true)
      setTimeout(() => { setStage(s => s + 1); setAnimating(false); topRef.current?.scrollIntoView({ behavior: "smooth" }) }, 280)
    } else {
      localStorage.removeItem("yep_intake_v2")
      onComplete(data)
    }
  }

  function back() {
    if (stage > 1) {
      setAnimating(true)
      setTimeout(() => { setStage(s => s - 1); setAnimating(false) }, 280)
    }
  }

  const upd = {
    b: (k: keyof IntakeData["business"], v: string) => setData(d => ({ ...d, business: { ...d.business, [k]: v } })),
    c: (k: keyof IntakeData["customer"], v: string) => setData(d => ({ ...d, customer: { ...d.customer, [k]: v } })),
    r: (k: keyof IntakeData["resources"], v: string | string[]) => setData(d => ({ ...d, resources: { ...d.resources, [k]: v } })),
    g: (k: keyof IntakeData["goals"], v: string) => setData(d => ({ ...d, goals: { ...d.goals, [k]: v } })),
    p: (k: keyof IntakeData["preferences"], v: string) => setData(d => ({ ...d, preferences: { ...d.preferences, [k]: v } })),
    skill: (s: string) => setData(d => {
      const cur = d.resources.strengths
      return { ...d, resources: { ...d.resources, strengths: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] } }
    }),
  }

  function canAdvance(): boolean {
    if (stage === 1) return data.business.description.length > 30 && !!data.business.type && !!data.business.stage
    if (stage === 2) return data.customer.description.length > 20 && !!data.customer.type && !!data.customer.industry && data.customer.problem_solved.length > 20
    if (stage === 3) return !!data.resources.hours_per_week && !!data.resources.budget && data.resources.strengths.length > 0 && !!data.resources.biggest_gap
    if (stage === 4) return !!data.goals.first_customer_timeline && !!data.goals.revenue_12_month
    if (stage === 5) return !!data.preferences.coaching_style && !!data.preferences.content_depth && !!data.preferences.nudge_frequency
    return false
  }

  const progress = ((stage - 1) / 5) * 100

  const ts: React.CSSProperties = { width: "100%", background: "#111120", border: "2px solid #2A2A3E", borderRadius: 12, color: "#F5F5F0", fontSize: 14, padding: "14px 16px", fontFamily: "inherit", resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const }
  const is: React.CSSProperties = { width: "100%", background: "#111120", border: "2px solid #2A2A3E", borderRadius: 12, color: "#F5F5F0", fontSize: 14, padding: "14px 16px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F5F5F0", fontFamily: "system-ui, sans-serif" }}>
      {/* Progress */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#0A0A0F", borderBottom: "1px solid #1E1E2E", padding: "14px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: "#F97316" }}>YourExitPlans</span>
            <span style={{ fontSize: 13, color: "#888" }}>Step {stage} of 5 · {STAGES[stage - 1].time}</span>
          </div>
          <div style={{ background: "#1E1E2E", borderRadius: 99, height: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#F97316,#EF4444)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 120px", opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "all 0.28s" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#F97316", textTransform: "uppercase", marginBottom: 6 }}>Stage {stage} — {STAGES[stage - 1].title}</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>{STAGES[stage - 1].subtitle}</h1>
        </div>

        {/* STAGE 1 */}
        {stage === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Tell me about your business idea</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>2-3 sentences is perfect. Don't overthink it.</div>
            <textarea value={data.business.description} onChange={e => upd.b("description", e.target.value)} placeholder="e.g. I want to help freelance designers manage client contracts without needing accounting software..." style={ts} rows={4} />
            <div style={{ fontSize: 12, color: data.business.description.length > 30 ? "#22C55E" : "#888", marginTop: 4 }}>{data.business.description.length > 30 ? "✓ Good" : `${30 - data.business.description.length} more characters`}</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>What type of business is this?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
              {BUSINESS_TYPES.map(o => <Opt key={o.value} selected={data.business.type === o.value} onClick={() => upd.b("type", o.value)} emoji={o.emoji} label={o.label} />)}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Where are you in the journey?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STAGE_OPTIONS.map(o => <RadioRow key={o.value} selected={data.business.stage === o.value} onClick={() => upd.b("stage", o.value)} emoji={o.emoji} label={o.label} />)}
            </div>
          </div>
        </div>}

        {/* STAGE 2 */}
        {stage === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Who is your ideal customer?</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>"Everyone" is not an answer. Job title, situation, context.</div>
            <textarea value={data.customer.description} onChange={e => upd.c("description", e.target.value)} placeholder="e.g. Freelance graphic designers, 5+ years experience, $3-8k/month, struggling with scope creep..." style={ts} rows={3} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>B2B or B2C?</div>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ v: "b2b", l: "B2B — Businesses" }, { v: "b2c", l: "B2C — Consumers" }, { v: "both", l: "Both" }].map(o => (
                <button key={o.v} onClick={() => upd.c("type", o.v)} style={{ padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `2px solid ${data.customer.type === o.v ? "#F97316" : "#2A2A3E"}`, background: data.customer.type === o.v ? "rgba(249,115,22,0.1)" : "transparent", color: data.customer.type === o.v ? "#F97316" : "#888" }}>{o.l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>What industry are you in?</div>
            <input type="text" value={data.customer.industry} onChange={e => upd.c("industry", e.target.value)} placeholder="e.g. Freelance Design, Legal Tech, Health & Wellness..." style={is} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>What's the core problem you solve?</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>In their words, not yours. What do they complain about?</div>
            <textarea value={data.customer.problem_solved} onChange={e => upd.c("problem_solved", e.target.value)} placeholder="e.g. Clients change scope but won't pay more. I lose thousands because I'm too awkward to enforce contracts..." style={ts} rows={3} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Main competitors? <span style={{ fontWeight: 400, color: "#888" }}>(Optional)</span></div>
            <input type="text" value={data.customer.competitors} onChange={e => upd.c("competitors", e.target.value)} placeholder="e.g. HoneyBook, Bonsai, Wave..." style={is} />
          </div>
        </div>}

        {/* STAGE 3 */}
        {stage === 3 && <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Hours per week you can commit?</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>The single biggest factor in your timeline. Be honest.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {HOURS_OPTIONS.map(o => <RadioRow key={o.value} selected={data.resources.hours_per_week === o.value} onClick={() => upd.r("hours_per_week", o.value)} label={o.label} sub={o.sub} />)}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Monthly budget for tools/expenses?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
              {BUDGET_OPTIONS.map(o => <Opt key={o.value} selected={data.resources.budget === o.value} onClick={() => upd.r("budget", o.value)} emoji={o.emoji} label={o.label} />)}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Your strengths? <span style={{ fontWeight: 400, color: "#888" }}>Pick all that apply</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SKILLS_OPTIONS.map(s => (
                <button key={s} onClick={() => upd.skill(s)} style={{ padding: "8px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `2px solid ${data.resources.strengths.includes(s) ? "#F97316" : "#2A2A3E"}`, background: data.resources.strengths.includes(s) ? "rgba(249,115,22,0.1)" : "transparent", color: data.resources.strengths.includes(s) ? "#F97316" : "#888" }}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Your biggest skill gap or weakness?</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>The thing that makes you nervous. We'll give you extra support there.</div>
            <input type="text" value={data.resources.biggest_gap} onChange={e => upd.r("biggest_gap", e.target.value)} placeholder="e.g. Sales and closing, technical development, marketing..." style={is} />
          </div>
        </div>}

        {/* STAGE 4 */}
        {stage === 4 && <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>When do you want your first paying customer?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ v: "2_weeks", l: "In 2 weeks", s: "Aggressive. Possible if MVP is simple." }, { v: "1_month", l: "Within 1 month", s: "Ambitious. Requires focused effort." }, { v: "3_months", l: "Within 3 months", s: "Realistic for most people." }, { v: "6_months", l: "Within 6 months", s: "Building properly." }, { v: "no_rush", l: "No rush", s: "Exploring. That's fine too." }].map(o => (
                <RadioRow key={o.v} selected={data.goals.first_customer_timeline === o.v} onClick={() => upd.g("first_customer_timeline", o.v)} label={o.l} sub={o.s} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>12-month revenue target?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ v: "1-5k", l: "$1k–$5k/month", s: "Replace a bill or two." }, { v: "5-10k", l: "$5k–$10k/month", s: "Serious side hustle." }, { v: "10-25k", l: "$10k–$25k/month", s: "Full salary replacement." }, { v: "25k+", l: "$25k+/month", s: "Building a real business." }, { v: "unsure", l: "Not sure yet", s: "Honest. We'll figure it out." }].map(o => (
                <RadioRow key={o.v} selected={data.goals.revenue_12_month === o.v} onClick={() => upd.g("revenue_12_month", o.v)} label={o.l} sub={o.s} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>How do you personally define success? <span style={{ fontWeight: 400, color: "#888" }}>(Optional)</span></div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>Not the business version. The personal one.</div>
            <textarea value={data.goals.success_definition} onChange={e => upd.g("success_definition", e.target.value)} placeholder="e.g. Quit my corporate job by March. Control my schedule. Prove to myself I can do it..." style={ts} rows={3} />
          </div>
        </div>}

        {/* STAGE 5 */}
        {stage === 5 && <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>How should I coach you?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {COACHING_STYLES.map(o => (
                <button key={o.value} onClick={() => upd.p("coaching_style", o.value)} style={{ background: data.preferences.coaching_style === o.value ? "rgba(249,115,22,0.08)" : "#111120", border: `2px solid ${data.preferences.coaching_style === o.value ? "#F97316" : "#2A2A3E"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontWeight: 700, color: data.preferences.coaching_style === o.value ? "#F97316" : "#EEE", marginBottom: 2 }}>{o.label}</div>
                  <div style={{ fontSize: 13, color: "#777" }}>{o.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>How often should I check in?</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ v: "daily", l: "Daily" }, { v: "every_few_days", l: "Every few days" }, { v: "weekly", l: "Weekly" }, { v: "on_request", l: "Only when I ask" }].map(o => (
                <button key={o.v} onClick={() => upd.p("nudge_frequency", o.v)} style={{ padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `2px solid ${data.preferences.nudge_frequency === o.v ? "#F97316" : "#2A2A3E"}`, background: data.preferences.nudge_frequency === o.v ? "rgba(249,115,22,0.1)" : "transparent", color: data.preferences.nudge_frequency === o.v ? "#F97316" : "#888" }}>{o.l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>How much detail in explanations?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DEPTH_OPTIONS.map(o => (
                <button key={o.value} onClick={() => upd.p("content_depth", o.value)} style={{ background: data.preferences.content_depth === o.value ? "rgba(249,115,22,0.08)" : "#111120", border: `2px solid ${data.preferences.content_depth === o.value ? "#F97316" : "#2A2A3E"}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: data.preferences.content_depth === o.value ? "#F97316" : "#EEE" }}>{o.label}</span>
                  <span style={{ fontSize: 13, color: "#777" }}>{o.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>What's holding you back? <span style={{ fontWeight: 400, color: "#888" }}>(Optional)</span></div>
            <input type="text" value={data.preferences.current_challenge} onChange={e => upd.p("current_challenge", e.target.value)} placeholder="e.g. I overthink everything. I'm scared no one will pay..." style={is} />
          </div>
        </div>}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 16 }}>
          {stage > 1
            ? <button onClick={back} style={{ background: "transparent", border: "2px solid #2A2A3E", color: "#888", padding: "14px 24px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>← Back</button>
            : <div />}
          <button onClick={advance} disabled={!canAdvance()} style={{ background: canAdvance() ? "linear-gradient(135deg,#F97316,#EF4444)" : "#1E1E2E", color: canAdvance() ? "#fff" : "#555", border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: canAdvance() ? "pointer" : "not-allowed", boxShadow: canAdvance() ? "0 4px 20px rgba(249,115,22,0.3)" : "none" }}>
            {stage === 5 ? "🚀 Generate My Roadmap" : `Continue → ${STAGES[stage].title}`}
          </button>
        </div>
        {!canAdvance() && <p style={{ textAlign: "center", color: "#555", fontSize: 13, marginTop: 10 }}>Complete the fields above to continue</p>}
      </div>
    </div>
  )
}

function Opt({ selected, onClick, emoji, label }: { selected: boolean; onClick: () => void; emoji?: string; label: string }) {
  return (
    <button onClick={onClick} style={{ background: selected ? "rgba(249,115,22,0.08)" : "#111120", border: `2px solid ${selected ? "#F97316" : "#2A2A3E"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {emoji && <span style={{ fontSize: 20 }}>{emoji}</span>}
      <span style={{ fontSize: 12, fontWeight: 600, color: selected ? "#F97316" : "#BBB", lineHeight: 1.3 }}>{label}</span>
    </button>
  )
}

function RadioRow({ selected, onClick, label, sub, emoji }: { selected: boolean; onClick: () => void; label: string; sub?: string; emoji?: string }) {
  return (
    <button onClick={onClick} style={{ background: selected ? "rgba(249,115,22,0.06)" : "#111120", border: `2px solid ${selected ? "#F97316" : "#2A2A3E"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? "#F97316" : "#555"}`, background: selected ? "#F97316" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected && <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%" }} />}
      </div>
      {emoji && <span style={{ fontSize: 18 }}>{emoji}</span>}
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: selected ? "#F97316" : "#DDD" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  )
}
