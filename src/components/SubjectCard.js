


import Link from "next/link"
import "@/styles/subject-card.css"
import { urlFor } from "@/lib/sanityImage"

export default function SubjectCard({ title, slug, image, description }) {
  return (
    <Link href={`/${slug}`} className="card">
      <div className="card-image-wrap">
        <img src={urlFor(image).url()} alt={title} className="card-img" />
      </div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <span className="card-arrow">→</span>
      </div>
    </Link>
  )
}