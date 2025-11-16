

// app/page.js
import React from "react";
import Link from "next/link";
import { sanityClient } from "../../lib/sanityClient";
import { allMainConceptsQuery } from "../../lib/queries";
import '../../styles/main-page.css'; // import the CSS

export default async function Page() {

  const mainConcepts = await sanityClient.fetch(allMainConceptsQuery);

  return (
    <main className="main-container">
      <header className="header">
        <div className="main-container-title"><span>Learn Mist</span> Helps You Learn Computer Science With Easy Language and Simplicity</div>
        <div className="main-container-subtitle">Choose a technology below to start learning</div>
      </header>

      <section className="cards-grid">

        {mainConcepts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280' }}>
            No main concepts found. Add some in Sanity Studio.
          </div>
        )}

        {mainConcepts.map((mc, i) => {
          const firstConcept =
            mc.index &&
            Array.isArray(mc.index.concepts) &&
            mc.index.concepts.length
              ? mc.index.concepts[0]
              : null;
          const href = firstConcept
            ? `/${mc.slug}/${firstConcept.slug}`
            : `/${mc.slug}`;

          const gradientClass = `gradient-${i % 6}`;

          return (
            <Link key={mc._id} href={href}>
              <div className={`card ${gradientClass}`}>
                <div className="card-overlay"></div>
                <div>

                  <h2>{mc.title}</h2>


                </div>
                <div style={{ fontSize: '1.5rem', opacity: 0.9 }}>
                  Click to Start Learning →
                </div>
              </div>
            </Link>
          );
        })}
      </section>





      {/* <footer className="footer">
        © {new Date().getFullYear()} Learnmist — Learn smarter.
      </footer> */}


    </main>


  );
}
