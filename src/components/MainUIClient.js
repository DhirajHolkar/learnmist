





// components/MainUIClient.jsx
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { sanityClient } from '../lib/sanityClient';
import { mainConceptBySlugQuery } from '../lib/queries';
import { PortableText } from '@portabletext/react';
import portableTextComponent from './portableTextComponent';


// NOTE: We no longer import a single conceptBySlugQuery.
// Instead we build a small GROQ query at runtime that looks for the slug
// across multiple _type values (['concept', '<main>Concepts']).

export default function MainUIClient({
  allMainConcepts = [],
  initialMainSlug = null,
  initialSidebar = [],
  initialConcept = null
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [mainConcepts] = useState(allMainConcepts);
  const [selectedMain, setSelectedMain] = useState(initialMainSlug);
  const [sidebar, setSidebar] = useState(initialSidebar);
  const [selectedConceptSlug, setSelectedConceptSlug] = useState(
    initialConcept ? initialConcept.slug : (initialSidebar[0] && initialSidebar[0].slug)
  );
  const [content, setContent] = useState(initialConcept);
  const [loading, setLoading] = useState(false);

  // Sync initial props if they change
  useEffect(() => {
    if (initialMainSlug) setSelectedMain(initialMainSlug);
    if (initialSidebar && initialSidebar.length) setSidebar(initialSidebar);
    if (initialConcept) setContent(initialConcept);
  }, [initialMainSlug, initialSidebar, initialConcept]);

  // Helper: return array of types to search when fetching a concept by slug
  function typesToSearchFor(mainSlug) {
    // generic 'concept' type plus per-main type like 'pythonConcepts'
    const types = [];
    if (mainSlug) {
      // e.g. mainSlug = "python" -> "pythonConcepts"
      types.push(`${mainSlug}Concepts`);
    }
    // Remove duplicates and return
    return Array.from(new Set(types));
  }

  // Helper: fetch a concept document by slug across multiple types
    async function fetchConceptBySlugAcrossTypes(slug, mainSlug) {
    if (!slug) return null;
    const types = typesToSearchFor(mainSlug);
    if (!types || types.length === 0) return null; // <- guard

    const q = `*[_type in $types && slug.current == $slug][0]{
      _id, title, body, excerpt, estimatedTime, publishedAt, "slug": slug.current, _type
    }`;
    try {
      const doc = await sanityClient.fetch(q, { types, slug });
      return doc || null;
    } catch (err) {
      console.error('Error fetching concept across types:', err);
      return null;
    }
  }


  // When top main changes, fetch its index (unless it's already in allMainConcepts)
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

    // fallback: fetch index from Sanity; if index empty, try to get first per-main doc
    (async () => {
      try {
        const res = await sanityClient.fetch(mainConceptBySlugQuery, { slug: selectedMain });
        let concepts = (res && res.index && res.index.concepts) ? res.index.concepts : [];
        if (!concepts.length) {
          // Try to locate documents in the per-main type (e.g. 'pythonConcepts')
          const perType = `${selectedMain}Concepts`;
          const firstOfType = await sanityClient.fetch(
            `*[_type == $type] | order(publishedAt asc)[0]{_id, title, "slug": slug.current, excerpt}`,
            { type: perType }
          );
          if (firstOfType) {
            // if we only have one doc, create a sidebar array with that single doc
            concepts = [firstOfType];
          }
        }
        setSidebar(concepts);
        setSelectedConceptSlug(concepts[0] && concepts[0].slug);
      } catch (err) {
        console.error('Error fetching index for main:', err);
        setSidebar([]);
        setSelectedConceptSlug(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedMain, mainConcepts]);

  // When selectedConceptSlug changes, fetch content (search across types)
  useEffect(() => {
    if (!selectedConceptSlug) {
      setContent(null);
      return;
    }

    // if content already matches slug, do nothing
    if (content && content.slug === selectedConceptSlug) return;

    setLoading(true);
    (async () => {
      try {
        // Prefer searching within selectedMain's per-type and generic 'concept'
        const doc = await fetchConceptBySlugAcrossTypes(selectedConceptSlug, selectedMain);
        if (doc) {
          setContent(doc);
          setLoading(false);
          return;
        }

        // If not found with main, as a fallback search globally across generic concept types
        const fallbackTypes = [`${selectedMain}Concepts`];
        const fallbackQ = `*[_type in $types && slug.current == $slug][0]{_id, title, body, excerpt, estimatedTime, publishedAt, "slug": slug.current, _type}`;
        const fallbackDoc = await sanityClient.fetch(fallbackQ, { types: fallbackTypes, slug: selectedConceptSlug });
        setContent(fallbackDoc || null);
      } catch (err) {
        console.error('Error fetching concept content:', err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedConceptSlug]);

  // Helper: navigate in URL to /main/concept
  function navigateTo(mainSlug, conceptSlug) {
    startTransition(() => {
      router.push(`/${mainSlug}/${conceptSlug}`);
    });
  }

  // Top bar click: set selected main and navigate to its first concept
  async function handleTopClick(mcSlug) {
    setSelectedMain(mcSlug);

    const found = mainConcepts.find(m => m.slug === mcSlug);
    let firstConceptSlug = null;

    if (found && found.index && Array.isArray(found.index.concepts) && found.index.concepts.length) {
      firstConceptSlug = found.index.concepts[0].slug;
      setSidebar(found.index.concepts);
      setSelectedConceptSlug(firstConceptSlug);
    } else {
      setLoading(true);
      try {
        const res = await sanityClient.fetch(mainConceptBySlugQuery, { slug: mcSlug });
        let concepts = (res && res.index && res.index.concepts) ? res.index.concepts : [];

        // If still empty, try the per-main type (e.g. pythonConcepts) to get at least the first doc
        if (!concepts.length) {
          const perType = `${mcSlug}Concepts`;
          const firstOfType = await sanityClient.fetch(
            `*[_type == $type] | order(publishedAt asc)[0]{_id, title, "slug": slug.current, excerpt}`,
            { type: perType }
          );
          if (firstOfType) concepts = [firstOfType];
        }

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

    if (firstConceptSlug) navigateTo(mcSlug, firstConceptSlug);
    else startTransition(() => router.push(`/${mcSlug}`));
  }

  // Sidebar click handler: set selected concept and navigate
  function handleSidebarClick(conceptSlug) {
    setSelectedConceptSlug(conceptSlug);
    if (selectedMain) {
      navigateTo(selectedMain, conceptSlug);
    } else {
      const foundMain = mainConcepts.find(m => (m.index && m.index.concepts || []).some(c => c.slug === conceptSlug));
      const mainSlugForConcept = foundMain ? foundMain.slug : (selectedMain || '');
      if (mainSlugForConcept) navigateTo(mainSlugForConcept, conceptSlug);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial', padding: '0px 0px' }}>
      {/* Top horizontal main concepts */}
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', marginBottom: 18, borderBottom: '1px solid #e1e1e1ff' }}>
        {mainConcepts.map(mc => {
          const isActive = mc.slug === selectedMain;
          return (
            <button
              key={mc._id}
              onClick={() => handleTopClick(mc.slug)}
              style={{
                padding: '8px 14px',
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
          width: 200,
          borderRight: '1px solid #eee',
          // paddingRight: 16
        }}>
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
                        background: active ? '#5950feff' : 'transparent',
                        color:active ? 'white':'black',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: 15 }}>{c.title}</div>
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
            <div style={{textAlign:'center', fontSize:20}}>Loading Course…</div>
          ) : content === null ? (
            <div style={{ color: '#666', textAlign:'center', fontSize:20 }}>Select a course from the left to view its content.</div>
          ) : (
            <article>
              {/* <div style={{ marginTop: 0, fontSize: 20 }}>{content.title}</div> */}
              <div className='article-content' style={{ marginTop: 12, fontSize: 16 }}>
                <PortableText value={content.body} components={portableTextComponent} />
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
