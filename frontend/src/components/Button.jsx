export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full font-semibold transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-60';
  const primary = 'bg-[var(--color-accent)] text-white px-6 py-3 hover:bg-[var(--color-accent-hover)] shadow-lg shadow-orange-900/20';
  const secondary = 'bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 hover:bg-white/20';

  const styles = variant === 'secondary' ? secondary : primary;
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
