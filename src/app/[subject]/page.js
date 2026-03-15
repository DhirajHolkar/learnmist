import { sanityClient } from "../../lib/sanityClient"
import Link from "next/link"
import "../../styles/layout.css"
import "../../styles/cards.css"
import { urlFor } from "@/lib/sanityImage";

export default async function SubjectPage({ params }) {
  const { subject } = await params;

  const topics = await sanityClient.fetch(`
    *[_type == "topic" && subject->slug.current == $subject]{
      _id,
      title,
      image,
      "slug": slug.current
    }
  `, { subject })

  return (
    <main className="grid">
      {topics.map(topic => (
        <Link
          key={topic._id}
          href={`/${subject}/${topic.slug}`}
          className="card"
        >
          <div>
          <img src={urlFor(topic.image).url()} alt={topic.title} />
          <h2>{topic.title}</h2>
          </div>
        </Link>
      ))}
    </main>
  )
}
