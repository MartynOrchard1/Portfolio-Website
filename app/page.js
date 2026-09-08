import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import Tag from '@/components/Tag';
import ScrollReveal from '@/components/ScrollReveal';
import { profile, skills, featuredProject, otherProjects } from '@/lib/projects';

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        <ScrollReveal>
          <p className="font-mono text-sm uppercase tracking-widest text-accent">{profile.role}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-accent"
            >
              {profile.email}
            </a>
            <span className="text-sm text-ink/50">{profile.location}</span>
          </div>
        </ScrollReveal>
      </section>

      {/* Featured project */}
      <section id="projects" className="mx-auto max-w-5xl px-6 pb-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/45">Featured project</p>
        <ScrollReveal>
          <Link
            href={`/projects/${featuredProject.slug}/`}
            className="group grid gap-6 rounded-3xl border border-ink/10 bg-ink p-8 text-paper transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent sm:grid-cols-[1.4fr_1fr] sm:p-10"
          >
            <div>
              <h2 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
                {featuredProject.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-paper/75 sm:text-base">
                {featuredProject.blurb}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-accent">
                Read the full technical write-up
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
              </span>
            </div>
            <div className="flex flex-wrap content-start gap-2 sm:justify-end">
              {featuredProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="h-fit rounded-full border border-paper/25 px-3 py-1 font-mono text-xs text-paper/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </ScrollReveal>
      </section>

      {/* Other projects */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/45">More projects</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {otherProjects.map((project, index) => (
            <ScrollReveal key={project.title} delay={(index % 2) * 100}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* About / skills */}
      <section id="about" className="border-t border-ink/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/45">About</p>
          <div className="grid gap-12 sm:grid-cols-[1.2fr_1fr]">
            <ScrollReveal className="space-y-4 text-base leading-relaxed text-ink/80">
              {profile.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </ScrollReveal>
            <ScrollReveal className="space-y-5" delay={150}>
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/45">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
