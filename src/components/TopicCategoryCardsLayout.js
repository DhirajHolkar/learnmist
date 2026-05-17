import Link from "next/link";
import { sanityClient } from "../lib/sanityClient";
import "../styles/topic-cards.css";
import { urlFor } from "@/lib/sanityImage";

export default async function TopicCategoryCardsLayout({ subject }) {

  const categories = await sanityClient.fetch(`
    *[_type == "topicCategory" &&
      subject->slug.current == $subject]
    | order(order asc) {
      _id,
      title,
      image,
      "slug": slug.current
    }
  `, { subject });

  return (
    <main className="topic-grid">

      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/${subject}/categories/${category.slug}`}
          className="topic-card"
        >

          <div className="topic-image-wrap">
            <img src={urlFor(category.image).url()}
             alt={category.title}
             className="topic-img" />
          </div>

          <div className="topic-body">
            <h2 className="topic-title">
              {category.title}
            </h2>

            <span className="topic-arrow">
              →
            </span>
          </div>

        </Link>

      ))}

    </main>
  );
}