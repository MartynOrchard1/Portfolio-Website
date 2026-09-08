import Link from 'next/link';
import { profile } from '@/lib/projects';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight transition-colors duration-200 ease-out hover:text-accent"
        >
          {profile.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          <Link
            href="/#projects"
            className="hidden transition-colors duration-200 ease-out hover:text-accent sm:inline"
          >
            Projects
          </Link>
          <Link
            href="/#about"
            className="hidden transition-colors duration-200 ease-out hover:text-accent sm:inline"
          >
            About
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-ink px-4 py-2 text-paper transition-colors duration-200 ease-out hover:bg-accent"
          >
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
