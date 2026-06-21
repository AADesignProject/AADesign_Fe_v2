# Responsive Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize all current AA Design pages for tablet and mobile while preserving the existing desktop visual direction.

**Architecture:** Keep the current Pages Router and SCSS module structure. Apply targeted responsive rules to the existing page/component styles instead of adding a new layout framework or refactoring components.

**Tech Stack:** Next.js 14 Pages Router, React 18, SCSS modules, Swiper, Framer Motion, next/image.

---

## File Structure

- Modify `src/styles/globals.scss`: low-risk responsive safeguards for media and text overflow.
- Modify `src/styles/header.module.scss`: tablet/mobile header, top info bar, and drawer scrolling behavior.
- Modify `src/styles/carousel.module.scss`: responsive hero height, heading scale, content position, and CTA wrapping.
- Modify `src/styles/home-page.module.scss`: home sections, stats strip, service grid, and project gallery breakpoints.
- Modify `src/styles/profile.module.scss`: profile hero, introduction, philosophy, experience, and quote mobile rhythm.
- Modify `src/styles/construction-page.module.scss`: listing intro, filter bar, selects, reset button, and project grid.
- Modify `src/styles/construction-detail.module.scss`: detail hero, nav buttons, overview, gallery, thumbnails, and lightbox controls.
- Modify `src/styles/contact-page.module.scss`: contact intro, consultation content, contact details, CTA buttons, and process strip.
- Modify `src/styles/footer.module.scss`: footer stack, map sizing, copyright wrapping.
- Run verification with `npm run lint` and `npm run build`.

## Task 1: Baseline Responsive Safeguards

**Files:**

- Modify: `src/styles/globals.scss`

- [ ] **Step 1: Add global media and text safeguards**

Update `src/styles/globals.scss` by extending the existing `img` rule and adding text wrapping for common long content. Use this exact block near the existing `img` rule:

```scss
img,
svg,
video,
canvas {
  max-width: 100%;
}

p,
span,
a,
dd,
dt,
li {
  overflow-wrap: anywhere;
}
```

Keep the existing `img { -webkit-user-drag: none; }` behavior by merging it into the new `img` block:

```scss
img {
  -webkit-user-drag: none;
}
```

- [ ] **Step 2: Verify no global syntax errors**

Run:

```bash
npm run lint
```

Expected: lint completes or reports only pre-existing project lint configuration issues. If SCSS syntax is invalid, Next lint/build will surface it in later tasks.

- [ ] **Step 3: Commit baseline safeguards**

Run:

```bash
git -c safe.directory=D:/AADesign_Fe_v2 add src/styles/globals.scss
git -c safe.directory=D:/AADesign_Fe_v2 commit -m "style: add responsive content safeguards"
```

## Task 2: Header and Homepage Responsive Pass

**Files:**

- Modify: `src/styles/header.module.scss`
- Modify: `src/styles/carousel.module.scss`
- Modify: `src/styles/home-page.module.scss`

- [ ] **Step 1: Improve header compact states**

In `src/styles/header.module.scss`, update mobile rules so the top bar can wrap and the drawer can scroll. Add or adjust these rules:

```scss
@media (max-width: 1024px) {
  .headerContainerBottom {
    .containerContent {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
    }
  }
}

@media (max-width: 767px) {
  .headerContainerTop {
    .containerOption {
      min-height: auto;
      padding: 6px 16px;

      .wrapperInfo {
        gap: 6px 14px;

        .contentLink {
          min-height: 28px;
          font-size: 9px;
          line-height: 1.35;
          text-align: center;
        }
      }
    }
  }

  .headerContainerBottom {
    .containerContent {
      padding: 12px 16px;

      .logo {
        min-width: 0;
        font-size: clamp(22px, 7vw, 25px);
      }

      .menuIconButton {
        width: 44px;
        height: 44px;
      }
    }
  }

  .mobileMenu {
    overflow-y: auto;
    min-height: 100dvh;

    .mobileMenuHeader {
      padding: 16px;
    }

    .mobileMenuContent {
      padding: 22px 16px;
    }

    .mobileMenuItem {
      min-height: 56px;
      font-size: clamp(30px, 10vw, 46px);
      line-height: 1;
    }

    .mobileLanguage,
    .mobileMenuFooter {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}
```

- [ ] **Step 2: Tune carousel hero for tablet and mobile**

In `src/styles/carousel.module.scss`, add a tablet breakpoint before the existing `767px` block:

