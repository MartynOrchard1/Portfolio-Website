# Implementation Plan: Portfolio Motion Upgrade (Smooth Scroll + Sequence-Driven Animation)

## Context

Marty's portfolio site (Next.js, static-exported for GitHub Pages) already exists and works — homepage plus a `/projects/data-logger` deep-dive page for the BMW S1000RR telemetry project, built and verified earlier this session (build passes, screenshots checked on desktop and mobile).

He now wants it to feel premium/"sick" using two named references:

- **lenis.dev** — a real, well-known, MIT-style-licensed smooth-scroll library (`lenis` on npm, by darkroomengineering). Safe, standard choice — used as-is.
- **podium.global** — turns out to be a *showcase site* (a Codrops case study, "Podium: Building a Website Where Running Becomes Storytelling"), not an installable library. Its technique is Lenis + GSAP ScrollTrigger scrubbing a real photo/video frame sequence to the scroll position. As of the Webflow acquisition, GSAP and *all* its plugins including ScrollTrigger are 100% free, so this is a legitimate, standard, well-documented stack to copy the technique from — just not a package to install by that name.

He also asked to install three third-party "skill" packages via `npx skills add ...` during the design process. One (`ponytail`) was already installed. On the other three, after checking:

- `Impeccable` (pbakaus/impeccable) and `EmilKowalski/skill` are reasonably well-documented with real public track records.
- `Leonxlnx/taste-skill` has no findable reputation or track record.
- He says a "taste" skill is already installed (`/taste`); `ListPlugins` confirms a `taste-skill` plugin is enabled on the account, but none of the plausible invocation names (`taste`, `taste-skill:taste`, `taste-skill:design-taste-frontend`) worked in this session — likely a sync/naming issue, not a "no" from him. Tracked as an open question below rather than blocking this plan.

Given all that, and his answers to the clarifying questions this session, the intended outcome is: site-wide smooth scroll everywhere, lightweight scroll-reveal on the homepage, and the full "sequence-driven" treatment — pinned sections and a scroll-scrubbed hero — concentrated on the data-logger page specifically, since that's the project he wants to showcase hardest. No real bike/track photography exists yet, so the scroll-scrubbed hero is built as a synthetic telemetry visualization (canvas-drawn speed/lean/throttle traces + a track-map dot) rather than a fabricated photo sequence — structured so real footage can drop in later without touching the scroll-binding code.

## Architecture Decisions

- **Libraries:** `lenis` + `gsap` (ScrollTrigger plugin included, free) as normal npm dependencies. No build-step changes — both are client-side only and compatible with `output: 'export'`.
- **Lenis wiring:** a `'use client'` component `components/SmoothScroll.js` wraps `{children}` in `app/layout.js`, owns the Lenis instance and its RAF loop via `useEffect`.
- **Lenis + ScrollTrigger pairing:** the standard documented pattern — `lenis.on('scroll', ScrollTrigger.update)` and drive Lenis's `raf` off `gsap.ticker` instead of `requestAnimationFrame` directly, so both stay in sync.
- **Reduced motion is load-bearing, not optional:** a shared `lib/useReducedMotion.js` hook (checks `prefers-reduced-motion`) is built in Task 1 and consumed everywhere else — when it's set, Lenis smoothing is skipped entirely (native scroll) and GSAP scrub/pin animations degrade to simple instant/opacity-only states. Every later task consumes this rather than adding its own check.
- **SSR safety:** GSAP touches `window` at import time, so `gsap.registerPlugin(ScrollTrigger)` and any Lenis/GSAP usage only ever happens inside client components' `useEffect`/event handlers — never at module top level in a server-rendered path.
- **Homepage stays light:** homepage scroll-reveal uses a small IntersectionObserver-based `ScrollReveal` wrapper — no GSAP needed for a simple fade/slide-up, keeping the homepage's JS payload small. GSAP/ScrollTrigger is only pulled into the data-logger page's client bundle.
- **Synthetic telemetry data:** generated client-side (sine-wave-ish speed/lean/throttle curves + a simple closed-loop track path), clearly captioned on-page as a simulated preview — consistent with the project's own "prototype" framing — and isolated in one data-generator function so it's a one-line swap for real logged CSV data later.
- **Scope boundary:** homepage + other project cards get Lenis and light reveals only; pinned sections and scroll-scrubbing are confined to `/projects/data-logger`, per his explicit answer.

## Task List

### Phase 0: Housekeeping

- [ ] **Task 0: Persist this plan into the project**
  - Description: Copy this plan into `tasks/plan.md` and record the task list below into `tasks/todo.md` inside `marty-portfolio/`, per the planning-and-task-breakdown skill's convention, so it survives outside plan mode.
  - Acceptance criteria: `marty-portfolio/tasks/plan.md` and `marty-portfolio/tasks/todo.md` exist and match this plan.
  - Verification: files present, no existing conflicting plan was overwritten (confirmed clean — checked at plan start).
  - Dependencies: None.

### Phase 1: Foundation — smooth scroll + shared motion utilities

