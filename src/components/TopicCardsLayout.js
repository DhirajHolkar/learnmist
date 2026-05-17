

import Link from "next/link";
import { sanityClient } from "../lib/sanityClient";
import { urlFor } from "@/lib/sanityImage";
import "../styles/topic-cards.css";

export default async function TopicCardsLayout({ topicCategory, subject }) {


  const groups = await sanityClient.fetch(`
  *[
    _type == "topicSubCategory" &&
    topicCategoryLink->slug.current == $topicCategory
  ]
  | order(order asc) {

    _id,
    title,

    "topics": *[
      _type == "topic" &&
      subCategory._ref == ^._id
    ]
    | order(order asc) {

      _id,
      title,
      image,
      "slug": slug.current,

      "firstLesson": *[
        _type == "lesson" &&
        topic._ref == ^._id
      ]
      | order(order asc)[0].slug.current
    }
  }
`, { topicCategory, subject });



  return (
  <>
  
    {groups.map((group) => (

      <section key={group._id}>

        <div className="group-title">
          {group.title}
        </div>





        <main className="topic-grid">
        {group.topics.map((topic) => (
        <Link
          key={topic._id}
          href={`/${subject}/${topic.slug}/${topic.firstLesson}`}
          className="topic-card"
        >
          <div className="topic-image-wrap">
            <img
              src={urlFor(topic.image).url()}
              alt={topic.title}
              className="topic-img"
            />
          </div>
          <div className="topic-body">
            <h2 className="topic-title">{topic.title}</h2>
            <span className="topic-arrow">→</span>
          </div>
        </Link>
      ))}
    </main>


      </section>



    ))}




  </>
);


}