```scss
@media (max-width: 1024px) {
  .slide {
    height: clamp(600px, 78vh, 780px);
  }

  .content {
    bottom: clamp(68px, 10vh, 112px);
    width: min(680px, calc(100vw - 40px));

    h1,
    h2 {
      font-size: clamp(50px, 9vw, 88px);
      line-height: 0.95;
    }
  }
}
```

Then adjust the existing `@media (max-width: 767px)` block:

```scss
@media (max-width: 767px) {
  .slide {
    height: clamp(520px, 76vh, 660px);
  }

  .content {
    left: 16px;
    right: 16px;
    bottom: 42px;

    h1,
    h2 {
      font-size: clamp(36px, 11vw, 56px);
      line-height: 0.98;
      letter-spacing: -0.04em;
    }

    p {
      max-width: 100%;
      margin-top: 18px;
      font-size: 14px;
      line-height: 1.7;
    }
  }

  .actions {
    gap: 10px;

    a {
      flex: 1 1 160px;
      min-height: 48px;
      padding: 0 16px;
      font-size: 11px;
      text-align: center;
    }
  }
}
```

- [ ] **Step 3: Tune home section breakpoints**

In `src/styles/home-page.module.scss`, extend the existing `1024px` and `767px` blocks with these rules:

```scss
@media (max-width: 1024px) {
  .wrapperHomePage {
    .designService {
      padding-top: 76px;
      padding-bottom: 86px;

      .textContent {
        .subTitle {
          max-width: 860px;
          font-size: clamp(42px, 8vw, 72px);
          line-height: 0.98;
        }
      }
    }

    .ourService {
      .serviceWrapper {
        .serviceBox {
          min-height: 300px;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .wrapperHomePage {
    .designService,
    .ourService,
    .ourProject {
      padding-left: 16px;
      padding-right: 16px;
    }

    .designService {
      padding-top: 62px;
      padding-bottom: 68px;

      .textContent {
        .title {
          margin-bottom: 14px;
          font-size: 11px;
        }

        .subTitle {
          font-size: clamp(34px, 10vw, 48px);
          line-height: 1;
        }

        .descriptionTitle {
          margin-top: 22px;
          font-size: 17px;
        }

        .description {
          font-size: 15px;
          line-height: 1.78;
        }
      }

      .imageContent {
        gap: 10px;

        .listImageLeft,
        .listImageRight {
          gap: 10px;
        }

        .listImageLeft {
          transform: translateY(18px);
        }
      }
    }

    .ourService {
      padding-top: 66px;
      padding-bottom: 72px;

      .title2 {
        font-size: clamp(34px, 11vw, 50px);
        line-height: 1;
      }

      .description {
        font-size: 15px;
        line-height: 1.7;
      }
    }

    .ourProject {
      padding-top: 66px;
      padding-bottom: 72px;

      .wrapperProject {
        .title2 {
          font-size: clamp(40px, 13vw, 58px);
          line-height: 0.98;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .wrapperHomePage {
    .designService {
      .textContent {
        .containerNumberInfo {
          margin-top: 32px;

          .boxContent {
            min-height: 108px;
            padding: 18px;
          }
        }
      }
    }

    .ourProject {
      .wrapperProject {
        .projectGallery {
          gap: 14px;

          .imageWrapper {
            aspect-ratio: 4 / 5;
          }
        }
      }
    }
  }
}
```

- [ ] **Step 4: Verify header and home compile**

Run:

```bash
npm run build
```

Expected: build completes successfully. If it fails on SCSS syntax, fix the exact selector or brace reported by the compiler.

- [ ] **Step 5: Commit header and home responsive changes**

Run:

```bash
git -c safe.directory=D:/AADesign_Fe_v2 add src/styles/header.module.scss src/styles/carousel.module.scss src/styles/home-page.module.scss
git -c safe.directory=D:/AADesign_Fe_v2 commit -m "style: improve responsive header and home"
```

## Task 3: Profile and Construction Detail Responsive Pass

**Files:**

- Modify: `src/styles/profile.module.scss`
- Modify: `src/styles/construction-detail.module.scss`

- [ ] **Step 1: Tune profile page responsive rhythm**

In `src/styles/profile.module.scss`, extend existing breakpoints:

