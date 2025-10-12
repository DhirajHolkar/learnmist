// // /// /app/page.js
// // import React from 'react';
// // import MainUI from '../components/MainUI';
// // import { sanityClient } from '../lib/sanityClient';
// // import { allMainConceptsQuery } from '../lib/queries';

// // export default async function Page() {
// //   // server-side fetch of available main concepts (fast, SEO-friendly)
// //   const mainConcepts = await sanityClient.fetch(allMainConceptsQuery);

// //   // default to python if available; otherwise first item
// //   const defaultMain = mainConcepts.find(m => m.slug === 'python') || mainConcepts[0] || null;

// //   return (
// //     <html>
// //       <body>
// //         <MainUI initialMainConcepts={mainConcepts} defaultMainSlug={defaultMain ? defaultMain.slug : null} />
// //       </body>
// //     </html>
// //   );
// // }





// // app/page.js
// import React from 'react';
// import MainUI from '../components/MainUI';
// import { sanityClient } from '../lib/sanityClient';
// import { allMainConceptsQuery } from '../lib/queries';

// export default async function Page() {
//   const mainConcepts = await sanityClient.fetch(allMainConceptsQuery);

//   const defaultMain = mainConcepts.find(m => m.slug === 'python') || mainConcepts[0] || null;

//   // NOTE: do NOT return <html> or <body> here — that causes hydration mismatch.
//   return (
//     <MainUI initialMainConcepts={mainConcepts} defaultMainSlug={defaultMain ? defaultMain.slug : null} />
//   );
// }


////////////////////////////////////////////////////////////////////////////////////







// app/page.js
import { redirect } from 'next/navigation';
import { sanityClient } from '../lib/sanityClient';
import { allMainConceptsQuery } from '../lib/queries';

export default async function Page() {
  const mainConcepts = await sanityClient.fetch(allMainConceptsQuery);
  const defaultMain = mainConcepts.find(m => m.slug === 'python') || mainConcepts[0];
  const firstConcept = defaultMain && defaultMain.index && defaultMain.index.concepts && defaultMain.index.concepts[0];

  if (defaultMain && firstConcept) {
    return redirect(`/${defaultMain.slug}/${firstConcept.slug}`);
  }

  // fallback: render a simple index if not redirecting
  return <div style={{ padding: 24 }}>No content yet — create mainconcepts in Sanity.</div>;
}
