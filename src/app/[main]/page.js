// import { sanityClient } from '../../lib/sanityClient';
// import { mainConceptBySlugQuery } from '../../lib/queries';
// import { redirect } from 'next/navigation';

// export default async function Page({ params }) {
//   const mainSlug = params.main;

//   // Fetch the main data (its index and concepts)
//   const mainData = await sanityClient.fetch(mainConceptBySlugQuery, { slug: mainSlug });

//   const concepts =
//     mainData?.index?.concepts && Array.isArray(mainData.index.concepts)
//       ? mainData.index.concepts
//       : [];

//   if (concepts.length > 0 && concepts[0]?.slug) {
//     // Redirect to the first concept of that main
//     redirect(`/${mainSlug}/${concepts[0].slug}`);
//   } else {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl text-gray-600">
//         No concepts found for {mainSlug}.
//       </div>
//     );
//   }
// }









// app/[main]/page.js
import React from 'react';
import { sanityClient } from '../../lib/sanityClient';
import { mainConceptBySlugQuery } from '../../lib/queries';
import { redirect, notFound } from 'next/navigation';

export default async function Page({ params }) {
  // Next.js requires awaiting params in certain server-route contexts.
  // Awaiting is a no-op if params is a plain object, but avoids the runtime error.
  const awaitedParams = await params;
  const mainSlug = awaitedParams?.main;

  if (!mainSlug) {
    return notFound();
  }

  // Fetch the main concept (and its index) from Sanity
  let mainData = null;
  try {
    mainData = await sanityClient.fetch(mainConceptBySlugQuery, { slug: mainSlug });
  } catch (err) {
    console.error('Sanity fetch error in /[main]/page:', err);
    // If Sanity is temporarily unreachable, treat as 404 for now (or you can render an error UI)
    return notFound();
  }

  if (!mainData) {
    return notFound();
  }

  const concepts = Array.isArray(mainData.index?.concepts) ? mainData.index.concepts : [];

  if (concepts.length > 0 && concepts[0]?.slug) {
    // Server-side redirect to the first concept's page
    redirect(`/${mainSlug}/${concepts[0].slug}`);
  }

  // If there are no concepts, show a friendly message server-side.
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 12 }}>No lessons available — {mainSlug}</h1>
      <p style={{ marginBottom: 12 }}>
        There are currently no lessons for this topic. Please check back later or visit the <Link href="/">home page</Link>.
      </p>
    </div>
  );
}
