# Portfolio site

A personal portfolio built with Next.js, exported as static HTML/CSS/JS so it can be hosted for
free on GitHub Pages. Homepage plus a dedicated deep-dive page for the BMW S1000RR telemetry
("data logger") project at `/projects/data-logger/`.

## Editing content

Almost everything you'll want to change lives in **`lib/projects.js`** — your name, tagline, email,
GitHub/LinkedIn links, the "About" summary, the skills lists, and the project descriptions. Edit
that one file for most updates.

The data-logger deep-dive page's text (hardware list, analysis features, export formats) lives at
the top of **`app/projects/data-logger/page.js`**.

Before you publish, open `lib/projects.js` and replace:

- `email` — currently a placeholder
- `github` — your real GitHub profile URL
- `linkedin` — add yours, or leave blank to hide the link

## Running it locally

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Changes to files under `app/`, `components/`, or `lib/` hot-reload
automatically.

## Deploying to GitHub Pages

1. Create a new **public** GitHub repository and push this project to it (see below).
2. In the repo, go to **Settings → Pages** and under "Build and deployment", set **Source** to
   **GitHub Actions**.
3. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` builds the site and
   deploys it automatically — check the **Actions** tab for progress.
4. Your site will be live at:
   - `https://<your-username>.github.io/` if the repo is named exactly `<your-username>.github.io`
   - `https://<your-username>.github.io/<repo-name>/` for any other repo name

   You don't need to change any config for either case — `next.config.mjs` detects which one you're
   using automatically from the repo name.

### First push, if you haven't used git before

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Using your own domain instead

Add a file `public/CNAME` containing just your domain (e.g. `martynorchard.dev`), point your
domain's DNS at GitHub Pages per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site),
and set `basePath`/`assetPrefix` back to `''` in `next.config.mjs` since a custom domain always
serves from the root.

## Motion & animation

The site uses [Lenis](https://lenis.dev) for smoothed scrolling everywhere, and
[GSAP](https://gsap.com)'s ScrollTrigger plugin (free since Webflow's acquisition of GSAP) for the
heavier scroll-driven effects on the data-logger page specifically: a pinned, sequenced reveal for
"How data moves through the system", and a scroll-scrubbed telemetry visualization in the hero
(`components/TelemetryScrub.js`) built from **generated, not real, data** — it's a stand-in for
real logged sessions, clearly captioned as simulated. See the comments at the top of
`TelemetryScrub.js` for how to swap in real data once you have it (from a track day, once the
logger's captured a real session).

Everything respects `prefers-reduced-motion` (`lib/useReducedMotion.js`) — visitors with that OS
setting get instant, fully static content with no pinning, scrubbing, or smoothed scroll. The
pinned/scrubbed sections also keep their full content available to screen readers even when the
visual sequencing is active (see the `sr-only` block in `DataFlowDiagram.js`).

Pinned scroll sections are the trickiest thing to test without a real device — Playwright/headless
Chrome doesn't fully reproduce mobile browsers' dynamic address-bar resizing. Worth a quick check on
your own phone once this is deployed; if anything feels janky on scroll, the pinned sections are in
`components/DataFlowDiagram.js` and `components/TelemetryScrub.js`.

## Adding real screenshots later

Drop image files into `public/images/` and reference them using Next's `<Image>` component rather
than a plain `<img>` tag:

```jsx
import Image from 'next/image';
// ...
<Image src="/images/your-file.png" alt="Description" width={800} height={500} />
```

Using `<Image>` (instead of `<img src="/images/...">`) matters here specifically because this site
can be deployed at a sub-path (`your-username.github.io/repo-name/`) — `<Image>` automatically
adjusts the path to match, while a plain `<img>` tag won't and the picture will 404. The data-logger
page has a `TODO` comment marking a good spot to add hardware/dashboard photos once you have some
worth showing.
