export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-white/10 shadow-lg p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
