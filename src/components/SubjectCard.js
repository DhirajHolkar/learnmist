import Link from "next/link"
import "../styles/cards.css"
import { urlFor } from "@/lib/sanityImage"

export default function SubjectCard({ title, slug, image, description }) {
  return (
    <Link href={`/${slug}`} className="card">

      <div>
      <img src={urlFor(image).url()} alt={title}></img>
      <h2>{title}</h2>
      </div>

    </Link>
  )
}
