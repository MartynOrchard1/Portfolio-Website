export default function Tag({ children }) {
  return (
    <span className="rounded-full border border-ink/15 bg-ink/[0.03] px-3 py-1 font-mono text-xs text-ink/70">
      {children}
    </span>
  );
}
