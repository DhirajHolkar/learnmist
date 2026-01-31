import Link from "next/link"
import "../styles/cards.css"

export default function SubjectCard({ title, slug, description }) {
  return (
    <Link href={`/${slug}`} className="card">
      <h2>{title}</h2>
    </Link>
  )
}
