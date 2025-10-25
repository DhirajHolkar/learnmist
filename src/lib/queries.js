
// /lib/queries.js

// Return all main concepts + their index (sidebar) — unchanged
export const allMainConceptsQuery = `*[_type == "mainConcept"] | order(title asc){
  _id, title, "slug": slug.current,
  index->{
    title, "slug": slug.current,
    "concepts": concepts[]->{
      _id, title, "slug": slug.current, excerpt
    }
  }
}`;

// Fetch one main concept by slug + its index — unchanged
export const mainConceptBySlugQuery = `*[_type == "mainConcept" && slug.current == $slug][0]{
  _id, title, "slug": slug.current,
  index->{
    title, "slug": slug.current,
    "concepts": concepts[]->{
      _id, title, "slug": slug.current, excerpt
    }
  }
}`;

// New: fetch a concept by slug across a set of types you pass in.
// Usage: fetch(conceptBySlugAcrossTypes, { types: ['pythonConcepts'], slug: 'python-intro' })
export const conceptBySlugAcrossTypes = `*[_type in $types && slug.current == $slug][0]{
  _id,
  title,
  body,
  excerpt,
  estimatedTime,
  publishedAt,
  "slug": slug.current,
  _type
}`;

// For generateStaticParams (all path combos) — unchanged; it dereferences the index's concepts
export const allPathsQuery = `*[_type == "mainConcept"]{
  "main": slug.current,
  "concepts": index->concepts[]->slug.current
}`;
