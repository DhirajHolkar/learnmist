
// components/portableTextComponents.js
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '../lib/sanityClient';
import '../styles/portable-text-component.css';

// Prism theme (you can move this import into a global CSS if you prefer)
import 'prismjs/themes/prism-tomorrow.css';

// optionally import additional Prism languages on the client
// We'll dynamically import languages inside the PrismCode component.

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source).auto('format').fit('max');
}

/**
 * PrismCode component
 * - highlights code client-side using Prism.highlightElement
 * - dynamically loads common languages (javascript, python, java, markup, bash, css)
 */
function PrismCode({ code = '', language = '' }) {
  const codeRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadPrismAndHighlight() {
      if (typeof window === 'undefined') return;

      // Load Prism core
      const Prism = (await import('prismjs')).default || window.Prism;

      // Dynamically load common languages (add/remove as needed)
      try {
        // These dynamic imports are no-ops if already loaded
        await Promise.all([
          import('prismjs/components/prism-javascript'),
          import('prismjs/components/prism-python'),
          import('prismjs/components/prism-java'),
          import('prismjs/components/prism-markup'),
          import('prismjs/components/prism-bash'),
          import('prismjs/components/prism-css'),
        ]);
      } catch (err) {
        // ignore language load errors
        // console.warn('Prism language load issue', err);
      }

      // Highlight
      if (mounted && codeRef.current && Prism && Prism.highlightElement) {
        Prism.highlightElement(codeRef.current);
      }
    }

    loadPrismAndHighlight();

    return () => { mounted = false; };
  }, [code, language]);

  const langClass = language ? `language-${language}` : 'language-none';

  return (
    <pre className="pt-code-block" style={{
      background: '#0f172a',
      color: '#e6edf3',
      padding: 14,
      borderRadius: 8,
      overflow: 'auto',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
      fontSize: 14,
      margin: '1rem 0'
    }}>
      <code ref={codeRef} className={langClass}>
        {code}
      </code>
    </pre>
  );
}

export const portableTextComponent = {
  // Marks (inline)
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const blank = value?.blank === true;
      return (
        <a
          href={href}
          target={blank ? '_blank' : undefined}
          rel={blank ? 'noopener noreferrer' : undefined}
          className="pt-link"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => <code className="pt-inline-code">{children}</code>,
  },

  // Block types
  block: {
    h1: ({ children }) => <h1 className="pt-heading pt-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="pt-heading pt-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-heading pt-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="pt-heading pt-h4">{children}</h4>,
    normal: ({ children }) => <p className="pt-paragraph">{children}</p>,
    blockquote: ({ children }) => <blockquote className="pt-blockquote">{children}</blockquote>,
  },

  // Lists
  list: {
    bullet: ({ children }) => <ul className="pt-ul">{children}</ul>,
    number: ({ children }) => <ol className="pt-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pt-li">{children}</li>,
    number: ({ children }) => <li className="pt-li">{children}</li>,
  },

  // Custom types (objects)
  types: {
    image: ({ value }) => {
      if (!value || !value.asset) return null;
      const src = urlFor(value).width(1200).url();
      const alt = value.alt || value.caption || 'Image';
      return (
        <div className="pt-image">
          {/* using simple img tag to avoid next/image loader complexity; you can replace with <Image> if configured */}
          <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} />
          {value.caption && <div className="pt-image-caption">{value.caption}</div>}
        </div>
      );
    },

    // codeBlock: expects an object with { language, code } (adjust if your field names differ)
    codeBlock: ({ value }) => {
      const langRaw = value?.language || value?.lang || '';
      const language = typeof langRaw === 'string' ? langRaw.toLowerCase() : '';
      const code = value?.code || value?.codeString || value?.code_text || '';
      return <PrismCode code={code} language={language} />;
    }
  }
};

export default portableTextComponent;
