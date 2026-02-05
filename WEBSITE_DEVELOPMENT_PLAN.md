# Kibazzi Kraft — Website Development Plan

**Date**: February 5, 2026

## 1) Objectives
- Build a modern, responsive portfolio site for Kibazzi Kraft (Pius Kibazzi).
- Target Kampala/Uganda businesses, NGOs, events, and corporate clients.
- Emphasize visual impact, fast performance, SEO, and simple content updates.

## 2) Audience & UX Principles
- **Primary audience**: Ugandan businesses/NGOs looking for corporate, event, and portrait coverage.
- **Mobile-first**: Prioritize low-bandwidth, mobile viewing.
- **Trust signals**: Testimonials, client logos, years of experience (since 2016), clear contact info.

## 3) Technical Stack
- **Framework**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Galleries**: `react-photo-album` (or Masonry alternative)
- **Lightbox**: `yet-another-react-lightbox`
- **Animations**: Framer Motion
- **Content**: MDX for gallery captions & blog posts (Contentlayer or next-mdx-remote)
- **Hosting**: Vercel (free tier)

## 4) Information Architecture (Site Map)
### Pages
- **Home**: Hero slider, featured portfolio grid, CTA “Book Now”.
- **About**: Studio story, timeline since 2016, team, testimonials, contact info.
- **Portfolio**: Categories (Corporate, Events, Portraits, Video), filters, lightbox.
- **Services**: Videography, corporate events, advertising, portraits; inquiry CTA.
- **Blog**: Case studies + Uganda-focused photo tips (MD/MDX).
- **Contact**: Booking form, WhatsApp link, Google map embed for Kampala.

## 5) Key Features
- **Gallery system**
  - Images stored at `/public/images/gallery/[category]/`.
  - MDX per category for captions, keywords, story snippets.
  - Lazy loading, WebP optimization via `next/image`.
- **Lightbox**
  - Fullscreen carousel, captions and metadata.
- **Dark/Light theme toggle**
  - Default dark theme for photography aesthetic.
- **SEO & Performance**
  - Dynamic metadata, OpenGraph images, sitemap, structured data for images.
  - Core Web Vitals: optimize images, prefetch key pages.
- **Contact & conversion**
  - Formspree/EmailJS integration.
  - WhatsApp CTA (Uganda-friendly).
  - Optional MoMo inquiry link.

## 6) Design Direction
- Minimal, bold visuals; large imagery, subtle animations.
- Strong typography with clear CTA buttons.
- Neutral palette + accent color (gold/orange) to reflect premium brand.

## 7) Content Requirements
- **Photos**: High-resolution WebP (optimized).
- **Captions**: Short stories, client type, location.
- **Testimonials**: 3–5 quotes (corporate + NGO).
- **Services**: Clear list of packages + inquiry CTA.
- **Contact info**: +256 702 374 311, kibazzikraft1@gmail.com, Instagram @kibazzipius.

## 8) Development Phases (1–2 Weeks)
**Week 1**
- Setup Next.js 14 + Tailwind + TypeScript.
- Build layout components (Header, Footer, ThemeToggle).
- Implement Home, About, Services.

**Week 2**
- Gallery + lightbox integration.
- Blog/MDX integration.
- Contact form, SEO, analytics.
- Performance polishing & Vercel deployment.

## 9) Architecture Overview
- **App Router**: `src/app`
- **Components**: `src/components`
- **Content**: `src/content` (MDX + metadata)
- **Images**: `/public/images/gallery`
- **Utilities**: `src/lib` (gallery parsing, SEO helpers)

## 10) Risks & Mitigation
- **Large image sizes** → Batch compress and convert to WebP.
- **Slow load on mobile** → Lazy loading + responsive sizes.
- **Content updates** → Keep MDX simple, avoid DB until needed.

## 11) Copilot Prompt (Scaffolding)
```
Build a professional Next.js 14+ TypeScript photography portfolio website for Kibazzi Kraft (kibazzikraft.com), a Kampala-based studio specializing in corporate photos, events, portraits, and videography. Use Tailwind CSS, Framer Motion for smooth animations, react-photo-album or Masonry for responsive grids, and yet-another-react-lightbox for image modals.

Key requirements:
- Responsive design (mobile-first), dark/light theme toggle.
- Pages: Home (hero slider + featured grid), About (bio, contacts: kibazzikraft1@gmail.com, +256 702 374 311, Instagram @kibazzipius), Portfolio (categories: Corporate, Events, Portraits, Video; MDX captions in /public/gallery/[cat]/_index.mdx), Services (cards with inquiry CTA), Contact (form with validation).
- Image optimization: WebP, lazy load; gallery from /public/images/gallery/.
- SEO: Dynamic meta, OpenGraph for images.
- Extras: WhatsApp button, Instagram embed.

Scaffold with App Router: src/app/[pages]. Structure components reusable (Header, Footer, Gallery). Add TypeScript interfaces. Ensure production-ready (Vercel deploy). Provide setup instructions and example gallery MDX.
```

## 12) Next Steps
1. Fork a template (e.g., next-material-photo-portfolio).
2. Replace images with Pius’s real portfolio and add MDX captions.
3. Test mobile performance and lightbox usability.
4. Deploy to Vercel and configure a `.ug` domain.
5. Add Google Analytics + promote via Facebook/Instagram.