```scss
@media (max-width: 900px) {
  .hero {
    min-height: clamp(500px, 68vh, 680px);

    .heroContent {
      h1 {
        font-size: clamp(52px, 12vw, 92px);
        line-height: 0.94;
      }
    }
  }

  .introduction,
  .philosophy,
  .experience,
  .quoteSection {
    padding-top: 72px;
    padding-bottom: 78px;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 520px;
    padding: 0 16px 44px;

    .heroContent {
      span {
        margin-bottom: 16px;
        font-size: 11px;
      }

      h1 {
        font-size: clamp(42px, 14vw, 64px);
        line-height: 0.98;
        letter-spacing: -0.045em;
      }

      h2 {
        margin-top: 18px;
        font-size: 16px;
        line-height: 1.55;
      }
    }
  }

  .introduction {
    width: calc(100% - 32px);
    padding-top: 58px;
    padding-bottom: 64px;

    .textSection {
      h3 {
        font-size: clamp(34px, 11vw, 50px);
        line-height: 1;
      }

      p {
        font-size: 15px;
        line-height: 1.78;
      }
    }
  }

  .philosophy,
  .experience,
  .quoteSection {
    padding: 60px 16px;
  }

  .quoteSection {
    p {
      padding-left: 20px;
      font-size: clamp(30px, 10vw, 46px);
      line-height: 1.12;
    }
  }
}
```

- [ ] **Step 2: Tune construction detail controls and gallery**

In `src/styles/construction-detail.module.scss`, extend existing breakpoints:

```scss
@media (max-width: 900px) {
  .hero {
    min-height: clamp(560px, 74vh, 740px);

    h1 {
      font-size: clamp(48px, 10vw, 86px);
      line-height: 0.96;
    }
  }

  .heroActions {
    gap: 18px;
  }

  .overviewSection,
  .galleryHeader {
    gap: 28px;
  }

  .sliderContainer {
    .mainSwiper {
      height: clamp(360px, 68vw, 620px);
    }
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 540px;
    padding: 0 16px 38px;

    h1 {
      font-size: clamp(38px, 12vw, 56px);
      line-height: 1;
      letter-spacing: -0.04em;
    }

    p {
      margin-top: 18px;
      font-size: 11px;
      line-height: 1.6;
    }
  }

  .backButton,
  .navButton {
    min-height: 54px;
  }

  .overviewSection {
    width: calc(100% - 32px);
    padding-top: 58px;
    padding-bottom: 64px;
  }

  .overviewCopy {
    h2 {
      font-size: clamp(34px, 11vw, 50px);
      line-height: 1;
    }

    p {
      font-size: 15px;
      line-height: 1.78;
    }
  }

  .galleryHeader {
    h2 {
      font-size: clamp(34px, 11vw, 50px);
      line-height: 1;
    }
  }

  .sliderContainer {
    .mainSwiper {
      height: clamp(300px, 82vw, 460px);

      :global(.swiper-button-next),
      :global(.swiper-button-prev) {
        width: 42px;
        height: 42px;
      }
    }
  }

  .lightboxImage {
    width: 100%;
    height: min(76vh, 620px);
  }

  .lightboxClose,
  .lightboxNavLeft,
  .lightboxNavRight {
    width: 42px;
    height: 42px;
  }
}
```

- [ ] **Step 3: Verify profile and detail compile**

Run:

```bash
npm run build
```

Expected: build completes successfully.

- [ ] **Step 4: Commit profile and detail responsive changes**

Run:

```bash
git -c safe.directory=D:/AADesign_Fe_v2 add src/styles/profile.module.scss src/styles/construction-detail.module.scss
git -c safe.directory=D:/AADesign_Fe_v2 commit -m "style: tune profile and project detail responsive layouts"
```

## Task 4: Construction Listing, Contact, and Footer Responsive Pass

**Files:**

- Modify: `src/styles/construction-page.module.scss`
- Modify: `src/styles/contact-page.module.scss`
- Modify: `src/styles/footer.module.scss`

- [ ] **Step 1: Tune construction listing filters and grid**

In `src/styles/construction-page.module.scss`, extend existing breakpoints:

```scss
@media (max-width: 1024px) {
  .wrapperConstructionPage {
    .containerConstructionPage {
      padding-top: 72px;
      padding-bottom: 84px;
    }

    .filterBar {
      gap: 16px;

      .resetButton {
        width: 100%;
      }
    }
  }
}

@media (max-width: 700px) {
  .wrapperConstructionPage {
    .containerConstructionPage {
      padding: 58px 16px 68px;
    }

    .pageIntro {
      gap: 18px;
      margin-bottom: 34px;

      p {
        font-size: 15px;
        line-height: 1.75;
      }
    }

    .filterBar {
      margin-bottom: 34px;
      padding: 14px 0;

      .searchBox {
        input {
          min-height: 48px;
          font-size: 14px;
        }
      }

      .resetButton {
        min-height: 48px;
      }
    }

    .selectValue,
    .selectPlaceholder {
      min-height: 48px;
    }

    .wrapperCardConstruction {
      gap: 14px;

      .imageWrapper {
        aspect-ratio: 4 / 5;

        .overlay {
          padding: 18px;
        }

        .name {
          font-size: clamp(26px, 9vw, 38px);
          line-height: 1.02;
        }
      }
    }
  }
}
```

