// /components/MainUI.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanityClient';
import { mainConceptBySlugQuery, conceptBySlugQuery } from '../lib/queries';
import { PortableText } from '@portabletext/react';

export default function MainUI({ initialMainConcepts = [], defaultMainSlug = null }) {
  const [mainConcepts] = useState(initialMainConcepts || []);
  const [selectedMainSlug, setSelectedMainSlug] = useState(defaultMainSlug || (initialMainConcepts[0] && initialMainConcepts[0].slug));
  const [sidebarConcepts, setSidebarConcepts] = useState([]);
  const [selectedConceptSlug, setSelectedConceptSlug] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  // When main concept changes, fetch its index (sidebar)
  useEffect(() => {
    if (!selectedMainSlug) return;
    setLoading(true);
    sanityClient.fetch(mainConceptBySlugQuery, { slug: selectedMainSlug })
      .then(res => {
        const concepts = (res && res.index && Array.isArray(res.index.concepts)) ? res.index.concepts : [];
        setSidebarConcepts(concepts);
        // set selected concept to previous selection or the first concept in this list
        setSelectedConceptSlug(prev => prev && concepts.some(c => c.slug === prev) ? prev : (concepts[0] && concepts[0].slug));
      })
      .catch(err => {
        console.error('Error fetching main concept index:', err);
        setSidebarConcepts([]);
        setSelectedConceptSlug(null);
      })
      .finally(() => setLoading(false));
  }, [selectedMainSlug]);

  // When selected concept changes, fetch its full content
  useEffect(() => {
    if (!selectedConceptSlug) {
      setContent(null);
      return;
    }
    setLoading(true);
    sanityClient.fetch(conceptBySlugQuery, { slug: selectedConceptSlug })
      .then(res => setContent(res))
      .catch(err => {
        console.error('Error fetching concept content:', err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, [selectedConceptSlug]);

  // handle top bar click
  function handleMainClick(slug) {
    setSelectedMainSlug(slug);
    // clear previous selection while new index loads
    setSelectedConceptSlug(null);
    setContent(null);
  }

  return (

    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial', 
    // padding: 20
  }}>

      {/* Top horizontal main concepts bar */}
      <div style={{ 
        display: 'flex',
        // gap: 10, 
        overflowX: 'auto', 
        // paddingBottom: 12,
        // marginBottom: 18 ,
        borderBottom:'1px solid #cfcfcfff',
        // padding:'0px 10px'

        }}>

        {mainConcepts.length === 0 && <div>No main concepts found in Sanity.</div>}
        {mainConcepts.map(mc => {
          const isActive = mc.slug === selectedMainSlug;
          return (
            <button
              key={mc._id}
              onClick={() => handleMainClick(mc.slug)}
              style={{
                padding: '8px 14px',
                // borderRadius: 8,
                border: isActive ? '2px solid #675eedff' : '1px solid #e6e6e6',
                background: isActive ? '#525feaff' : '#fff',
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
      <div style={{ 
        display: 'flex',
        //  gap: 24
         }}>


        {/* Sidebar */}
        <aside style=
        {{
          //  width: 340, 
           width:'200px',
          //  borderRight: '1px solid #eee', 
          //  paddingRight: 16 
          marginTop:'20px'
          }}>

          {/* <h3 style={{ marginTop: 0 }}>Contents</h3> */}

          {loading && sidebarConcepts.length === 0 ? (
            <div>Loading contents…</div>
          ) : sidebarConcepts.length === 0 ? (
            <div style={{ color: '#666' }}>No concepts available for this main topic.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sidebarConcepts.map((c, i) => {
                const active = c.slug === selectedConceptSlug;
                return (

                  <li key={c._id}
                  //  style={{ marginBottom: 14 }}
                  //  style={{ marginBottom: 2 }}
                   >

                    <div
                      onClick={() => setSelectedConceptSlug(c.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSelectedConceptSlug(c.slug); }}
                      style={{
                        // padding: '8px 10px',
                        padding: '5px 10px',
                        // borderRadius: 8,
                        // background: active ? '#f5f5f5' : 'transparent',
                        background: active ? '#5d48f7ff' : 'transparent',
                        color:active?'white':'black',
                        cursor: 'pointer',
                        fontSize:'15px'
                        
                      }}
                    >
                      <div 
                      // style={{ fontWeight: 400 }}
                      >
                        {/* {i + 1}. */}
                        {c.title}
                      </div>

                      {/* {c.excerpt && <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{c.excerpt}</div>} */}

                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>




        {/* Content area */}
        <main style={{ 
          flex: 1 ,
          borderLeft: '1px solid #eee', 

          }}>

          {loading && content === null ? (
            <div>Loading lesson…</div>
          ) : content === null ? (
            <div style={{ color: '#666' }}>Select a lesson from the left to view its content.</div>
          ) : (

            <article style={{margin: '50px 50px'}}>
              <div style={{ marginTop: 19, fontSize:'20px' }}>{content.title}</div>
              {/* {content.estimatedTime && <div style={{ color: '#777', marginBottom: 10 }}>Est. {content.estimatedTime}</div>} */}
              <div style={{ marginTop: 12, fontSize:'15px' }}>
                <PortableText value={content.body} />
              </div>
            </article>
          )}
        </main>


      </div>

    </div>
  );
}
