import { useState, useEffect } from "react"
import { ContentData } from "../types"
import { defaultContent } from "../lib/constants"

export function useContentStorage() {
  const [content, setContent] = useState<ContentData>(defaultContent)
  const [originalContent, setOriginalContent] = useState<ContentData>(defaultContent)
  const [hasChanges, setHasChanges] = useState(false)

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("content")
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        setContent(parsedContent)
        setOriginalContent(parsedContent)
      } catch (error) {
        console.error("Failed to parse saved content:", error)
      }
    }
  }, [])

  // Track changes
  useEffect(() => {
    const hasContentChanged = JSON.stringify(content) !== JSON.stringify(originalContent)
    setHasChanges(hasContentChanged)
  }, [content, originalContent])

  const saveContent = async (): Promise<boolean> => {
    try {
      localStorage.setItem("content", JSON.stringify(content))
      setOriginalContent(JSON.parse(JSON.stringify(content)))
      setHasChanges(false)
      return true
    } catch (error) {
      console.error("Failed to save content:", error)
      return false
    }
  }

  const resetContent = () => {
    localStorage.removeItem("content")
    setContent(defaultContent)
    setOriginalContent(defaultContent)
    setHasChanges(false)
  }

  return {
    content,
    setContent,
    hasChanges,
    saveContent,
    resetContent,
  }
}
