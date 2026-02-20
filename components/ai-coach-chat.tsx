"use client"

// components/ai-coach-chat.tsx
// Persistent AI business coach chat panel
// Appears as a sliding panel on the dashboard, linked to the active roadmap

import { useEffect, useRef, useState } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: string
}

interface AiCoachChatProps {
  roadmapId?: string
  roadmapTitle?: string
  coachingStyle?: string
  onClose?: () => void
}

export default function AiCoachChat({
  roadmapId,
  roadmapTitle,
  coachingStyle = "direct",
  onClose,
}: AiCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const url = roadmapId
          ? `/api/coach-chat?roadmapId=${roadmapId}&limit=50`
          : `/api/coach-chat?limit=30`
        const res = await fetch(url)
        const data = await res.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        } else {
          // First time — show welcome message
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: getWelcomeMessage(coachingStyle, roadmapTitle),
            },
          ])
        }
      } catch {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: getWelcomeMessage(coachingStyle, roadmapTitle),
          },
        ])
      } finally {
        setHistoryLoaded(true)
      }
    }
    loadHistory()
  }, [roadmapId, coachingStyle, roadmapTitle])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, roadmapId }),
      })

      const data = await res.json()

      if (data.message) {
        setMessages((prev) => [...prev, data.message])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: data.error || "Something went wrong. Try again.",
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Network error. Check your connection and try again.",
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function clearHistory() {
    if (!confirm("Clear all chat history?")) return
    try {
      const url = roadmapId
        ? `/api/coach-chat?roadmapId=${roadmapId}`
        : `/api/coach-chat`
      await fetch(url, { method: "DELETE" })
      setMessages([
        {
          id: "welcome-new",
          role: "assistant",
          content: getWelcomeMessage(coachingStyle, roadmapTitle),
        },
      ])
    } catch {
      /* ignore */
    }
  }

  const quickPrompts = [
    "What should I focus on today?",
    "I'm feeling stuck — help me move forward",
    "What's my biggest risk right now?",
    "How do I get my first customer?",
    "Review my progress and give me honest feedback",
  ]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#08080F",
        color: "#F5F5F0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #1A1A2E",
          background: "#0A0A14",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 15,
              color: "#F97316",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>🤖</span>
            AI Business Coach
          </div>
          {roadmapTitle && (
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
              Context: {roadmapTitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={clearHistory}
            title="Clear history"
            style={{
              background: "none",
              border: "1px solid #2A2A3E",
              borderRadius: 8,
              color: "#555",
              fontSize: 11,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                fontSize: 20,
                cursor: "pointer",
                lineHeight: 1,
                padding: "2px 6px",
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {!historyLoaded && (
          <div style={{ color: "#555", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
            Loading conversation...
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#F97316,#EF4444)"
                    : "linear-gradient(135deg,#6366F1,#8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {msg.role === "user" ? "👤" : "🤖"}
            </div>

            {/* Bubble */}
            <div
              style={{
                maxWidth: "78%",
                background: msg.role === "user" ? "rgba(249,115,22,0.12)" : "#0F0F1E",
                border: `1px solid ${
                  msg.role === "user"
                    ? "rgba(249,115,22,0.25)"
                    : "#1E1E30"
                }`,
                borderRadius:
                  msg.role === "user"
                    ? "16px 4px 16px 16px"
                    : "4px 16px 16px 16px",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: msg.role === "user" ? "#F5F5F0" : "#E0E0D0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </div>
              {msg.createdAt && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#444",
                    marginTop: 6,
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("en-AU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              🤖
            </div>
            <div
              style={{
                background: "#0F0F1E",
                border: "1px solid #1E1E30",
                borderRadius: "4px 16px 16px 16px",
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#6366F1",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — only show if few messages */}
      {messages.length <= 2 && historyLoaded && (
        <div
          style={{
            padding: "0 16px 12px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => {
                setInput(p)
                inputRef.current?.focus()
              }}
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 99,
                color: "#8B8BF0",
                fontSize: 11,
                padding: "5px 12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "12px 16px 16px",
          borderTop: "1px solid #1A1A2E",
          background: "#0A0A14",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: "#0F0F1E",
            border: "1px solid #2A2A3E",
            borderRadius: 14,
            padding: "10px 12px",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything... (Enter to send)"
            rows={1}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#F5F5F0",
              fontSize: 14,
              resize: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: "auto",
            }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = "auto"
              t.style.height = Math.min(t.scrollHeight, 120) + "px"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              background:
                input.trim() && !loading
                  ? "linear-gradient(135deg,#F97316,#EF4444)"
                  : "#1A1A28",
              border: "none",
              borderRadius: 10,
              width: 36,
              height: 36,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#333",
            textAlign: "center",
            marginTop: 6,
          }}
        >
          Powered by Gemini AI · Shift+Enter for new line
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function getWelcomeMessage(style: string, title?: string): string {
  const businessHint = title ? ` for "${title}"` : ""

  const messages: Record<string, string> = {
    direct: `Hey — I'm your AI business coach${businessHint}.\n\nI've got full context on your plan and where you're at. Ask me anything: stuck on a task, need a reality check, want to pressure-test an idea, or just need to know what to do next.\n\nWhat's on your mind?`,
    explain_why: `Welcome! I'm your AI business coach${businessHint}.\n\nI'm here to help you understand not just WHAT to do, but WHY each step matters. That way you can adapt when things don't go to plan (and they will).\n\nWhat would you like to work through today?`,
    hand_holding: `Hi! 👋 I'm your personal business coach${businessHint}.\n\nI know starting a business can feel overwhelming — that's completely normal. I'm here to walk you through things step by step, at your pace.\n\nWhat's on your mind? There are no silly questions here.`,
    challenging: `Right. Let's get into it.\n\nI'm your coach${businessHint} and I'm not here to make you feel good — I'm here to help you actually build something. If you're procrastinating, I'll call it out. If you're on track, I'll push you harder.\n\nWhat did you get done today? And what's your excuse for what you didn't?`,
  }

  return messages[style] ?? messages.direct
}
