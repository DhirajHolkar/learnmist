

"use client"
import { PortableText } from "@portabletext/react"
import dynamic from "next/dynamic"
import "../styles/content-area.css"

const CodeBlock = dynamic(()=>import("./CodeBlock"),{
  ssr:false
})

const components = {
  types: {
    code:CodeBlock,
    image: ({ value }) => {
      const imageUrl = value.asset?.url
      return (
        <img
          src={imageUrl}
          alt="Lesson visual"
          className="lesson-image"
        />
      )
    },


    // ✅ ADD THIS
    table: ({ value }) => {
      return (
        <table>
          <tbody>
            {value.rows.map((row, i) => (
              <tr key={i}>
                {row.cells.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

  }
}

export default function ContentArea({ lesson }) {
  if (!lesson) return null

  return (
    <main className="content-area">
      <div className="lesson-title">{lesson.title}</div>
      <PortableText
        value={lesson.content}
        components={components}
      />
    </main>
  )
}





