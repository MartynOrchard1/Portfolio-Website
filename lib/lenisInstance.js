'use client';

// A tiny shared handle to the single sitewide Lenis instance, set by
// <SmoothScroll> on mount. Anything that needs to sync with Lenis's scroll
// events (like the data-logger page's ScrollTrigger setup) reads it from
// here instead of threading it through React context or prop-drilling.
//
// onLenisReady exists because of React's effect ordering: SmoothScroll
// wraps page content, so a page's own effects can run *before*
// SmoothScroll's effect creates the Lenis instance. Anything that needs
// the instance should subscribe rather than assume getLenisInstance()
// is already populated.

let instance = null;
const listeners = new Set();

export function setLenisInstance(lenis) {
  instance = lenis;
  if (lenis) {
    listeners.forEach((callback) => callback(lenis));
  }
}

export function getLenisInstance() {
  return instance;
}

export function onLenisReady(callback) {
  if (instance) callback(instance);
  listeners.add(callback);
  return () => listeners.delete(callback);
}
