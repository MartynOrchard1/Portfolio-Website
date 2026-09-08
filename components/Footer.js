import { profile } from '@/lib/projects';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, hosted on GitHub Pages.
        </p>
        <div className="flex gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors duration-200 ease-out hover:text-accent"
          >
            Email
          </a>
          {profile.github && (
            <a
              href={profile.github}
              className="transition-colors duration-200 ease-out hover:text-accent"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              className="transition-colors duration-200 ease-out hover:text-accent"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
