'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { setupScrollTrigger, ScrollTrigger } from '@/lib/scrollTrigger';

// ---------------------------------------------------------------------
// Synthetic data. This is NOT real logger output — it's a generated
// stand-in shaped like the real thing (speed/lean/throttle vs. a lap
// fraction, plus a closed-loop track outline) so the hero has something
// to scrub through before real session data exists. Swapping in a real
// logged CSV later only means replacing this block — trackPoint() and
// sampleCurve() below don't care where the numbers came from.
// ---------------------------------------------------------------------

const TRACK_POINTS = [
  [15, 15], [50, 8], [85, 15], [95, 35], [95, 65], [85, 85],
  [65, 75], [55, 85], [45, 75], [35, 85],
  [15, 85], [5, 65], [5, 35],
];

const SPEED_KEYFRAMES = [
  { t: 0, v: 70 }, { t: 0.08, v: 190 }, { t: 0.22, v: 235 }, { t: 0.3, v: 95 },
  { t: 0.34, v: 70 }, { t: 0.45, v: 200 }, { t: 0.55, v: 248 }, { t: 0.62, v: 105 },
  { t: 0.68, v: 75 }, { t: 0.8, v: 215 }, { t: 0.92, v: 232 }, { t: 1, v: 70 },
];

const LEAN_KEYFRAMES = [
  { t: 0, v: 3 }, { t: 0.1, v: 8 }, { t: 0.28, v: 44 }, { t: 0.33, v: 38 },
  { t: 0.5, v: 5 }, { t: 0.6, v: 47 }, { t: 0.66, v: 41 }, { t: 0.75, v: 7 },
  { t: 0.9, v: 32 }, { t: 1, v: 3 },
];

const THROTTLE_KEYFRAMES = [
  { t: 0, v: 45 }, { t: 0.06, v: 100 }, { t: 0.2, v: 100 }, { t: 0.28, v: 20 },
  { t: 0.32, v: 0 }, { t: 0.4, v: 90 }, { t: 0.5, v: 100 }, { t: 0.6, v: 15 },
  { t: 0.65, v: 0 }, { t: 0.78, v: 95 }, { t: 0.9, v: 100 }, { t: 1, v: 45 },
];

function sampleCurve(t, keyframes) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const localT = (clamped - a.t) / (b.t - a.t || 1);
      return a.v + (b.v - a.v) * localT;
    }
  }
  return keyframes[keyframes.length - 1].v;
}

function trackPoint(t) {
  const n = TRACK_POINTS.length;
  const pos = (((t % 1) + 1) % 1) * n;
  const i0 = Math.floor(pos) % n;
  const i1 = (i0 + 1) % n;
  const localT = pos - Math.floor(pos);
  const p0 = TRACK_POINTS[i0];
  const p1 = TRACK_POINTS[i1];
  return [p0[0] + (p1[0] - p0[0]) * localT, p0[1] + (p1[1] - p0[1]) * localT];
}

function drawSmoothClosedPath(ctx, pts) {
  const n = pts.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[n - 1], pts[0]);
  ctx.beginPath();
  ctx.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) {
    const next = pts[(i + 1) % n];
    const m1 = mid(pts[i], next);
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], m1[0], m1[1]);
  }
  ctx.closePath();
}

function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { width: rect.width, height: rect.height, dpr };
}

function drawTrack(canvas, progress) {
  const ctx = canvas.getContext('2d');
  const { width, height, dpr } = fitCanvas(canvas);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const pad = width * 0.08;
  const size = Math.min(width, height) - pad * 2;
  const ox = (width - size) / 2;
  const oy = (height - size) / 2;
  const toPx = ([x, y]) => [ox + (x / 100) * size, oy + (y / 100) * size];
  const pts = TRACK_POINTS.map(toPx);

  // Full outline, dim.
  drawSmoothClosedPath(ctx, pts);
  ctx.strokeStyle = 'rgba(11,13,18,0.15)';
  ctx.lineWidth = Math.max(6, size * 0.035);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Distance covered so far, drawn as a partial dashed-progress arc using
  // the same smoothed path, clipped by dash length.
  const perimeterEstimate = size * 3.4; // rough, good enough for a dash effect
  drawSmoothClosedPath(ctx, pts);
  ctx.setLineDash([perimeterEstimate * progress, perimeterEstimate]);
  ctx.lineDashOffset = 0;
  ctx.strokeStyle = '#ff5a1f';
  ctx.lineWidth = Math.max(6, size * 0.035);
  ctx.stroke();
  ctx.setLineDash([]);

  // Start/finish marker.
  const [sx, sy] = toPx(TRACK_POINTS[0]);
  ctx.beginPath();
  ctx.arc(sx, sy, Math.max(3, size * 0.012), 0, Math.PI * 2);
  ctx.fillStyle = '#0b0d12';
  ctx.fill();

  // Bike position dot.
  const [bx, by] = toPx(trackPoint(progress));
  ctx.beginPath();
  ctx.arc(bx, by, Math.max(5, size * 0.02), 0, Math.PI * 2);
  ctx.fillStyle = '#0b0d12';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bx, by, Math.max(9, size * 0.032), 0, Math.PI * 2);
  ctx.strokeStyle = '#ff5a1f';
  ctx.lineWidth = 2;
  ctx.stroke();
}

