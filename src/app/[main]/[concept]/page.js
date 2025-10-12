// /app/[main]/[concept]/page.js
import React from 'react';
import MainUIClient from '../../../components/MainUIClient';
import { sanityClient } from '../../../lib/sanityClient';
import { allMainConceptsQuery, mainConceptBySlugQuery, conceptBySlugQuery, allPathsQuery } from '../../../lib/queries';

export async function generateStaticParams() {
  const paths = await sanityClient.fetch(allPathsQuery);
  // paths is an array [{ main: 'python', concepts: ['python-intro', 'variables'] }, ...]
  const params = [];
  for (const p of paths) {
    if (p.concepts && p.concepts.length) {
      for (const cs of p.concepts) {
        params.push({ main: p.main, concept: cs });
      }
    } else {
      // if no concepts, still make a parent path (optional)
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

  // Fetch selected concept content
  const conceptData = conceptSlug ? await sanityClient.fetch(conceptBySlugQuery, { slug: conceptSlug }) : null;

  // Fallbacks: if user requested a main/concept pair that doesn't exist, you can handle 404
  if (!mainData) {
    // Return notFound or render a simple message; in App Router you can throw notFound()
    // import { notFound } from 'next/navigation' and call notFound()
    // For simplicity here we'll render the page with empty data
  }

  return (
    // We pass initial data into the client component for interactivity
    <MainUIClient
      allMainConcepts={allMainConcepts}
      initialMainSlug={mainSlug}
      initialSidebar={(mainData && mainData.index && mainData.index.concepts) ? mainData.index.concepts : []}
      initialConcept={conceptData}
    />
  );
}
