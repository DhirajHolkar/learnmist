


'use client';
import Link from 'next/link';
import '../styles/Navbar.css';

export default function Navbar() {
  

  return (
    <>

      <nav className="navbar">

        <div className="navbar-logo navbar-item">
          <Link href="/">
            <img src="/learnmist-logo.png" alt="" className="navbar-large-logo" />
            <img src="/learnmist-icon.png" alt="" className="navbar-small-logo" />
          </Link>
        </div>

      </nav>



    </>
  );
}

