


import { sanityClient } from "../../lib/sanityClient"
import Link from "next/link"
import "../../styles/topic-cards.css"
import { urlFor } from "@/lib/sanityImage";

export default async function SubjectPage({ params }) {
  const { subject } = await params;

  const topics = await sanityClient.fetch(`
    *[_type == "topic" && subject->slug.current == $subject]{
      _id,
      title,
      image,
      "slug": slug.current,

      "firstLesson":*[
      _type == "lesson" && 
      topic->slug.current == ^.slug.current
      ] | order(order asc)[0].slug.current

    }
  `, { subject })

  return (
    <main className="topic-grid">
      {topics.map(topic => (
        <Link
          key={topic._id}
          href={`/${subject}/${topic.slug}/${topic.firstLesson}`}
          className="topic-card"
        >
          <div className="topic-image-wrap">
            <img src={urlFor(topic.image).url()} alt={topic.title} className="topic-img" />
          </div>
          <div className="topic-body">
            <h2 className="topic-title">{topic.title}</h2>
            <span className="topic-arrow">→</span>
          </div>
        </Link>
      ))}
    </main>
  )
}