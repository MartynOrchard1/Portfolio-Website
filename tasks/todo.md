# Todo: Portfolio Motion Upgrade

See `tasks/plan.md` for full context, architecture decisions, acceptance criteria, and verification steps per task.

## Phase 0: Housekeeping
- [x] Task 0: Persist plan into `tasks/plan.md` and this file

## Phase 1: Foundation
- [x] Task 1: Add Lenis site-wide + reduced-motion utility

### Checkpoint: Foundation
- [x] Build succeeds (`npm run build`)
- [x] Smooth scroll works on both pages; reduced-motion fallback verified
- [x] No console errors

## Phase 2: Homepage motion
- [x] Task 2: Lightweight scroll-reveal on the homepage

### Checkpoint: Homepage
- [x] Homepage builds and scrolls smoothly with staged reveals
- [x] Mobile layout unaffected
- [x] Reduced-motion fallback verified

## Phase 3: Data-logger flagship treatment
- [x] Task 3: GSAP + ScrollTrigger setup
- [x] Task 4: Pinned sequenced reveal for data-flow diagram
- [x] Task 5a: Synthetic telemetry visual (static)
- [x] Task 5b: Bind telemetry visual to scroll (scrub)

### Checkpoint: Data-logger page
- [x] Build succeeds; no console errors
- [x] Pinned diagram + telemetry hero work at desktop and mobile
- [x] Reduced-motion fallback verified for both
- [x] Screenshots compared against pre-upgrade versions — no regressions

## Phase 4: Polish & final verification
- [x] Task 6: Micro-interactions polish
- [x] Task 7: Accessibility & reduced-motion audit (added sr-only full content for the pinned diagram, aria-hidden on decorative canvases, verified keyboard tab order has no traps)
- [x] Task 8: Final build + visual verification (8-screenshot pass: 2 pages × 2 viewports × motion/reduced-motion, zero console errors, output size 1.1MB)

### Checkpoint: Ship-ready
- [x] All tasks checked off
- [x] All acceptance criteria met
- [x] Updated zip delivered to Marty
