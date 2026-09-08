// GitHub Pages hosts static files with no Node server behind them, so this
// config builds the site as plain HTML/CSS/JS ("static export") instead of
// relying on a Next.js server.
//
// It also auto-detects whether this repo is:
//   - a USER page   (repo named exactly "<username>.github.io")
//       -> served at the domain root, e.g. https://martynorchard1.github.io/
//       -> no basePath needed
//   - a PROJECT page (any other repo name, e.g. "portfolio")
//       -> served at https://<username>.github.io/<repo-name>/
///      -> needs basePath/assetPrefix set to "/<repo-name>" so links & assets resolve
//
// You don't need to edit this file when you create the repo — the GitHub
// Actions workflow in .github/workflows/deploy.yml sets GITHUB_REPOSITORY
// automatically on every build. It only falls back to "" (root) when you
// run `npm run build` locally.
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';
const isUserPage = repoName.endsWith('.github.io');
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS);
const basePath = isGithubActions && repoName && !isUserPage ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages can't run Next's image-optimization server, so images
    // are served as-is.
    unoptimized: true,
  },
};

export default nextConfig;
