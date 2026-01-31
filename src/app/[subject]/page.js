import { sanityClient } from "../../lib/sanityClient"
import Link from "next/link"
import "../../styles/layout.css"
import "../../styles/cards.css"

export default async function SubjectPage({ params }) {
  const { subject } = await params;

  const topics = await sanityClient.fetch(`
    *[_type == "topic" && subject->slug.current == $subject]{
      _id,
      title,
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
          <h2>{topic.title}</h2>
        </Link>
      ))}
    </main>
  )
}
