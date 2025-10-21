




// /app/[main]/[concept]/page.js
import React from 'react';
import MainUIClient from '../../../components/MainUIClient';
import { sanityClient } from '../../../lib/sanityClient';
import { allMainConceptsQuery, mainConceptBySlugQuery, allPathsQuery } from '../../../lib/queries';

export async function generateStaticParams() {
  const paths = await sanityClient.fetch(allPathsQuery);
  const params = [];
  for (const p of paths) {
    if (p.concepts && p.concepts.length) {
      for (const cs of p.concepts) {
        params.push({ main: p.main, concept: cs });
      }
    } else {
      params.push({ main: p.main, concept: '' });
    }
  }
  return params;
}

export default async function Page({ params }) {
  const mainSlug = params.main;
  const conceptSlug = params.concept;

  // Fetch all mains for top bar
  const allMainConcepts = await sanityClient.fetch(allMainConceptsQuery);

  // Fetch selected main's index (sidebar)
  const mainData = await sanityClient.fetch(mainConceptBySlugQuery, { slug: mainSlug });

  // Fetch selected concept content from the per-main type (e.g. 'pythonConcepts')
  let conceptData = null;
  if (conceptSlug) {
    try {
      const perType = `${mainSlug}Concepts`;
      const q = `*[_type in $types && slug.current == $slug][0]{
        _id, title, body, excerpt, estimatedTime, publishedAt, "slug": slug.current, _type
      }`;
      conceptData = await sanityClient.fetch(q, { types: [perType], slug: conceptSlug });
    } catch (err) {
      console.error('Error fetching concept data for', mainSlug, conceptSlug, err);
      conceptData = null;
    }
  }

  // If mainData missing you can return notFound() from next/navigation if desired
  // import { notFound } from 'next/navigation' and call notFound()

  return (
    <MainUIClient
      allMainConcepts={allMainConcepts}
      initialMainSlug={mainSlug}
      initialSidebar={(mainData && mainData.index && mainData.index.concepts) ? mainData.index.concepts : []}
      initialConcept={conceptData}
    />
  );
}
