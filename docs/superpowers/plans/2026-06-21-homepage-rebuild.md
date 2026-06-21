# Homepage Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage into a lead-generation landing page ordered around proof, project-based positioning, services, process, trust, FAQ, and consultation form.

**Architecture:** Replace the current three-section homepage with one focused `HomepageLandingComponent` fed by localized copy and existing project data. Keep project advertising grounded in `static-content.json` and `localizedProject.ts`; do not invent dimensions because the project data has no area field.

**Tech Stack:** Next.js pages router, React, `next/image`, `next/link`, `react-i18next`, SCSS modules, existing static JSON project data.

---

### Task 1: Structure Check

**Files:**

- Create: `scripts/check-homepage-rebuild.mjs`

- [ ] **Step 1: Write the failing check**

Create a Node script that reads `src/pages/index.tsx`, `src/component-page/home/homepage-landing.tsx`, `src/styles/home-page.module.scss`, and locale JSON files. It should assert:

- `index.tsx` renders `HomepageLandingComponent`.
- The homepage component renders section ids in this order: `hero`, `what-we-do`, `who-we-serve`, `regions`, `quick-proof`, `primary-cta`, `social-proof`, `experience`, `project-types`, `featured-images`, `need-services`, `featured-projects`, `process`, `why-aa-design`, `founder`, `reviews`, `faq`, `consultation-form`.
- The component references `getLocalizedProjects`, `staticContent.projects`, and a `featuredProjectIds` list with at least six ids.
- The component avoids fake area fields by using localized project scope labels.
- Both locale files include `home.landing`.

- [ ] **Step 2: Run check to verify it fails**

Run: `node .\scripts\check-homepage-rebuild.mjs`

Expected: FAIL because `src/component-page/home/homepage-landing.tsx` does not exist yet.

### Task 2: Homepage Component

**Files:**

- Create: `src/component-page/home/homepage-landing.tsx`
- Modify: `src/pages/index.tsx`

- [ ] **Step 1: Implement `HomepageLandingComponent`**

Create a focused component that:

- Uses `useTranslation` and `useRouter`.
- Reads project data from `staticContent.projects`.
- Localizes projects via `getLocalizedProjects`.
- Builds a 6-8 item featured project grid from real ids.
- Uses `thumbnailMain`, then `thumbnail`, then first `images` item for project imagery.
- Links project cards to `/construction/[id]`.
- Uses `mailto:` for the consultation form fallback.

- [ ] **Step 2: Update `index.tsx`**

Remove the dynamic old section map and render:

- `SEOHeaderComponent`
- `HomepageLandingComponent`

### Task 3: Localized Content

**Files:**

- Modify: `src/locales/vi/common.json`
- Modify: `src/locales/en/common.json`

- [ ] **Step 1: Add `home.landing` copy**

Add matching EN/VI keys for hero, what-we-do, who-we-serve, regions, proof, CTAs, social proof, experience, project types, featured images, need services, featured projects, process, reasons, founder, reviews, FAQ, and consultation form.

- [ ] **Step 2: Keep advertising project-based**

Use copy referencing project categories and examples present in data: villas, premium apartments, offices, hospitality/resorts, turnkey construction, Hanoi and surrounding provinces.

### Task 4: Styling

**Files:**

- Modify: `src/styles/home-page.module.scss`

- [ ] **Step 1: Replace old homepage styles**

Define styles for the new section set with responsive grids, project cards, form fields, CTA rows, and image compositions.

- [ ] **Step 2: Verify mobile/tablet behavior**

Use clamp, grid breakpoints, and single-column mobile layouts to avoid overflow.

### Task 5: Verification

**Files:**

- Read: `scripts/check-homepage-rebuild.mjs`
- Read: `scripts/check-i18n.mjs`

- [ ] **Step 1: Run homepage check**

Run: `node .\scripts\check-homepage-rebuild.mjs`

Expected: `Homepage rebuild checks passed.`

- [ ] **Step 2: Run i18n check**

Run: `node .\scripts\check-i18n.mjs`

Expected: `i18n consistency check passed.`

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: no ESLint warnings or errors.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: successful Next.js production build.
