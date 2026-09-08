'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Every scroll/motion feature in this project reads this instead of
// checking prefers-reduced-motion itself, so there's exactly one place
// that decides "should this page move".
export function useReducedMotion() {
  // Default to true (motion off) until we've checked the browser, so
  // the very first paint never assumes motion is safe.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event) => setReduced(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
