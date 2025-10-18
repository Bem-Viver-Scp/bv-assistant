type Variant = 'success' | 'warning' | 'error' | 'primary' | 'default';

type Props = {
  title: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  variant?: Variant;
};

export default function StatCard({
  title,
  value,
  sub,
  icon,
  variant = 'default',
}: Props) {
  // associa as vars do tema
  const colorVar =
    variant === 'success'
      ? 'var(--success)'
      : variant === 'warning'
      ? 'var(--warning)'
      : variant === 'error'
      ? 'var(--error)'
      : variant === 'primary'
      ? 'var(--primary)'
      : 'var(--fg)';

  const borderColor = `color-mix(in oklab, ${colorVar} 40%, transparent)`;
  const textColor = colorVar;
  const subColor = `color-mix(in oklab, ${colorVar} 60%, transparent)`;

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border p-4 transition hover:shadow-sm"
      style={{ borderColor }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: textColor }}>
          {title}
        </p>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-semibold" style={{ color: textColor }}>
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs font-medium" style={{ color: subColor }}>
          {sub}
        </p>
      )}
    </div>
  );
}
