// components/portableTextComponents.js
import React from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';
// import {sanityClient as client} from '../lib/sanityClient';
 // default export or named export? adjust import if needed
import '../styles/portable-text-component.css'
// Ensure your sanityClient export supports createImageUrlBuilder (we used 'sanityClient' earlier).
// If your lib/sanityClient.js exports `sanityClient`, do:
// import { sanityClient } from '../lib/sanityClient'; and then use imageUrlBuilder(sanityClient)
// adjust below accordingly.

import { sanityClient } from '../lib/sanityClient';

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source).auto('format').fit('max');
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
      // value is the image object
      if (!value || !value.asset) return null;
      const src = urlFor(value).width(1200).url();
      const alt = value.alt || value.caption || 'Image';
      return (
        <div className="pt-image">
          <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} />
          {value.caption && <div className="pt-image-caption">{value.caption}</div>}
        </div>
      );
    },

    // your custom codeBlock object type
    codeBlock: ({ value }) => {
      // value: { language, code, highlightLines }
      const lang = value?.language || '';
      const code = value?.code || '';
      const hl = value?.highlightLines || '';
      return (
        <pre className="pt-code" data-language={lang}>
          <code>{code}</code>
        </pre>
      );
    }
  }
};

export default portableTextComponent;
