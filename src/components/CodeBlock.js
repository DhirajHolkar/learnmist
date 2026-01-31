"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"

import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"

export default function CodeBlock({ value }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current)
    }
  }, [])

  return (
    <pre className="code-block">
      <code
        ref={ref}
        className={`language-${value.language || "javascript"}`}
        suppressHydrationWarning
      >
        {value.code}
      </code>
    </pre>
  )
}
