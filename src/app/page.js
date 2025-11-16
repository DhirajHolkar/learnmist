

// app/page.js
import React from "react";
import Link from "next/link";
// import { sanityClient } from "../lib/sanityClient";
// import { allMainConceptsQuery } from "../lib/queries";
import '../styles/main-page.css'; // import the CSS

export default async function Page() {

  // const mainConcepts = await sanityClient.fetch(allMainConceptsQuery);

  return (
    <main className="main-container">
      <header className="header">
        <div className="main-container-title"><span>Learn Mist</span> Helps You Learn Computer Science With Easy Language and Simplicity</div>
        {/* <div className="main-container-subtitle">Choose a technology below to start learning</div> */}
      </header>


      
      <section className="cards-grid">
        <Link href="/computer-science">
          <div className="card gradient-1">
            <div className="card-overlay"></div>
          <div>
          <h2>Computer Science</h2>
          </div>
          <div style={{ fontSize: '1.5rem', opacity: 0.9 }}>
          Click to Start Learning →
          </div>
          </div>
        </Link>
      </section>






      {/* <footer className="footer">
        © {new Date().getFullYear()} Learnmist — Learn smarter.
      </footer> */}


    </main>


  );
}
