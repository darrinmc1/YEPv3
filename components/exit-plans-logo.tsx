import React from "react"

interface ExitPlansLogoProps {
  className?: string
  size?: number
}

export function ExitPlansLogo({ className = "", size = 24 }: ExitPlansLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blueprint grid background */}
      <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M2 7h20M2 12h20M2 17h20M7 2v20M12 2v20M17 2v20"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />

      {/* Exit sign rectangle */}
      <rect x="5" y="8" width="14" height="8" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />

      {/* EXIT text */}
      <g fill="currentColor">
        {/* E */}
        <path d="M7 10.5h1.5v1h-1v1h1v1h-1v1h1.5v1H7v-5z" />
        {/* X */}
        <path d="M9.5 10.5h1l0.75 1.5 0.75-1.5h1l-1.25 2.5 1.25 2.5h-1l-0.75-1.5-0.75 1.5h-1l1.25-2.5-1.25-2.5z" />
        {/* Arrow pointing right */}
        <path d="M14.5 11v3l2.5-1.5-2.5-1.5z" />
      </g>

      {/* Blueprint corner marks */}
      <path d="M3 3h2v0.5h-1.5v1.5h-0.5v-2z" fill="currentColor" />
      <path d="M21 3h-2v0.5h1.5v1.5h0.5v-2z" fill="currentColor" />
      <path d="M3 21h2v-0.5h-1.5v-1.5h-0.5v2z" fill="currentColor" />
      <path d="M21 21h-2v-0.5h1.5v-1.5h0.5v2z" fill="currentColor" />
    </svg>
  )
}
