// // /components/MainUIClient.jsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { sanityClient } from '../lib/sanityClient';
// import { mainConceptBySlugQuery, conceptBySlugQuery } from '../lib/queries';
// import { PortableText } from '@portabletext/react';

// /**
//  * Props:
//  *  - allMainConcepts: array of main concept objects (title, slug, index.concepts)
//  *  - initialMainSlug: slug string for the currently selected main
//  *  - initialSidebar: array of concepts for the currently selected main
//  *  - initialConcept: the currently selected concept object (full content)
//  */
// export default function MainUIClient({ allMainConcepts = [], initialMainSlug = null, initialSidebar = [], initialConcept = null }) {
//   const [mainConcepts] = useState(allMainConcepts);
//   const [selectedMain, setSelectedMain] = useState(initialMainSlug);
//   const [sidebar, setSidebar] = useState(initialSidebar);
//   const [selectedConceptSlug, setSelectedConceptSlug] = useState(initialConcept ? initialConcept.slug : (initialSidebar[0] && initialSidebar[0].slug));
//   const [content, setContent] = useState(initialConcept);
//   const [loading, setLoading] = useState(false);

//   // When top main changes, fetch its index (unless already present in allMainConcepts)
//   useEffect(() => {
//     if (!selectedMain) return;

//     // If we already have this main's index in allMainConcepts, use it
//     const found = mainConcepts.find(m => m.slug === selectedMain);
//     if (found && found.index && Array.isArray(found.index.concepts) && found.index.concepts.length) {
//       setSidebar(found.index.concepts);
//       // update selected concept slug to first available if current not present
//       setSelectedConceptSlug(prev => (prev && found.index.concepts.some(c => c.slug === prev)) ? prev : (found.index.concepts[0] && found.index.concepts[0].slug));
//       return;
//     }

//     // Otherwise fetch the index from Sanity
//     setLoading(true);
//     sanityClient.fetch(mainConceptBySlugQuery, { slug: selectedMain })
//       .then(res => {
//         const concepts = (res && res.index && res.index.concepts) ? res.index.concepts : [];
//         setSidebar(concepts);
//         setSelectedConceptSlug(concepts[0] && concepts[0].slug);
//       })
//       .catch(err => {
//         console.error(err);
//         setSidebar([]);
//         setSelectedConceptSlug(null);
//       })
//       .finally(() => setLoading(false));
//   }, [selectedMain, mainConcepts]);

//   // When selected concept slug changes, fetch content if needed
//   useEffect(() => {
//     if (!selectedConceptSlug) {
//       setContent(null);
//       return;
//     }

//     // If selected concept equals current content, do nothing
//     if (content && content.slug === selectedConceptSlug) return;

//     setLoading(true);
//     sanityClient.fetch(conceptBySlugQuery, { slug: selectedConceptSlug })
//       .then(res => setContent(res))
//       .catch(err => {
//         console.error(err);
//         setContent(null);
//       })
//       .finally(() => setLoading(false));
//   }, [selectedConceptSlug]);

//   return (
//     <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial', padding: 20 }}>
//       {/* Top horizontal main concepts */}
//       <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 18 }}>
//         {mainConcepts.map(mc => {
//           const isActive = mc.slug === selectedMain;
//           return (
//             <button
//               key={mc._id}
//               onClick={() => {
//                 setSelectedMain(mc.slug);
//                 // clear content while index loads
//                 setContent(null);
//                 setSelectedConceptSlug(null);
//               }}
//               style={{
//                 padding: '8px 14px',
//                 borderRadius: 8,
//                 border: isActive ? '2px solid #111' : '1px solid #e6e6e6',
//                 background: isActive ? '#111' : '#fff',
//                 color: isActive ? '#fff' : '#111',
//                 cursor: 'pointer',
//                 minWidth: 100,
//                 textAlign: 'center'
//               }}
//             >
//               {mc.title}
//             </button>
//           );
//         })}
//       </div>

//       {/* Two-column layout */}
//       <div style={{ display: 'flex', gap: 24 }}>
//         {/* Sidebar */}
//         <aside style={{ width: 340, borderRight: '1px solid #eee', paddingRight: 16 }}>
//           <h3 style={{ marginTop: 0 }}>Contents</h3>

