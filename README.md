# Misafir — marketing site

An AI maître for hospitality. A static, multi-page marketing site for the Misafir
productized service (reviews + guest messages + weekly owner's brief, draft-first
with a human approval gate).

## Pages
- `index.html` — home: animated multilingual hero (ember particles + pointer-reactive glow), the **interactive "see it work" demo**, why-it's-different pillars, stats, the six capability modules, pricing preview, CTA.
- `how-it-works.html` — the watch → read → draft → approve loop, a week in the life, the **interactive demo**, integrations, and trust/data care (GDPR & KVKK, the human gate).

## The interactive demo (show, don't tell)
The centerpiece on both `index.html` and `how-it-works.html`. A guest message arrives (cycling through real examples in Turkish, German, English and Italian), Misafir surfaces the detected language / intent / sentiment, then **typewrites the reply in that language** and waits behind an "Approve & send" gate. It auto-advances through the languages, visitors can jump to any language, and "Approve" demonstrates the human gate. Driven by the engine in `assets/main.js` (search `data-demo`); fully reduced-motion safe (shows a resolved static state instead of animating).
- `pricing.html` — the three tiers (Front Desk / Front of House / Maison), what's in every tier, and an FAQ.
- `contact.html` — "book a pilot" form. Submits over AJAX to FormSubmit and shows an inline success message — the button sends immediately, no email client involved. The destination address is assembled at runtime from a base64 string in `assets/main.js`, so it never appears as plain text in the page.

## Shared assets
- `assets/style.css` — the "evening service" design system: Aegean ink-teal base, brass accent, ivory surfaces; Fraunces + Manrope. Floating cards with gradient borders (no boxy 1px grids), an animated aurora background, soft section dividers, button sheen, metallic display headings. Responsive and reduced-motion safe.
- `assets/main.js` — nav condense + scroll-progress bar, mobile menu, multilingual welcome rotator, hero ember-particle canvas + pointer glow, channel marquee, scroll reveals, stat count-ups, the interactive demo engine, and the contact form handler.
- `favicon.svg` — brand mark.

## Design system
Colors: `--ink #0C2624`, `--brass #CBA258`, `--brass-bright #E4BE73`, `--ivory #F5EFE2`, `--sage #92A89B`.
Type: **Fraunces** (display / italic accents) + **Manrope** (body), via Google Fonts.
Signature: the hero "welcome" rotator (Hoş geldiniz → Welcome → Willkommen → …) — the core differentiator.

## Deploy
Pure static files — host on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
No build step. Open `index.html` locally to preview.

## To customise
- **Rename the brand**: replace `Misafir` in each page's `<title>`, nav brand, and footer brand.
- **Pricing**: Front Desk £99/mo (+£250 setup), Front of House £199/mo (+£500), Maison £349/mo (+£900). Adjust per market (GBP / EUR / TRY; per-venue vs flat for groups).
- **Contact form** posts to FormSubmit (`https://formsubmit.co`) with no signup. The destination email is set via a base64 string in `assets/main.js` (search for `atob`). **One-time activation:** the first time the form is submitted, FormSubmit emails the destination address a confirmation link — click it once and every submission after that arrives instantly in the inbox. To swap the address, change the base64 value. For a setup where the email is fully hidden behind a random key (never in the source at all), create a free key at web3forms.com or formspree.io and point the `fetch` at that endpoint instead.
- No invented testimonials or logos — "now onboarding our first venues" is the honest, intentional positioning.