- [ ] **Task 1: Add Lenis site-wide + reduced-motion utility**
  - Description: Install `lenis`, add `components/SmoothScroll.js` wrapping `app/layout.js`, and `lib/useReducedMotion.js`. When reduced motion is requested, Lenis is not instantiated at all (native scroll).
  - Acceptance criteria: scrolling the homepage and data-logger page feels smoothed (eased momentum) with the OS motion setting at default; with "reduce motion" enabled in the OS, scroll behaves natively with no smoothing.
  - Verification: `npm run build` succeeds (static export unaffected); manual check in both a normal browser profile and one with reduced-motion emulated (Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce").
  - Dependencies: None.
  - Files: `package.json`, `components/SmoothScroll.js` (new), `lib/useReducedMotion.js` (new), `app/layout.js`.
  - Estimated scope: Small (3 files).

### Checkpoint: Foundation
- [ ] Build succeeds (`npm run build`)
- [ ] Smooth scroll works on both existing pages; reduced-motion fallback verified
- [ ] No console errors

### Phase 2: Homepage motion

- [ ] **Task 2: Lightweight scroll-reveal on the homepage**
  - Description: Add `components/ScrollReveal.js` (IntersectionObserver fade/slide-up, respects the Task 1 reduced-motion hook) and wrap the hero, featured-project card, each "more projects" card, and the about/skills section.
  - Acceptance criteria: sections animate in once as they enter the viewport (no re-trigger on scroll-up/down thrash); nothing shifts layout (`content-visibility`/CLS-safe); reduced-motion users see content appear immediately, no animation.
  - Verification: `npm run build`; manual scroll-through on desktop (1280px) and mobile (390px) viewport via Playwright screenshot, same as the earlier verification pass; reduced-motion check.
  - Dependencies: Task 1.
  - Files: `components/ScrollReveal.js` (new), `app/page.js`.
  - Estimated scope: Small–Medium (2 files).

### Checkpoint: Homepage
- [ ] Homepage builds and scrolls smoothly with staged reveals
- [ ] Mobile layout unaffected (compare against pre-existing mobile screenshot)
- [ ] Reduced-motion fallback verified

### Phase 3: Data-logger flagship treatment

- [ ] **Task 3: GSAP + ScrollTrigger setup for the data-logger page**
  - Description: Install `gsap`; add a small `lib/scrollTrigger.js` helper that registers the plugin once and wires it to the Lenis instance from Task 1 (`lenis.on('scroll', ScrollTrigger.update)`, ticker sync). Client-only, dynamically imported on the data-logger page.
  - Acceptance criteria: ScrollTrigger instances update correctly while Lenis is scrolling (no lag/desync between visual scroll position and pinned/scrubbed elements).
  - Verification: `npm run build`; manual scroll test on the data-logger page confirming a simple test ScrollTrigger (e.g. a temporary background-color scrub) tracks scroll position 1:1 before building the real animations on top.
  - Dependencies: Task 1.
  - Files: `package.json`, `lib/scrollTrigger.js` (new).
  - Estimated scope: Small (2 files).

- [ ] **Task 4: Pinned, sequenced reveal for "How data moves through the system"**
  - Description: Rework `DataFlowDiagram` so, on the data-logger page only, the section pins in place while each of the six stages highlights/animates in sequence as the user scrolls through it (GSAP timeline scrubbed to scroll position via the Task 3 helper). Reduced-motion users get the existing static stacked list with no pin.
  - Acceptance criteria: all six stages are reachable and legible while pinned; releases cleanly back into normal scroll after the last stage; reduced-motion fallback matches current (Task-1-era) static rendering exactly.
  - Verification: `npm run build`; Playwright screenshots at 3-4 scroll positions through the pinned section (desktop + mobile) to confirm each stage highlights correctly; reduced-motion check.
  - Dependencies: Task 3.
  - Files: `components/DataFlowDiagram.js`, `app/projects/data-logger/page.js`.
  - Estimated scope: Medium (2 files, most complexity in one component).

- [ ] **Task 5a: Synthetic telemetry visual (static, no scroll binding)**
  - Description: New `components/TelemetryScrub.js` — a canvas drawing a simulated speed/lean-angle/throttle trace plus a dot moving along a simple closed-loop track outline, generated client-side (not real logger data). On-page caption makes clear it's a simulated preview. No scroll binding yet — renders as a self-playing or static frame first, to validate the visual before wiring it to scroll.
  - Acceptance criteria: renders correctly at desktop and mobile widths; caption clearly frames it as simulated; no layout shift; canvas cleans up its RAF/listeners on unmount.
  - Verification: `npm run build`; visual check via Playwright screenshot on both pages/viewports.
  - Dependencies: None (parallel-safe with Task 3/4).
  - Files: `components/TelemetryScrub.js` (new).
  - Estimated scope: Medium (1 file, non-trivial canvas logic).

- [ ] **Task 5b: Bind the telemetry visual to scroll (scrub)**
  - Description: Use the Task 3 ScrollTrigger helper to scrub the Task 5a canvas's animation progress to scroll position through the hero section, mirroring the podium.global-style effect. Reduced-motion users get a static end-state frame instead of a scrubbed animation.
  - Acceptance criteria: canvas frame position tracks scroll position smoothly through the hero with no jank; reduced-motion fallback shows a single static frame; no SSR/hydration errors.
  - Verification: `npm run build`; manual scroll-through + Playwright screenshots at multiple scroll depths; reduced-motion check; check browser console for errors on load.
  - Dependencies: Task 3, Task 5a.
  - Files: `components/TelemetryScrub.js`, `app/projects/data-logger/page.js`.
  - Estimated scope: Small–Medium (2 files).

### Checkpoint: Data-logger page
- [ ] Build succeeds; page loads with no console errors
- [ ] Pinned diagram section and telemetry-scrub hero both work at desktop (1280px) and mobile (390px)
- [ ] Reduced-motion fallback verified for both new interactions
- [ ] Screenshots compared side-by-side with the pre-upgrade versions to confirm nothing regressed (content, links, other sections)

### Phase 4: Polish & final verification

- [ ] **Task 6: Micro-interactions polish**
  - Description: Small hover/transition polish on header nav, footer links, and project cards (already mostly present from the initial build) — tighten easing/timing to match the new motion language introduced in Phases 1-3, using CSS transitions (no GSAP needed here).
  - Acceptance criteria: hover states feel consistent in timing/easing across header, footer, and cards.
  - Verification: manual pass, visual only.
  - Dependencies: Tasks 1-2.
  - Files: `components/Header.js`, `components/Footer.js`, `components/ProjectCard.js`.
  - Estimated scope: Small (3 files, small diffs).

- [ ] **Task 7: Accessibility & reduced-motion audit**
  - Description: Full pass against the frontend-ui-engineering checklist — keyboard-only scroll/tab through both pages with the new motion active, verify no content becomes unreachable when pinned/scrubbed, verify focus order isn't disrupted by Lenis, confirm reduced-motion fully disables all new motion (not just dampens it).
  - Acceptance criteria: all interactive elements reachable via keyboard on both pages; no focus traps introduced by pinning; reduced-motion produces a fully static-but-complete experience.
  - Verification: manual keyboard-only pass (Tab/Shift+Tab through both pages); reduced-motion emulation re-check across all of Phases 1-3's additions in one pass.
  - Dependencies: Tasks 1-6.
  - Files: likely small fixes across files touched above, no new files anticipated.
  - Estimated scope: Small–Medium (audit + fixes).

- [ ] **Task 8: Final build + visual verification**
  - Description: `npm run build` (static export), full Playwright screenshot pass (home + data-logger, desktop + mobile, normal + reduced-motion = 8 screenshots), confirm the existing GitHub Pages Actions workflow still builds this correctly (no config changes needed since everything is client-side).
  - Acceptance criteria: all 8 screenshots look correct with no regressions vs. the original delivered version's content; build output size is reasonable (spot-check `out/` size didn't balloon unreasonably from adding GSAP).
  - Verification: `npm run build`; Playwright screenshot script; `du -sh out`.
  - Dependencies: Tasks 1-7.
  - Files: none (verification only).
  - Estimated scope: Small.