//           {loading && !sidebar.length ? (
//             <div>Loading contents…</div>
//           ) : !sidebar.length ? (
//             <div style={{ color: '#666' }}>No concepts available.</div>
//           ) : (
//             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//               {sidebar.map((c, i) => {
//                 const active = c.slug === selectedConceptSlug;
//                 return (
//                   <li key={c._id} style={{ marginBottom: 14 }}>
//                     <div
//                       onClick={() => setSelectedConceptSlug(c.slug)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyDown={(e) => { if (e.key === 'Enter') setSelectedConceptSlug(c.slug); }}
//                       style={{
//                         padding: '8px 10px',
//                         borderRadius: 8,
//                         background: active ? '#f5f5f5' : 'transparent',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       <div style={{ fontWeight: 600 }}>{i + 1}. {c.title}</div>
//                       {c.excerpt && <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{c.excerpt}</div>}
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </aside>

//         {/* Content area */}
//         <main style={{ flex: 1 }}>
//           {loading && !content ? (
//             <div>Loading lesson…</div>
//           ) : !content ? (
//             <div style={{ color: '#666' }}>Select a lesson from the left to view its content.</div>
//           ) : (
//             <article>
//               <h1 style={{ marginTop: 0 }}>{content.title}</h1>
//               {content.estimatedTime && <div style={{ color: '#777', marginBottom: 10 }}>Est. {content.estimatedTime}</div>}
//               <div style={{ marginTop: 12 }}>
//                 <PortableText value={content.body} />
//               </div>
//             </article>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }






//////////////////////////////////////////////////////////////////////////////////////////////




// components/MainUIClient.jsx
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { sanityClient } from '../lib/sanityClient';
import { mainConceptBySlugQuery, conceptBySlugQuery } from '../lib/queries';
import { PortableText } from '@portabletext/react';

