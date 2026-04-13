


import Sidebar from "../../../../components/Sidebar";
import AdSpace from "../../../../components/AdSpace";
import ContentArea from "../../../../components/ContentArea";
import '../../../../styles/concept-page-details.css'
import { sanityClient } from "../../../../lib/sanityClient"

export default async function LessonPage({ params }) {
  const { subject, topic, lesson } = await params

  // && !(_id in path("drafts.**"))
  // Sidebar lessons
  const lessons = await sanityClient.fetch(`
    *[_type == "lesson" && topic->slug.current == $topic
    ]
    | order(order asc){
      _id,
      title,
      "slug": slug.current,
      parentLesson->{
      _id,
      title
      }
    }
  `, { topic })

  // Current lesson content
  const currentLesson = await sanityClient.fetch(`
    *[_type == "lesson" &&
      topic->slug.current == $topic
      && !(_id in path("drafts.**"))
      &&
      slug.current == $lesson][0]{
        title,
        content
      }
  `, { topic, lesson })

  return (

        <div className="layout">
          <aside className="sidebar">
            <Sidebar lessons={lessons} subject={subject} topic={topic} />
          </aside>
    
          <main className="content">
            <ContentArea lesson={currentLesson}/>
          </main>
    
          <aside className="ads">
            <AdSpace />
          </aside>
        </div>
  )
}
