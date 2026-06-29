# Misafir — marketing site

An AI maître for hospitality. A static, multi-page marketing site for the Misafir
productized service (reviews + guest messages + weekly owner's brief, draft-first
with a human approval gate).

## Pages
- `index.html` — home: animated multilingual hero, live "morning brief" demo, why-it's-different pillars, stats, the six capability modules, pricing preview, CTA.
- `how-it-works.html` — the watch → read → draft → approve loop, a week in the life, a real review→reply showcase, integrations, and trust/data care (GDPR & KVKK, the human gate).
- `pricing.html` — the three tiers (Front Desk / Front of House / Maison), what's in every tier, and an FAQ.
- `contact.html` — "book a pilot" form (opens the visitor's email client to `hello@misafir.app`; no backend required).

## Shared assets
- `assets/style.css` — the "evening service" design system: Aegean ink-teal base, brass accent, ivory surfaces; Fraunces + Manrope; reveal-on-scroll, responsive, reduced-motion safe.
- `assets/main.js` — nav condense + mobile menu, multilingual welcome rotator, scroll reveals, stat count-ups, contact form handler.
- `favicon.svg` — brand mark.

## Design system
Colors: `--ink #0C2624`, `--brass #CBA258`, `--brass-bright #E4BE73`, `--ivory #F5EFE2`, `--sage #92A89B`.
Type: **Fraunces** (display / italic accents) + **Manrope** (body), via Google Fonts.
Signature: the hero "welcome" rotator (Hoş geldiniz → Welcome → Willkommen → …) — the core differentiator.

## Deploy
Pure static files — host on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
No build step. Open `index.html` locally to preview.

## To customise
- **Rename the brand**: replace `Misafir` in each page's `<title>`, nav brand, footer brand, and the `hello@misafir.app` mailto / contact handler in `assets/main.js`.
- **Pricing** (£49 / £99 / £179 + setup) is placeholder — finalize per market (GBP / EUR / TRY; per-venue vs flat for groups).
- **Contact form** currently opens the visitor's mail client. To capture submissions server-side, point the `#contact-form` handler at a form endpoint (e.g. Formspree) or a serverless function.
- No invented testimonials or logos — "now onboarding our first venues" is the honest, intentional positioning.
