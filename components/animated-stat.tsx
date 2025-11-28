"use client"

import { motion } from "framer-motion"

interface StatProps {
  // The value to display (number or string)
  value?: number | string
  // The text label below the value
  label: string
  // Optional prefix (e.g., '$')
  prefix?: string
  // Optional suffix (e.g., '+', 'hrs')
  suffix?: string
}

export function Stat({ value = 0, label, prefix = "", suffix = "" }: StatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center backdrop-blur-sm">
      <div className="text-3xl font-bold text-blue-400">
        {prefix}
        <span>{value}</span>
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-neutral-400">{label}</div>
    </div>
  )
}