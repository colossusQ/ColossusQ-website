# Colossus Q — Experiential Marketing & Event Production

> **Production at the core. Delivering high-calibre brand experiences, live entertainment staging, and turnkey corporate events across South India.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://colossusq.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://colossusq.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://colossusq.com/)
[![Zero-Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=for-the-badge)](https://colossusq.com/)
[![SEO-Optimized](https://img.shields.io/badge/SEO-Schema.org%20JSON--LD-blue?style=for-the-badge)](https://colossusq.com/)

---

## 🌟 Overview

**Colossus Q** is a premier event management and production company headquartered in Hyderabad, Telangana, delivering comprehensive experiential marketing, brand activations, large-scale music concerts, and corporate summits across South India.

This repository houses the complete, production-ready static website engineered for high visual fidelity, sub-second load times, fluid responsiveness, and instant lead conversion.

* **Live Domain:** [https://colossusq.com/](https://colossusq.com/)
* **Headquarters:** Ameerpet, Hyderabad, Telangana, India
* **Parent Organization:** Levelup Media Private Limited

---

## 🚀 Key Features

* **Zero-Build Vanilla Architecture:** Ultra-fast, lightweight HTML5, modern CSS3 (Custom Properties & Flex/Grid), and vanilla ES6 JavaScript with zero bundler overhead.
* **17 Fully Responsive Pages:** Flawless layout adaptation across desktop, tablet, and mobile screens.
* **Instant WhatsApp Brief Generator:** 2-step event planning brief on `/contact/` that automatically compiles event scope, budget, dates, and requirements, instantly opening a direct chat with production leadership (+91 91001 89023).
* **Enterprise SEO Architecture:**
  * Schema.org `LocalBusiness`, `ProfessionalService`, and `WebSite` JSON-LD structured data.
  * Complete Open Graph & Twitter Card meta configurations.
  * Canonical URLs, `robots.txt`, and automated `sitemap.xml` mapping.
* **Production Staging & Technical Showcases:** Dedicated deep-dive service pages covering German hangars, trussing, high-lumen laser projection, line-array audio, and LED wall rentals.
* **Security & Performance Headers:** Pre-configured `vercel.json` and `_headers` featuring strict Content Security Policies, X-Frame-Options, and immutable asset caching.

---

## 📁 Repository Structure

```text
colossus-q-site/
├── index.html                           # Home / Flagship landing page
├── about/
│   └── index.html                       # About Colossus Q & Founder Profile
├── services/
│   ├── index.html                       # Services Master Overview
│   ├── experiential-marketing/          # Brand activations & immersive installations
│   ├── corporate-events/                # Corporate conferences, annual days & MICE
│   ├── concerts-entertainment/          # Music festivals, arena shows & live gigs
│   ├── public-cultural-events/          # Government & large public cultural gatherings
│   ├── exhibitions-trade-shows/         # Custom HITEX booth design & fabrication
│   ├── event-production/                # Heavy technical staging, trussing & German hangars
│   └── event-management/                # Turnkey operations, licensing & crowd security
├── work/
│   ├── index.html                       # Production portfolio & showcase
│   └── rangtaali-season-5/              # Rangtaali Season 5 Navratri Case Study
├── contact/
│   └── index.html                       # Interactive 2-Step Project Brief Form
├── partners/
│   └── index.html                       # Technical & Production Partnership Hub
├── privacy-policy/
│   └── index.html                       # Data handling & compliance policy
├── thank-you/
│   └── index.html                       # Post-enquiry confirmation page
├── 404.html                             # Custom branded 404 error page
├── assets/
│   ├── styles.css                       # Global design system & layout tokens
│   ├── fonts.css                        # Self-hosted typography (Fraunces & Instrument)
│   ├── site.js                          # Navigation, sliders & form handlers
│   └── fonts/                           # Local font binaries
├── server.js                            # High-performance local development server
├── sitemap.xml                          # XML search engine sitemap
├── robots.txt                           # Search engine crawling rules
├── vercel.json                          # Vercel deployment headers & cache controls
└── _headers                             # Cloudflare Pages / Netlify security headers
```

---

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)

### Running Locally
To launch the development server with live streaming and cache-control headers:

```bash
# Clone the repository
git clone https://github.com/<your-username>/colossus-q-site.git
cd colossus-q-site

# Start the dev server
node server.js
```

The site will be available immediately at:
```text
http://localhost:8080/
```

Alternatively, you can serve the directory using any static file server (e.g. Python `python -m http.server 8080`, VS Code Live Server, or NGINX).

---

## 🚢 Production Deployment

### Option 1: Vercel (Recommended)
This repository includes a pre-configured `vercel.json` with security headers and immutable caching for static assets:
```bash
npm i -g vercel
vercel --prod
```

### Option 2: Cloudways (Managed Cloud Server)
1. In Cloudways Platform, create a **Custom App (PHP)** application on your server.
2. Under **Application Management > Deployment via Git**:
   - Generate and add the Cloudways SSH key to GitHub (Repository **Settings > Deploy keys**).
   - Remote Address: `git@github.com:colossusQ/ColossusQ-website.git`
   - Branch: `main`
   - Deployment Path: leave **blank** (deploys to default `public_html/`).
3. Click **Start Deployment**. The included `.htaccess` automatically configures Gzip, Far-Future Caching, clean URLs, and security headers.

### Option 3: Cloudflare Workers / Pages
Pre-configured with `wrangler.jsonc` and `_headers`. Deploy with:
```bash
npx wrangler deploy
```

### Option 4: Netlify / GitHub Pages
- **Netlify:** Connect repository directly; `_headers` applies security policies.
- **GitHub Pages:** Select `main` branch root `/` as deployment source.

---

## 📞 Contact & Inquiries

* **Phone:** [+91 91001 89023](tel:+919100189023)
* **WhatsApp:** [Chat with Colossus Q](https://wa.me/919100189023?text=Hi%20Colossus%20Q%2C%20I%27d%20like%20to%20discuss%20an%20event.)
* **Email:** [events@colossusq.com](mailto:events@colossusq.com)
* **Office:** 1110, 10th Floor, Vasavi MPM Grand, Ameerpet, Hyderabad, Telangana 500073, India

---

## ⚖️ License & Copyright

© 2026 **Levelup Media Private Limited**. All rights reserved.  
Colossus Q is a registered commercial brand of Levelup Media Private Limited.

