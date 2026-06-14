import type { APIRoute } from 'astro';
import { langCodes, defaultLang } from '../i18n/index';

const basePages = [
  { url: '/', priority: '1.0' },
  { url: '/hydration-calculator/', priority: '0.9' },
  { url: '/recipe-scaler/', priority: '0.9' },
  { url: '/yeast-converter/', priority: '0.9' },
  { url: '/bakers-percentage/', priority: '0.9' },
  { url: '/pizza-dough-calculator/', priority: '0.9' },
  { url: '/sourdough-starter-calculator/', priority: '0.9' },
];

const today = new Date().toISOString().split('T')[0];

// Generate all pages for all languages
const allPages: { url: string; priority: string }[] = [];
for (const page of basePages) {
  // Default language at root
  allPages.push({ url: page.url, priority: page.priority });
  // Other languages with prefix
  for (const lang of langCodes) {
    if (lang === defaultLang) continue;
    allPages.push({
      url: `/${lang}${page.url}`,
      priority: lang === 'zh' ? page.priority : String(parseFloat(page.priority) - 0.1),
    });
  }
}

export const GET: APIRoute = ({ site }) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(p => {
  // Find alternate language versions
  const cleanPath = p.url.replace(/^\/(zh|es|ar|pt|ja|de)/, '') || '/';
  const alternates = langCodes.map(lang => {
    const href = lang === defaultLang
      ? new URL(cleanPath, site).href
      : new URL(`/${lang}${cleanPath}`, site).href;
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
  }).join('\n');
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL(cleanPath, site).href}"/>`;

  return `  <url>
    <loc>${new URL(p.url, site).href}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
${alternates}
${xDefault}
  </url>`;
}).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