- [ ] **Step 2: Tune contact page stacking and long text**

In `src/styles/contact-page.module.scss`, extend existing breakpoints:

```scss
@media (max-width: 980px) {
  .wrapperContactPage {
    .containerContactPage {
      padding-top: 72px;
      padding-bottom: 84px;
    }
  }

  .wrapperContent {
    border-left: 0;
  }

  .consultationPanel,
  .boxContent {
    border-left: 1px solid $border-color;
  }
}

@media (max-width: 640px) {
  .wrapperContactPage {
    .containerContactPage {
      padding: 58px 16px 68px;
    }
  }

  .pageIntro {
    gap: 20px;
    margin-bottom: 34px;

    p {
      font-size: 15px;
      line-height: 1.75;
    }
  }

  .consultationPanel {
    padding: 24px 18px;

    h2 {
      font-size: clamp(32px, 10vw, 48px);
      line-height: 1;
    }

    > p {
      margin-top: 20px;
      font-size: 16px;
      line-height: 1.72;
    }
  }

  .contactActions {
    gap: 10px;

    a {
      min-height: 50px;
      padding: 0 16px;
      text-align: center;
    }
  }

  .contactDetails {
    div {
      min-height: 120px;
      padding: 20px 18px;
    }

    dt {
      margin-bottom: 14px;
    }

    dd {
      font-size: clamp(20px, 8vw, 28px);
    }
  }

  .processStrip {
    margin-top: 32px;

    div {
      min-height: 104px;
      padding: 18px;
    }
  }
}
```

- [ ] **Step 3: Tune footer mobile layout**

In `src/styles/footer.module.scss`, extend existing breakpoints:

```scss
@media (max-width: 860px) {
  .containerContent {
    gap: 34px;
  }

  .columnRight {
    padding-top: 0;
  }
}

@media (max-width: 640px) {
  .brandColumn {
    .footerLogo {
      font-size: clamp(46px, 15vw, 72px);
      line-height: 0.94;
    }

    p {
      margin-top: 22px;
      font-size: 15px;
      line-height: 1.75;
    }
  }

  .footerNav {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .mapContainer {
    iframe {
      width: 100%;
      height: 210px;
    }
  }

  .containerCopyright {
    flex-direction: column;
    gap: 8px;

    p {
      line-height: 1.5;
    }
  }
}
```

- [ ] **Step 4: Verify listing/contact/footer compile**

Run:

```bash
npm run build
```

Expected: build completes successfully.

- [ ] **Step 5: Commit listing/contact/footer responsive changes**

Run:

```bash
git -c safe.directory=D:/AADesign_Fe_v2 add src/styles/construction-page.module.scss src/styles/contact-page.module.scss src/styles/footer.module.scss
git -c safe.directory=D:/AADesign_Fe_v2 commit -m "style: improve responsive listing contact and footer"
```

## Task 5: Final Verification and Browser Inspection

**Files:**

- Verify all modified SCSS files.

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: command passes. If it fails because `next lint` is unavailable for the installed Next.js version, record the exact failure and rely on `npm run build` for compilation.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: build passes and static pages compile.

- [ ] **Step 3: Start dev server for visual inspection**

Run:

```bash
npm run dev
```

Expected: Next dev server starts at `http://localhost:3000` or another available port.

- [ ] **Step 4: Inspect responsive pages**

Open these pages at `375px`, `768px`, and `1024px` widths:

```text
/
/profile
/construction
/construction/[first-valid-project-slug]
/contact
```

Expected:

- No horizontal page scrolling.
- Header top bar and mobile drawer remain usable.
- Hero text is readable and not clipped.
- Project grids are two columns on tablet and one column on mobile.
- Filters, selects, contact CTA buttons, and footer map are full-width where needed.
- Lightbox and carousel controls remain reachable on phone widths.

- [ ] **Step 5: Commit any final responsive fixes**

If inspection finds small issues, fix the affected SCSS module and commit only those files:

```bash
git -c safe.directory=D:/AADesign_Fe_v2 add src/styles/<affected-file>.scss
git -c safe.directory=D:/AADesign_Fe_v2 commit -m "style: polish responsive page edges"
```

## Self-Review

- Spec coverage: Tasks cover global safeguards, header, home, profile, construction listing, construction detail, contact, footer, and final verification.
- Placeholder scan: The plan contains concrete file paths, code blocks, commands, and expected outcomes.
- Scope control: The plan does not introduce new routes, libraries, content rewrites, or desktop redesign work.
