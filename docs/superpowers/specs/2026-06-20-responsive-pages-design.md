# Responsive Pages Optimization Design

## Goal

Optimize the existing AA Design website for tablet and mobile across all current Pages Router screens:

- Home (`/`)
- Profile (`/profile`)
- Construction listing (`/construction`)
- Construction detail (`/construction/[slug]`)
- Contact (`/contact`)

Desktop visual direction should remain essentially unchanged. The work focuses on preventing overflow, improving readability, keeping tap targets usable, and making page sections feel intentional at tablet and phone widths.

## Recommended Approach

Use scoped SCSS module updates in the existing files rather than introducing a new responsive system. The project already has page-specific SCSS modules, breakpoint rules, and clamp-based typography, so the safest path is to tune those patterns consistently.

Breakpoints:

- Tablet: up to `1024px`
- Small tablet / large mobile: up to `767px` or nearby existing breakpoints
- Mobile: up to `640px`
- Narrow mobile fixes only where needed around `480px`

## Page-Level Design

### Global and Layout

Keep the current full-width editorial layout. Add only low-risk global safeguards if needed, such as better image sizing and text wrapping, without changing the theme or desktop spacing.

### Header

Keep the sticky header and existing mobile drawer. Improve compact states so the top info bar, logo, and menu button do not crowd small widths. Ensure the mobile drawer scrolls when content exceeds viewport height and that menu text remains readable without clipping.

### Home

Tune the carousel hero height, heading scale, paragraph width, and CTA wrapping on mobile. Keep the two-column editorial design service section on desktop, but stack cleanly on tablet/mobile. Make the stats strip, service cards, and project gallery use stable tablet and mobile grids without vertical offset causing excess whitespace.

### Profile

Reduce mobile hero height and heading scale. Stack introduction, philosophy, and experience sections with comfortable spacing. Keep the visual hierarchy strong while avoiding huge headings that dominate the first viewport on phones.

### Construction Listing

Make the intro, search/filter bar, reset button, and project grid stack predictably. Inputs and selects should be full-width on mobile with usable tap targets. Remove masonry-style offsets on tablet/mobile to prevent uneven gaps.

### Construction Detail

Tune the hero, back/previous/next controls, overview facts, gallery header, slider height, thumbnails, and lightbox controls for tablet/mobile. Navigation buttons should become full-width where needed, and gallery controls should remain reachable without covering too much image content.

### Contact

Stack intro, consultation panel, detail cards, address panels, process strip, and CTA buttons. Prevent long phone/email/address values from overflowing. Preserve the premium editorial look while making contact actions easy to tap.

### Footer

Keep the two-column footer on desktop, stack on tablet/mobile, and improve map/copyright wrapping on narrow screens.

## Testing and Verification

Run project verification after implementation:

- `npm run lint`
- `npm run build`

If feasible, run the dev server and inspect at representative widths:

- `375px` mobile
- `768px` tablet
- `1024px` tablet/desktop boundary

Primary acceptance criteria:

- No horizontal overflow.
- No clipped headings, buttons, filters, or contact text.
- Mobile/tablet grids stack or wrap cleanly.
- Header drawer remains usable on short and narrow screens.
- Desktop remains visually consistent with the current site.

## Scope Boundaries

This work does not redesign brand identity, rewrite content, change routing, introduce new libraries, or rebuild the layout architecture. It is a focused responsive optimization pass over the current implementation.
