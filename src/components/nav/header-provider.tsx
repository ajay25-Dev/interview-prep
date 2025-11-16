"use client"

import { useEffect, useState } from "react"
import { InterviewHeader } from "./interview-header"

export function HeaderProvider() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <InterviewHeader />
}