export default function MainUIClient({ allMainConcepts = [], initialMainSlug = null, initialSidebar = [], initialConcept = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [mainConcepts] = useState(allMainConcepts);
  const [selectedMain, setSelectedMain] = useState(initialMainSlug);
  const [sidebar, setSidebar] = useState(initialSidebar);
  const [selectedConceptSlug, setSelectedConceptSlug] = useState(initialConcept ? initialConcept.slug : (initialSidebar[0] && initialSidebar[0].slug));
  const [content, setContent] = useState(initialConcept);
  const [loading, setLoading] = useState(false);

  // If initial props change (edge cases), sync them
  useEffect(() => {
    if (initialMainSlug) setSelectedMain(initialMainSlug);
    if (initialSidebar && initialSidebar.length) setSidebar(initialSidebar);
    if (initialConcept) setContent(initialConcept);
  }, [initialMainSlug, initialSidebar, initialConcept]);

  // When top main changes, fetch its index (unless already present in allMainConcepts)
  useEffect(() => {
    if (!selectedMain) return;
    setLoading(true);

    const found = mainConcepts.find(m => m.slug === selectedMain);
    if (found && found.index && Array.isArray(found.index.concepts) && found.index.concepts.length) {
      const concepts = found.index.concepts;
      setSidebar(concepts);
      setSelectedConceptSlug(prev => (prev && concepts.some(c => c.slug === prev)) ? prev : (concepts[0] && concepts[0].slug));
      setLoading(false);
      return;
    }

    // fallback: fetch index from Sanity
    sanityClient.fetch(mainConceptBySlugQuery, { slug: selectedMain })
      .then(res => {
        const concepts = (res && res.index && res.index.concepts) ? res.index.concepts : [];
        setSidebar(concepts);
        setSelectedConceptSlug(concepts[0] && concepts[0].slug);
      })
      .catch(err => {
        console.error('Error fetching index for main:', err);
        setSidebar([]);
        setSelectedConceptSlug(null);
      })
      .finally(() => setLoading(false));
  }, [selectedMain, mainConcepts]);

  // When selected concept slug changes, fetch content if needed
  useEffect(() => {
    if (!selectedConceptSlug) {
      setContent(null);
      return;
    }

    // If current content is already the requested slug, do nothing
    if (content && content.slug === selectedConceptSlug) return;

    setLoading(true);
    sanityClient.fetch(conceptBySlugQuery, { slug: selectedConceptSlug })
      .then(res => setContent(res))
      .catch(err => {
        console.error('Error fetching concept content:', err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, [selectedConceptSlug]);

  // Helper: navigate in URL to /main/concept
  function navigateTo(mainSlug, conceptSlug) {
    // Use startTransition to keep UI responsive
    startTransition(() => {
      // push will update the url in the browser and load the server route
      router.push(`/${mainSlug}/${conceptSlug}`);
    });
  } 

  // Top bar click: change selected main and navigate to its first concept (if present)
  async function handleTopClick(mcSlug) {
    setSelectedMain(mcSlug);
    // find first concept in preloaded mains if present
    const found = mainConcepts.find(m => m.slug === mcSlug);
    let firstConceptSlug = null;
    if (found && found.index && Array.isArray(found.index.concepts) && found.index.concepts.length) {
      firstConceptSlug = found.index.concepts[0].slug;
      setSidebar(found.index.concepts);       
      setSelectedConceptSlug(firstConceptSlug);
    } else {
      // if no preloaded index, fetch it, then pick its first
      setLoading(true);
      try {
        const res = await sanityClient.fetch(mainConceptBySlugQuery, { slug: mcSlug });
        const concepts = (res && res.index && res.index.concepts) ? res.index.concepts : [];
        setSidebar(concepts);
        firstConceptSlug = concepts[0] && concepts[0].slug;
        setSelectedConceptSlug(firstConceptSlug);
      } catch (err) {
        console.error('Error fetching index after top click:', err);
        setSidebar([]);
        setSelectedConceptSlug(null);
      } finally {
        setLoading(false);
      }
    }

    // If we got a firstConceptSlug, navigate to it so URL updates
    if (firstConceptSlug) navigateTo(mcSlug, firstConceptSlug);
    else {
      // If no concept for this main, just update URL to /main/ (optional)
      startTransition(() => router.push(`/${mcSlug}`));
    }
  }

  // Sidebar click: set selected concept, fetch content (already handled in effect), and push url
  function handleSidebarClick(conceptSlug) {
    setSelectedConceptSlug(conceptSlug);
    if (selectedMain) {
      navigateTo(selectedMain, conceptSlug);
    } else {
      // fallback: try to find main for this concept in preloaded mains
      const foundMain = mainConcepts.find(m => (m.index && m.index.concepts || []).some(c => c.slug === conceptSlug));
      const mainSlugForConcept = foundMain ? foundMain.slug : (selectedMain || '');
      if (mainSlugForConcept) navigateTo(mainSlugForConcept, conceptSlug);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial', padding: '0px 0px' }}>
      {/* Top horizontal main concepts */}
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', marginBottom: 18, borderBottom:'1px solid #e1e1e1ff'}}>
        {mainConcepts.map(mc => {
          const isActive = mc.slug === selectedMain;
          return (
            <button
              key={mc._id}
              onClick={() => handleTopClick(mc.slug)}
              style={{
                padding: '8px 14px',
                // borderRadius: 8,
                border: isActive ? '2px solid #6f37f3ff' : '1px solid #e6e6e6',
                background: isActive ? '#6f37f3ff' : '#fff',
                color: isActive ? '#fff' : '#111',
                cursor: 'pointer',
                minWidth: 100,
                textAlign: 'center'
              }}
            >
              {mc.title}
            </button>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 24 }}>

        {/* Sidebar */}
        <aside style={{
           width: 250, 
           borderRight: '1px solid #eee', 
           paddingRight: 16 
        }}>

          {/* <h3 style={{ marginTop: 0 }}>Contents</h3> */}

          {loading && sidebar.length === 0 ? (
            <div>Loading contents…</div>
          ) : sidebar.length === 0 ? (
            <div style={{ color: '#666' }}>No concepts available for this main topic.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sidebar.map((c, i) => {
                const active = c.slug === selectedConceptSlug;
                return (
                  <li key={c._id} style={{ marginBottom: 0 }}>
                    <div
                      onClick={() => handleSidebarClick(c.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSidebarClick(c.slug); }}
                      style={{
                        padding: '8px 10px',
                        // borderRadius: 8,
                        background: active ? '#f5f5f5' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize:15 }}>
                        {/* {i + 1}.  */}
                        {c.title}</div>

                      {/* {c.excerpt && <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{c.excerpt}</div>} */}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Content area */}
        <main style={{ flex: 1 }}>
          {(isPending || (loading && content === null)) ? (
            <div>Loading lesson…</div>
          ) : content === null ? (
            <div style={{ color: '#666' }}>Select a lesson from the left to view its content.</div>
          ) : (
            <article>
              <div style={{ marginTop: 0, fontSize:20}}>{content.title}</div>
              {/* {content.estimatedTime && <div style={{ color: '#777', marginBottom: 10 }}>Est. {content.estimatedTime}</div>} */}
              <div style={{ marginTop: 12, fontSize:16 }}>
                <PortableText value={content.body} />
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
