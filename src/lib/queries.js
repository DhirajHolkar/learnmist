// // /lib/queries.js

// export const allMainConceptsQuery = `*[_type == "mainConcept"] | order(title asc){
//   _id, title, "slug": slug.current,
//   "index": index->{
//     title, "slug": slug.current,
//     "concepts": concepts[]->{
//       _id, title, "slug": slug.current, excerpt
//     }
//   }
// }`;

// export const mainConceptBySlugQuery = `*[_type == "mainConcept" && slug.current == $slug][0]{
//   _id, title, "slug": slug.current,
//   index->{
//     title, "slug": slug.current,
//     "concepts": concepts[]->{
//       _id, title, "slug": slug.current, excerpt
//     }
//   }
// }`;

// export const conceptBySlugQuery = `*[_type == "concept" && slug.current == $slug][0]{
//   _id, title, body, excerpt, estimatedTime, "slug": slug.current
// }`;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







// /lib/queries.js

export const allMainConceptsQuery = `*[_type == "mainConcept"] | order(title asc){
  _id, title, "slug": slug.current,
  index->{
    title, "slug": slug.current,
    "concepts": concepts[]->{
      _id, title, "slug": slug.current, excerpt
    }
  }
}`;

export const mainConceptBySlugQuery = `*[_type == "mainConcept" && slug.current == $slug][0]{
  _id, title, "slug": slug.current,
  index->{
    title, "slug": slug.current,
    "concepts": concepts[]->{
      _id, title, "slug": slug.current, excerpt
    }
  }
}`;

export const conceptBySlugQuery = `*[_type == "concept" && slug.current == $slug][0]{
  _id, title, body, excerpt, estimatedTime, "slug": slug.current
}`;

// For generateStaticParams (all path combos)
export const allPathsQuery = `*[_type == "mainConcept"]{
  "main": slug.current,
  "concepts": index->concepts[]->slug.current
}`;









