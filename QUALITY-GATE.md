# BreadMath Quality Gate Rules

## Release Requirement

Before any code delivery or deployment, the following quality gate MUST be passed:

### 3 Consecutive Zero-Bug Verification Rounds

1. Each round consists of a comprehensive code review covering:
   - JavaScript logic bugs (division by zero, NaN handling, incorrect calculations, type coercion, event listeners)
   - CSS issues (invalid syntax, missing fallbacks, responsive breakpoints, dark mode consistency)
   - HTML/SEO issues (missing meta tags, broken links, semantic HTML, accessibility)
   - Astro-specific issues (import paths, props handling, template syntax)
   - Edge case testing (empty inputs, zero values, negative values, very large values, clipboard unavailability)

2. A round is considered "zero-bug" only when NO bugs are found — no exceptions, no categorization by severity.

3. Three consecutive zero-bug rounds must be achieved before delivery.

4. If any bug is found during a round, the counter resets and fixing + verification starts over from round 1.

## Project Context

- **Project**: BreadMath — pure frontend baking math calculator website
- **Stack**: Astro (SSG) → static HTML output
- **Deployment**: Cloudflare Pages (connected to GitHub)
- **Target**: English-speaking home bakers and sourdough enthusiasts
- **Monetization**: Google AdSense (to be added after traffic is established)
- **Zero cost**: No backend, no database, no paid services (except domain name)

## Bug Checking Checklist

When performing verification, check at minimum:
- [ ] All 7 pages build without errors
- [ ] All calculations produce correct results
- [ ] All copy buttons are guarded against missing clipboard API
- [ ] Dark mode FOUC is prevented (blocking script in <head>)
- [ ] Hydration thresholds are consistent between code and UI
- [ ] aria-live regions on all result displays
- [ ] OG/Twitter meta tags are correct
- [ ] color-mix() has solid background fallback
- [ ] -webkit-backdrop-filter is present
- [ ] JSON-LD structured data on homepage
- [ ] Canonical URLs on all pages
- [ ] sitemap.xml is generated
- [ ] robots.txt is present
- [ ] All internal links are correct
- [ ] Mobile menu opens/closes correctly
- [ ] Theme toggle works and persists
- [ ] No empty catch() blocks
- [ ] No unhandled TypeErrors