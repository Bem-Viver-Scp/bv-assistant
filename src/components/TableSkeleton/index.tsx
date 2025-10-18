type Props = {
  cols?: number;
  rows?: number;
};

export default function TableSkeleton({ cols = 8, rows = 6 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-t border-[var(--ring)]/60">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-4 py-3">
              <div className="h-4 w-full max-w-[180px] rounded bg-[var(--ring)]/40 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