const TRACES = [
  { key: 'speed', label: 'SPEED', unit: 'km/h', keyframes: SPEED_KEYFRAMES, max: 260 },
  { key: 'lean', label: 'LEAN ANGLE', unit: '°', keyframes: LEAN_KEYFRAMES, max: 55 },
  { key: 'throttle', label: 'THROTTLE', unit: '%', keyframes: THROTTLE_KEYFRAMES, max: 100 },
];

function drawTraces(canvas, progress) {
  const ctx = canvas.getContext('2d');
  const { width, height, dpr } = fitCanvas(canvas);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const rowH = height / TRACES.length;
  const padX = 12;
  const graphW = width - padX * 2;

  TRACES.forEach((trace, i) => {
    const top = i * rowH;
    const baseline = top + rowH - rowH * 0.28;
    const plotH = rowH * 0.55;

    // Baseline
    ctx.strokeStyle = 'rgba(11,13,18,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, baseline);
    ctx.lineTo(padX + graphW, baseline);
    ctx.stroke();

    // Trace line from 0 to progress
    const steps = 48;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * progress;
      const v = sampleCurve(t, trace.keyframes);
      const x = padX + (t) * graphW;
      const y = baseline - (v / trace.max) * plotH;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#ff5a1f';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Playhead + current value
    const currentV = sampleCurve(progress, trace.keyframes);
    const headX = padX + progress * graphW;
    const headY = baseline - (currentV / trace.max) * plotH;
    ctx.beginPath();
    ctx.arc(headX, headY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0b0d12';
    ctx.fill();

    ctx.font = '600 11px monospace';
    ctx.fillStyle = 'rgba(11,13,18,0.45)';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(trace.label, padX, top + 14);

    ctx.font = '600 15px monospace';
    ctx.fillStyle = '#0b0d12';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(currentV)}${trace.unit}`, padX + graphW, top + 14);
    ctx.textAlign = 'left';
  });
}

// Reduced-motion / no-JS-scrub fallback: a single static frame at the end
// of the lap, captioned clearly as a simulated preview.
export default function TelemetryScrub() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef(null);
  const traceRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const trackCanvas = trackRef.current;
    const traceCanvas = traceRef.current;
    if (!trackCanvas || !traceCanvas) return undefined;

    if (reducedMotion) {
      drawTrack(trackCanvas, 1);
      drawTraces(traceCanvas, 1);
      const onResize = () => {
        drawTrack(trackCanvas, 1);
        drawTraces(traceCanvas, 1);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    // Draw an initial frame immediately so there's no blank canvas before
    // the user starts scrolling.
    drawTrack(trackCanvas, 0);
    drawTraces(traceCanvas, 0);

    const cleanupSetup = setupScrollTrigger();
    const section = sectionRef.current;
    if (!section) return cleanupSetup;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 1.6}`,
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        drawTrack(trackCanvas, self.progress);
        drawTraces(traceCanvas, self.progress);
      },
    });

    const onResize = () => {
      drawTrack(trackCanvas, trigger.progress);
      drawTraces(traceCanvas, trigger.progress);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      trigger.kill();
      cleanupSetup();
    };
  }, [reducedMotion]);

  return (
    <div ref={sectionRef}>
      <div className={reducedMotion ? '' : 'flex min-h-[85vh] items-center sm:min-h-screen'}>
        <div className="w-full rounded-2xl border border-ink/10 bg-white/60 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_1.3fr]" aria-hidden="true">
            <canvas ref={trackRef} className="aspect-square w-full rounded-xl bg-white/50" />
            <canvas ref={traceRef} className="h-48 w-full rounded-xl bg-white/50 sm:h-auto" />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink/35">
            Simulated preview — generated data standing in for a real logged session. Decorative
            illustration of the logger's real output; see the analysis features below for what the
            actual tool does.
          </p>
        </div>
      </div>
    </div>
  );
}
