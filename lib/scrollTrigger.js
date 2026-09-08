'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onLenisReady } from './lenisInstance';

let registered = false;

// Called once per mount of the data-logger page (the only page that needs
// GSAP). Registers ScrollTrigger and, if Lenis is running, keeps
// ScrollTrigger's idea of scroll position in sync with Lenis's smoothed
// value instead of the raw native scroll event. If reduced motion is on,
// Lenis never starts, so this quietly falls back to ScrollTrigger reading
// native scroll directly — callers should still gate their own pin/scrub
// animations on reduced motion, since this alone doesn't disable them.
export function setupScrollTrigger() {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  // Recommended when pairing Lenis with pinned ScrollTrigger sections: it
  // unifies touch/wheel handling so pinning doesn't double-scroll on
  // trackpads/touchscreens.
  ScrollTrigger.normalizeScroll(true);

  const unsubscribeLenis = onLenisReady((lenis) => {
    lenis.on('scroll', ScrollTrigger.update);
  });

  return () => {
    unsubscribeLenis();
    ScrollTrigger.normalizeScroll(false);
  };
}

export { gsap, ScrollTrigger };
