import Tag from './Tag';

export default function ProjectCard({ project }) {
  const Wrapper = project.href ? 'a' : 'div';
  const wrapperProps = project.href
    ? { href: project.href, target: '_blank', rel: 'noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white/60 p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_12px_30px_-18px_rgba(11,13,18,0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug">{project.title}</h3>
        {project.href && (
          <span className="mt-1 text-ink/40 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-accent">
            →
          </span>
        )}
      </div>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink/45">{project.period}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{project.blurb}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </Wrapper>
  );
}
