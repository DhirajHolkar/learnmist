




import { sanityClient } from "../lib/sanityClient"
import SubjectCard from "../components/SubjectCard"
import "../styles/layout.css"

export default async function Home() {
  const subjects = await sanityClient.fetch(`
    *[_type == "subject"]{
      _id,
      title,
      "slug": slug.current,
      description
    }
  `)

  return (
    <main className="grid">
      {subjects.map(subject => (
        <SubjectCard
          key={subject._id}
          title={subject.title}
          slug={subject.slug}
          description={subject.description}
        />
      ))}
    </main>
  )
}
