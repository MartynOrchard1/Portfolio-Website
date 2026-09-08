'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { setupScrollTrigger, ScrollTrigger } from '@/lib/scrollTrigger';

const stages = [
  {
    label: 'On the bike',
    items: ['OBD/CAN bus (engine + chassis data)', 'u-blox NEO-M8N GPS · 5 Hz GGA/RMC'],
  },
  {
    label: 'ESP32 logger unit',
    items: ['Reads CAN/OBD + GPS streams', 'Transmits over ESP-NOW (wireless)'],
  },
  {
    label: 'ESP32-S3 dash unit',
    items: ['Live telemetry on LCD', 'Writes session CSV to microSD'],
  },
  {
    label: 'Session CSV files',
    items: ['Pulled off the SD card after a session'],
  },
  {
    label: 'Streamlit analysis app',
    items: [
      'Lap timing & delta-time analysis',
      'Synced GPS maps + corner/sector breakdown',
      'Data-quality & malformed-row checks',
    ],
  },
  {
    label: 'Exports',
    items: ['CSV · JSON · Excel · PDF · HTML · PNG · ZIP'],
  },
];

function ArrowDown() {
  return (
    <div className="flex justify-center py-1 text-ink/30" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3v15m0 0-6-6m6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// The plain stacked list — used whenever motion is reduced, so every
// stage stays simultaneously visible and reachable with no scroll-driven
// interaction required to read it.
function StaticStack() {
  return (
    <div className="mx-auto max-w-md">
      {stages.map((stage, i) => (
        <div key={stage.label}>
          <div className="rounded-xl border border-ink/15 bg-white/70 p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-accent">{stage.label}</p>
            <ul className="mt-2 space-y-1 text-sm text-ink/75">
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {i < stages.length - 1 && <ArrowDown />}
        </div>
      ))}
    </div>
  );
}

// The pinned, sequenced version — the section holds in place while the
// user scrolls through it, and each stage highlights in turn.
function SequencedFlow() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cleanupSetup = setupScrollTrigger();
    const section = sectionRef.current;
    if (!section) return cleanupSetup;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * (stages.length * 0.7)}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
        setActiveIndex(idx);
      },
    });

    return () => {
      trigger.kill();
      cleanupSetup();
    };
  }, []);

  const stage = stages[activeIndex];

  return (
    <div ref={sectionRef}>
      {/* This pinned view only ever shows one stage at a time visually, which
          works for sighted scroll interaction but doesn't give a screen
          reader anything to read stage-by-stage the way normal scrolling
          would. The sr-only StaticStack rendered by the parent component
          carries the full content for assistive tech; this view is
          decorative/presentational on top of that. */}
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-10 sm:min-h-screen" aria-hidden="true">
        <div
          className="flex gap-2"
          role="progressbar"
          aria-label={`Data pipeline stage ${activeIndex + 1} of ${stages.length}: ${stage.label}`}
          aria-valuenow={activeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={stages.length}
        >
          {stages.map((s, i) => (
            <span
              key={s.label}
              className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                i === activeIndex ? 'bg-accent' : 'bg-ink/15'
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-md rounded-2xl border border-ink/15 bg-white/80 p-6 shadow-[0_12px_30px_-18px_rgba(11,13,18,0.35)]">
          <p className="font-mono text-xs uppercase tracking-wide text-accent">{stage.label}</p>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-ink/80">
            {stage.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="flex max-w-md flex-wrap justify-center gap-x-2 gap-y-1 text-center font-mono text-xs text-ink/40">
          {stages.map((s, i) => (
            <span key={s.label} className={i === activeIndex ? 'font-medium text-accent' : ''}>
              {s.label}
              {i < stages.length - 1 ? ' →' : ''}
            </span>
          ))}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-widest text-ink/30">Scroll to follow the data</p>
      </div>
    </div>
  );
}

export default function DataFlowDiagram() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <StaticStack />;
  }

  return (
    <>
      {/* Full content for assistive tech, kept in the DOM but visually hidden
          — see the comment in SequencedFlow above. */}
      <div className="sr-only">
        <StaticStack />
      </div>
      <SequencedFlow />
    </>
  );
}
