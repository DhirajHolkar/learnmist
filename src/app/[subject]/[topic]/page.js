
    
    
import Sidebar from "../../../components/Sidebar"
import AdSpace from "../../../components/AdSpace"
import ContentArea from "../../../components/ContentArea"
import "../../../styles/layout.css"
import { sanityClient } from "../../../lib/sanityClient"



export default async function TopicPage({ params }) {
  const { subject, topic } = await params

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

  // Fetch first lesson as default content
  const lesson = await sanityClient.fetch(`
    *[_type == "lesson" && topic->slug.current == $topic]
    | order(order asc)[0]{
      title,
      content
    }
  `, { topic })

  return (
    

    <div className="layout">
      <div className="sidebar">
        <Sidebar lessons={lessons} subject={subject} topic={topic} />
      </div>

      <div className="content">
        <ContentArea lesson={lesson}/>
      </div>

      <div className="ads">
        <AdSpace />
      </div>
    </div>



  )
}
















