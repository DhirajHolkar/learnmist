


"use client"

import "../styles/sidebar.css"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Sidebar({ lessons, subject, topic }) {
  const pathname = usePathname()
  const currentSlug = pathname.split("/").pop()

  const [open, setOpen] = useState({})

  // Separate parents and children (1-level only)
  const parents = lessons.filter(l => !l.parentLesson?._id)
  const childrenMap = {}

  lessons.forEach(l => {
    if (l.parentLesson?._id) {
      if (!childrenMap[l.parentLesson._id]) {
        childrenMap[l.parentLesson._id] = []
      }
      childrenMap[l.parentLesson._id].push(l)
    }
  })

  // Auto-open parent if a child is active
  useEffect(() => {
    const newOpen = {}

    parents.forEach(parent => {
      const children = childrenMap[parent._id] || []
      const isChildActive = children.some(
        child => child.slug === currentSlug
      )

      if (isChildActive) {
        newOpen[parent._id] = true
      }
    })

    setOpen(prev => ({ ...prev, ...newOpen }))
  }, [currentSlug])

  const toggle = (id) => {
    setOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const isActive = (slug) => slug === currentSlug

  return (
    <div className="sidebar-component">
      {parents.map(parent => {
        const children = childrenMap[parent._id] || []
        const hasChildren = children.length > 0
        const parentActive = isActive(parent.slug)

        return (
          <div key={parent._id}>
            {hasChildren ? (
              <button
                className={`lesson-group ${parentActive ? "active" : ""}`}
                onClick={() => toggle(parent._id)}
              >
                {parent.title}
                <span>{open[parent._id] ? "▼" : "▶"}</span>
              </button>
            ) : (
              <Link
                href={`/${subject}/${topic}/${parent.slug}`}
                className={`lesson-link ${parentActive ? "active" : ""}`}
              >
                {parent.title}
              </Link>
            )}

            {hasChildren && open[parent._id] && (
              <div className="concept-lessons">
                {children.map(child => (
                  <Link
                    key={child._id}
                    href={`/${subject}/${topic}/${child.slug}`}
                    className={`lesson-link nested ${
                      isActive(child.slug) ? "active" : ""
                    }`}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
