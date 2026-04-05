


import { sanityClient } from "../lib/sanityClient"
import SubjectCard from "../components/SubjectCard"
import "../styles/landing-page.css"

export default async function Home() {
  const subjects = await sanityClient.fetch(`
    *[_type == "subject"]{
      _id,
      title,
      image,
      "slug": slug.current,
      description
    }
  `)

  return (
    <>



        <section className="hero">

          <div className="hero-inner">

            <div className="hero-content">

              <span className="hero-tag">Explore and learn Amazon Web Services</span>
              <h1 className="hero-heading">Learn. Grow. Achieve.</h1>
              <p className="hero-sub">Choose a topic and start your cloud learning journey today.</p>

            </div>
            
            <div className="hero-illustration">

              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop&crop=center" 
                alt="Study materials"
                className="hero-image"
              />

            </div>

          </div>

        </section>





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