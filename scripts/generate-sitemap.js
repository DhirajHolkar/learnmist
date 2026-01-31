import fs from "fs"
import path from "path"
import {sanityClient} from '../src/lib/sanityClient.js';

// Your website URL
const BASE_URL = "https://learnmist.com"

// GROQ Query
const query = `
*[_type == "lesson"]{
  "lessonSlug": slug.current,
  "topic": topic->{
    "topicSlug": slug.current,
    "subject": subject->{
      "subjectSlug": slug.current
    }
  }
}
`

async function generateSitemap() {
  try {
    const lessons = await sanityClient.fetch(query)

    const urls = lessons
      .filter(
        item =>
          item.lessonSlug &&
          item.topic?.topicSlug &&
          item.topic?.subject?.subjectSlug
      )
      .map(item => {
        return `
  <url>
    <loc>${BASE_URL}/${item.topic.subject.subjectSlug}/${item.topic.topicSlug}/${item.lessonSlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .join("")

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
    </urlset>
    `

    const outputPath = path.join(process.cwd(), "public", "sitemap.xml")

    fs.writeFileSync(outputPath, sitemap)

    console.log("Sitemap generated at:", outputPath)
  } catch (err) {
    console.error("Failed to generate sitemap:", err)
  }
}

generateSitemap()
