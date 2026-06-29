# Misafir — marketing site

An AI maître for hospitality. A static, multi-page marketing site for the Misafir
productized service (reviews + guest messages + weekly owner's brief, draft-first
with a human approval gate), plus a client onboarding intake form.

## Design language — "bright atelier" (v2)
A bright, warm-white, modern-SaaS look: emerald accent, big Space Grotesk headlines,
Inter body, soft colour-mesh background, floating cards with soft depth, rounded
shapes, a pill nav, and motion that *explains* rather than decorates. No section
divider lines, no scroll-progress bar. Fully responsive and reduced-motion safe.
Tokens live at the top of `assets/style.css`.

## Pages
- `index.html` — home: asymmetric hero with an animated "morning brief" panel + floating message chips, the interactive demo, an animated **bento grid** of features (in-tile motion: filling stars, sorting lanes, growing bars, an approve toggle), a four-step "how it works", stats, pricing preview, CTA.
- `how-it-works.html` — the watch → read → draft → approve loop, the interactive demo, a bento of "what lands in your inbox", integrations, and trust/data care (GDPR & KVKK, the human gate).
- `pricing.html` — three tiers, "in every tier", and an FAQ.
- `contact.html` — "book a pilot" form (sends immediately, see below).
- `onboarding.html` — **client intake wizard** (see below). `noindex`.

## The interactive demo (show, don't tell)
On `index.html` and `how-it-works.html`. A guest message arrives (cycling Turkish /
German / English / Italian across review, email and WhatsApp), Misafir surfaces the
detected language / intent / sentiment, then **typewrites the reply in that language**
and waits behind an "Approve & send" gate. Auto-advances; visitors can jump to any
language. Engine in `assets/main.js` (search `data-demo`); reduced-motion shows a
resolved static state.

## Onboarding wizard — collecting the n8n config
`onboarding.html` is the form you send a client **once they've signed up / paid**. It's
a 5-step wizard (no login) that gathers everything needed to configure the n8n agent:
1. **About you** — name, role, group, venue count, email, phone, plan.
2. **Your venues** — repeatable blocks: venue name, city, Google Maps/Business Profile link (so reviews can be read).
3. **Channels & access** — which channels to watch (Google reviews, Google Business Profile replies, WhatsApp Business, email, Instagram, review requests) + WhatsApp number, shared mailbox, IG handle, website.
4. **Booking & house voice** — booking system, languages guests use, tone, sign-off, do/don't rules.
5. **Review & send** — auto-built summary, free-text notes, submit.
Submissions post to the same destination as the contact form (see below). Engine in
`assets/main.js` (the `#wizard` block): step nav, validation, add/remove venue, and the
auto-populated review.

## Shared assets
- `assets/style.css` — the v2 design system and all components.
- `assets/main.js` — nav, mobile menu, welcome rotator, channel marquee, scroll reveals, stat count-ups, bento star animation, the interactive demo engine, the onboarding wizard, and the form handler.
- `favicon.svg` — emerald brand mark.

## Forms — instant send, email hidden
Both the contact form and the onboarding wizard post over AJAX to **FormSubmit**
(`https://formsubmit.co`) and show an inline success message — the button sends
immediately, no email client. The destination address is assembled at runtime from a
base64 string in `assets/main.js` (search `atob`), so it never appears as plain text.
**One-time activation:** the first submission triggers a confirmation email to the
destination address — click the link once and every submission after lands instantly.
To swap the address, change the base64 value. For an address that's fully hidden behind
a random key, create a free key at web3forms.com or formspree.io and point the `fetch`
at that endpoint.

## Deploy
Pure static files — host anywhere (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
No build step. Open `index.html` to preview.

## To customise
- **Brand name**: replace `Misafir` in each page's `<title>`, nav brand and footer brand.
- **Accent colour**: change `--brand` / `--brand-deep` / `--brand-ink` in `assets/style.css`.
- **Pricing**: Front Desk £99/mo (+£250), Front of House £199/mo (+£500), Maison £349/mo (+£900). Adjust per market.
- No invented testimonials or logos — "now onboarding our first venues" is the honest positioning.