### Checkpoint: Ship-ready
- [ ] All 8 tasks checked off
- [ ] All acceptance criteria met
- [ ] Updated zip delivered to Marty via SendUserFile, same as the original delivery

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Scroll-hijacking libraries feel janky on lower-end devices, or bloat the bundle | Medium | GSAP/Lenis scoped to two small components; telemetry canvas is its own isolated component; check bundle size at the final checkpoint |
| Pinned/scrubbed sections cause motion discomfort or break for reduced-motion users | High (accessibility) | Reduced-motion utility built in Task 1 and consumed by every later task, not bolted on at the end; Task 7 is a dedicated audit |
| GSAP/ScrollTrigger touching `window` during static export/SSR | Medium | All usage confined to `'use client'` components, registered inside `useEffect`, never at module top level |
| Synthetic telemetry visual reads as fake/gimmicky | Low | Caption it plainly as a simulated preview, consistent with the project's own "prototype" status copy already on the page |
| `taste-skill` plugin unusable in this session despite showing enabled | Low | Proceed without it (see Open Questions); doesn't block any task above |

## Open Questions

1. ~~`taste-skill` invocation~~ — Resolved: Marty confirmed the exact name (`/taste-skill:taste-skill`), but it still returns "Unknown skill" in this session even after `RefreshMcpTools`, despite `ListPlugins` showing it enabled on the account. This looks like a session-level sync gap outside my control (possibly needs a fresh session to pick up), not a naming mistake. Proceeding without it per the original recommendation — own design judgment plus the already-loaded `frontend-ui-engineering` skill. Worth trying again in a future session if he wants a second opinion once the sync catches up.
2. Any chance of getting real photos or video from the bike/a track day in the next few weeks? Task 5's synthetic generator is isolated specifically so real frames can replace it later without redoing the scroll-binding work in Task 5b — worth doing eventually, not blocking now.
