import { useCharacterCounter } from "@/lib/form-utils"
import { cn } from "@/lib/utils"

interface CharacterCounterProps {
  value: string
  min?: number
  max?: number
  showCount?: boolean
  className?: string
}

export function CharacterCounter({
  value,
  min = 0,
  max = Infinity,
  showCount = true,
  className,
}: CharacterCounterProps) {
  const counter = useCharacterCounter(value, { min, max })

  if (!showCount && counter.isValid) return null

  return (
    <div className={cn("text-xs mt-1 transition-colors duration-200", counter.color, className)}>
      {counter.message}
    </div>
  )
}
