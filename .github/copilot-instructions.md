# Copilot Instructions for Skylark Memory (天喜旅行 Brand Story)

## Project Overview
**Skylark Memory** is a brand heritage website showcasing the company's journey from its golden era through challenges to a reimagined future. The site uses Japanese traditional aesthetics (Wa-Modern theme) with vertical text narratives reflecting Japanese design philosophy.

### Key Statistics
- **Type**: Static HTML/CSS/JavaScript website
- **Framework**: Bootstrap 5 + vanilla JavaScript
- **Language**: Traditional Chinese (zh-TW) + English
- **Styling Approach**: Japanese traditional colors with modern minimalism
- **Pages**: `index.html` (home), `demo.html` (template reference)
- **Expected Pages**: `origin.html`, `history.html`, `memory.html`, `vision.html` (referenced in nav but need creation)

---

## Architecture & Patterns

### Color System (CSS Variables)
All colors defined in `style.css` `:root` as CSS variables - **never use hardcoded hex values**:
- `--skylark-bg`: #F9F7F2 (warm paper white - canvas)
- `--skylark-blue`: #004B87 (brand primary, deep indigo)
- `--skylark-dark-blue`: #1a2b48 (text primary)
- `--skylark-green`: #78BE20 (accent/action, seedling metaphor)
- `--skylark-purple`: #887f7a (secondary info, memory/warmth)
- `--skylark-gold`: #C5A065 (dividers, prestige)

### Typography
- **Headings** (`h1-h6`, `.navbar-brand`): `'Noto Serif TC'` (serif - elegant, historical)
- **Body text**: `'Noto Sans TC'` (sans-serif - modern, readable)
- Standard line-height: `1.8`, letter-spacing: `0.05em` for breathing room

### Component Conventions
- **Buttons**: `.btn-skylark` (rounded 50px) - hover changes to green with lift effect
- **Links**: `.btn-link-skylark` (underline on hover)
- **Badges**: `.badge-skylark` (bordered, serif font)
- **Text Sections**: `.fade-in-text` class triggers scroll animations via Intersection Observer

---

## Hero Section (Template Pattern)

The hero section is the core template for large showcase areas:

1. **Desktop (col-lg-6)**: Background image with texture overlay + gradient mask
2. **Mobile**: Dimmed background image (`opacity: 0.15`) as fallback
3. **Text Area (col-lg-6)**: Vertical writing layout

### Image Carousel Logic
- Located in `assets/js/main.js`
- **Path**: `assets/images/hero/` (preload PNG files)
- **Rotation**: Every 8 seconds with 1s fade transition
- **Methods**: `Math.random()` for initial image, modulo for cycling
- **IDs**: `heroImageLayer` (desktop), `mobileHeroBg` (mobile)

### Vertical Text Layout
- Writing mode: `writing-mode: vertical-rl` + `text-orientation: upright`
- Class: `.vertical-text` (apply to `<div>` containers)
- Direction: right-to-left (`.hero-text-group` uses `flex-direction: row-reverse`)
- Dividers: `.vertical-divider` class with `.year-tag` for years (e.g., "SINCE 1990")

---

## JavaScript Interactions

### Core Behaviors (main.js)
1. **Navbar Scroll Effect**: Shadow added after 50px scroll
   - Selector: `.navbar-skylark`
   - Adds `boxShadow: 0 4px 20px rgba(0,0,0,0.05)` on scroll

2. **Hero Image Carousel**: Auto-rotates every 8s, preloads all images
   - Elements: `#heroImageLayer`, `#mobileHeroBg`
   - CSS Transition: `opacity 1s ease-in-out`

3. **Scroll-Triggered Fade-In**: Intersection Observer on `.fade-in-text`
   - Threshold: 15% visible to trigger
   - Adds class: `visible` (CSS handles fade effect)
   - One-time trigger per element

---

## File Structure & Responsibilities

```
assets/
├── css/style.css       → All styling, color system, layout (793 lines)
├── js/main.js          → Scroll effects, carousel, fade-in observer
├── images/
│   ├── hero/           → Hero carousel images (hero-luggage.webp, hero-noren.webp, hero-notebook.webp)
│   ├── logo/           → logo.png (navbar, 55px height desktop)
│   └── index/          → Page-specific imagery

index.html             → Home page (序 - Prologue)
demo.html              → Template/style reference
origin.html            → (TODO) 源 - Origin story
history.html           → (TODO) 跡 - Historical events
memory.html            → (TODO) 憶 - Customer memories
vision.html            → (TODO) 願 - Future vision
```

---

## Development Workflows

### Adding New Pages
1. Copy structure from `index.html` or `demo.html`
2. Update `<title>` and nav active state
3. Use consistent section class naming: `.manifesto-section`, `.memory-section`, etc.
4. Apply `.fade-in-text` to content that should animate on scroll
5. Test responsive breakpoints (mobile toggle at `col-lg-6`)

### Styling New Components
1. Define color variables in `:root` (never hardcode)
2. Use `.vertical-text` for any vertical Chinese typography
3. Apply `.btn-skylark` or `.btn-link-skylark` for consistency
4. Ensure 55px logo height maintained on navbar
5. Test with Chrome DevTools (no IE11 support)

### Adding Images
- **Hero carousel**: Place PNG in `assets/images/hero/`, add filename to `images` array in `main.js`
- **Logo updates**: Ensure 55px height, update `navbar-logo` class only
- **Section images**: Organize by page name in `assets/images/[page-name]/`

---

## Key Conventions & Gotchas

- **Navbar Structure**: Has hardcoded comments "已更新" (already updated) - these are developer notes, not requirements
- **Font Imports**: Google Fonts loaded in CSS `@import` - requires internet connectivity
- **Bootstrap 5**: Used for grid and toggler only, custom styling overrides defaults
- **Chinese Typography**: Always use serif for headings (traditional, formal), sans-serif for body (modern, accessible)
- **Mobile Responsiveness**: Primary breakpoint at `d-lg-block` / `col-lg-6` (992px)
- **Scroll Threshold**: Hero fade-in triggers at 15% visibility - adjust `threshold: 0.15` if needed
- **Namespace**: All custom classes prefixed with `skylark-` or feature-based (hero-, manifesto-, etc.)

---

## External Dependencies
- **Bootstrap 5.3.0** via CDN (only CSS used, JS minimal)
- **Font Awesome 6.0.0** via CDN (icons)
- **Google Fonts**: Noto Sans TC, Noto Serif TC (loaded in CSS)
- No npm/build process - serve files directly with static server

---

## Feedback Needed
- Are the navigation links to unbuilt pages (`origin.html`, etc.) blocking any immediate work?
- Should the 8-second carousel interval be configurable, or is this a fixed design decision?
- Is there a preferred workflow for testing responsive design (live server, specific viewport sizes)?
