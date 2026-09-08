'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { setLenisInstance } from '@/lib/lenisInstance';

// Wraps the whole site. When the visitor hasn't asked for reduced motion,
// it hands scrolling over to Lenis for eased momentum; when they have, it
// does nothing at all and the browser's native scroll behaviour is used.
export default function SmoothScroll({ children }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setLenisInstance(null);
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    setLenisInstance(lenis);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  return children;
}
