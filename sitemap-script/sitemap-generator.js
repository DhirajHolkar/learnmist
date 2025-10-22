// generate-sitemap.js
// Put this file in the folder where you want sitemap.xml to be written (e.g. `public/`).
// Usage: set BASE_URL (required), and optionally SANITY_PROJECT_ID and SANITY_DATASET, then run `node generate-sitemap.js`

const fs = require('fs');
const path = require('path');
const {createClient} = require('@sanity/client');

// const PROJECT_ID = process.env.SANITY_PROJECT_ID || '7wv11tih'; // fallback to your project id
// const DATASET = process.env.SANITY_DATASET || 'production';
// const BASE_URL = process.env.BASE_URL || '';


const PROJECT_ID =  '7wv11tih'; // fallback to your project id
const DATASET = 'production';
const BASE_URL = 'https://www.learnmist.com';

if (!BASE_URL) {
  console.error('ERROR: BASE_URL environment variable not set. Set BASE_URL (e.g. https://example.com) and re-run.');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: true, // use CDN for speed; content is public
  apiVersion: '2025-01-01',
});

async function fetchPaths() {
  // Fetch main concepts + their index list (dereferencing the referenced concept docs).
  // The dereference will pull publishedAt and slug.current if those exist on the referenced documents.
  const q = `*[_type == "mainConcept"] | order(title asc){
    "main": slug.current,
    title,
    publishedAt,
    "index": index->{
      title,
      "concepts": concepts[]->{
        "slug": slug.current,
        "publishedAt": publishedAt
      }
    }
  }`;

  const res = await client.fetch(q);
  return res || [];
}

function toXmlDate(d) {
  if (!d) return null;
  const iso = new Date(d).toISOString();
  // sitemap expects YYYY-MM-DD or full ISO. We'll use YYYY-MM-DD
  return iso.split('T')[0];
}

function buildSitemapXml(urlEntries) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const footer = `</urlset>\n`;

  const body = urlEntries.map(e => {
    const parts = [];
    parts.push(`  <url>`);
    parts.push(`    <loc>${e.loc}</loc>`);
    if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
    if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
    if (e.priority !== undefined) parts.push(`    <priority>${e.priority}</priority>`);
    parts.push(`  </url>`);
    return parts.join('\n');
  }).join('\n');

  return header + body + '\n' + footer;
}

(async function main() {
  try {
    const mains = await fetchPaths();

    const entries = [];

    // Homepage
    entries.push({
      loc: `${BASE_URL}/`,
      changefreq: 'daily',
      priority: '1.0'
    });

    for (const m of mains) {
      const mainSlug = m.main;
      const mainUrl = `${BASE_URL}/${mainSlug}`;

      // main lastmod: use main.publishedAt or newest concept date
      let mainLastmod = toXmlDate(m.publishedAt);
      if ((!mainLastmod || mainLastmod === null) && m.index && Array.isArray(m.index.concepts) && m.index.concepts.length) {
        // find latest publishedAt among concepts
        const dates = m.index.concepts.map(c => c.publishedAt).filter(Boolean);
        if (dates.length) {
          // latest:
          const latest = dates.reduce((a,b) => new Date(a) > new Date(b) ? a : b);
          mainLastmod = toXmlDate(latest);
        }
      }

      entries.push({
        loc: mainUrl,
        lastmod: mainLastmod,
        changefreq: 'weekly',
        priority: '0.8'
      });

      // concepts under main
      if (m.index && Array.isArray(m.index.concepts)) {
        for (const c of m.index.concepts) {
          if (!c || !c.slug) continue;
          const conceptUrl = `${BASE_URL}/${mainSlug}/${c.slug}`;
          entries.push({
            loc: conceptUrl,
            lastmod: toXmlDate(c.publishedAt),
            changefreq: 'monthly',
            priority: '0.6'
          });
        }
      }
    }

    const xml = buildSitemapXml(entries);
    const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outPath, xml, { encoding: 'utf8' });
    console.log(`Sitemap written to ${outPath} — contains ${entries.length} URLs`);
  } catch (err) {
    console.error('Failed to generate sitemap:', err);
    process.exit(1);
  }
})();
