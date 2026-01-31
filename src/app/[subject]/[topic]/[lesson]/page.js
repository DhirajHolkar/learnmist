import { sanityClient } from "../../../../lib/sanityClient"
import Sidebar from "../../../../components/Sidebar";
import AdSpace from "../../../../components/AdSpace";
import ContentArea from "../../../../components/ContentArea";
import '../../../../styles/layout.css'

export default async function LessonPage({ params }) {
  const { subject, topic, lesson } = params

  // Sidebar lessons
  const lessons = await sanityClient.fetch(`
    *[_type == "lesson" && topic->slug.current == $topic]
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
      topic->slug.current == $topic &&
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
