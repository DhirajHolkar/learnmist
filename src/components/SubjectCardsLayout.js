
import SubjectCard from "../components/SubjectCard"
import "../styles/subject-card.css"
import "../styles/subject-cards-layout.css"
export default async function Home({subjects}) {
  

  return (
    <>


      <main className="grid">
        {subjects.map(subject => (
          <SubjectCard
            key={subject._id}
            title={subject.title}
            slug={subject.slug}
            image={subject.image}
            description={subject.description}
          />
        ))}
      </main>


    </>
  )
}