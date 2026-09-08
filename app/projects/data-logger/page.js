import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tag from '@/components/Tag';
import DataFlowDiagram from '@/components/DataFlowDiagram';
import TelemetryScrub from '@/components/TelemetryScrub';
import { featuredProject } from '@/lib/projects';

export const metadata = {
  title: `${featuredProject.title} — Martyn Orchard`,
  description: featuredProject.blurb,
};

const hardware = [
  {
    part: 'ESP32 OBD/CAN board',
    detail: 'Reads live telemetry directly off the bike’s OBD/CAN bus.',
  },
  {
    part: 'ESP32-S3 LCD board',
    detail: 'Second unit for the live on-bike display and on-board logging.',
  },
  {
    part: 'ESP-NOW wireless link',
    detail: 'Low-latency, connectionless link between the two ESP32 units — no Wi-Fi network required trackside.',
  },
  {
    part: 'u-blox NEO-M8N GPS',
    detail: 'GGA/RMC sentences only, configured for a 5 Hz fix rate for accurate lap and sector timing.',
  },
  {
    part: 'microSD logging',
    detail: 'Every session is written to CSV on-device, so a lost wireless link never loses a lap.',
  },
  {
    part: 'Start/finish button (planned)',
    detail: 'Physical button to mark the GPS start/finish line for automatic lap timing.',
  },
];

const analysisFeatures = [
  'Combined telemetry graphs across an entire session',
  'GPS maps synchronised to the telemetry timeline, with markers',
  'Lap and session management',
  'Delta-time analysis between laps',
  'Automatic event and corner detection, with sector breakdowns',
  'GPS-quality analysis',
  'Malformed-row and missing-data reporting',
  'Synthetic-data detection (flags fabricated or interpolated rows)',
  'AI-generated session summaries and a natural-language Q&A interface over the session data, built on the Claude API',
];

const exportFormats = ['CSV', 'JSON', 'Excel', 'PDF', 'HTML', 'PNG', 'ZIP'];

export default function DataLoggerProject() {
  return (
    <>
      <Header />

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link href="/#projects" className="font-mono text-xs uppercase tracking-widest text-ink/45 hover:text-accent">
          ← Back to projects
        </Link>

        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {featuredProject.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {featuredProject.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <p className="mt-6 text-lg leading-relaxed text-ink/80">{featuredProject.blurb}</p>

        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Built for a 2015 BMW S1000RR. The goal was never a generic CSV viewer — it’s a
          motorsport data-logging and analysis tool built the way a small race team would actually
          use one: log everything on-device so a session is never lost, then pull it apart afterwards
          for lap-by-lap and corner-by-corner improvement.
        </p>

        {/* Hero: scroll-scrubbed telemetry preview */}
        <div className="mt-10">
          <TelemetryScrub />
        </div>

        {/* Status */}
        <div className="mt-10 rounded-2xl border border-ink/10 bg-white/60 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Status</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            The prototype works end-to-end — OBD telemetry capture, wireless transmission, live
            display, SD logging, and GPS reception are all functioning together on the bike.
          </p>
        </div>

        {/* Architecture */}
        <h2 className="mt-16 font-display text-2xl font-semibold">How data moves through the system</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Two ESP32 boards split the job: one stays close to the bike’s data bus and GPS, the other
          carries the display and the SD card, linked wirelessly so nothing on the bike needs a physical
          data cable.
        </p>
        <div className="mt-8">
          <DataFlowDiagram />
        </div>

        {/* Hardware */}
        <h2 className="mt-16 font-display text-2xl font-semibold">Hardware</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {hardware.map((item) => (
            <div key={item.part} className="rounded-xl border border-ink/10 bg-white/60 p-4">
              <p className="font-mono text-sm font-medium">{item.part}</p>
              <p className="mt-1 text-sm text-ink/65">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Analysis app */}
        <h2 className="mt-16 font-display text-2xl font-semibold">The analysis application</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          A Streamlit application built specifically to read the CSVs the logger produces — the
          brief was a serious motorsport analysis tool, not a generic CSV viewer. It also has an AI
          layer on top, built on the Claude API: it writes a plain-language summary of a session and
          answers follow-up questions about the data directly, rather than making you dig through
          graphs for everything.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {analysisFeatures.map((feature) => (
            <li
              key={feature}
              className="rounded-lg border border-ink/10 bg-white/40 px-4 py-3 text-sm text-ink/75"
            >
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/45">Export formats</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {exportFormats.map((format) => (
              <Tag key={format}>{format}</Tag>
            ))}
          </div>
        </div>

        {/* Why it matters */}
        <h2 className="mt-16 font-display text-2xl font-semibold">Why this project</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          This one project touches most of what I do: embedded C/C++ on microcontrollers, a wireless
          protocol chosen deliberately for the constraints of a race track, a real-time data pipeline
          from sensor to storage, and a full analysis application on top in Python. It started from a
          genuine problem — wanting proper lap data off my own bike — rather than a course brief,
          and it’s still actively being extended.
        </p>

        {/* TODO for Marty: add a GitHub repo link and/or real screenshots/photos of the
            hardware, the dash display, and the Streamlit app once you're ready to publish
            them here. A simple `<img>` in /public/images/ is enough — Next.js's static
            export serves it as-is. */}
      </article>

      <Footer />
    </>
  );
}
