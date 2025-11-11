import { Clock3, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import type { Status } from '../../utils/appointments';

type Props = {
  status?: Status;
  lateStart?: boolean;
  earlyStop?: boolean;
};

export default function StatusBadge({ status, lateStart, earlyStop }: Props) {
  if (!status) return null;
  const s = String(status).toUpperCase();

  const iconMap: Record<string, JSX.Element> = {
    ATIVO: <Clock3 className="w-3.5 h-3.5 mr-1" />,
    ATRASADO: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
    CONCLUIDO: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    AUSENTE: <XCircle className="w-3.5 h-3.5 mr-1" />,
  };
  const clsMap: Record<string, string> = {
    ATIVO: 'bg-emerald-600 text-white',
    ATRASADO: 'bg-amber-500 text-white',
    CONCLUIDO: 'bg-teal-600 text-white',
    AUSENTE: 'bg-rose-600 text-white',
  };

  const icon = iconMap[s];
  const cls = clsMap[s];
  if (!icon || !cls) return null;

  const hasFlags = s === 'CONCLUIDO' && (lateStart || earlyStop);
  const title = hasFlags
    ? [
        lateStart ? 'Início após tolerância' : null,
        earlyStop ? 'Saída antes do fim (tol.)' : null,
      ]
        .filter(Boolean)
        .join(' • ')
    : undefined;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {icon}
      {s[0] + s.slice(1).toLowerCase()}
      {hasFlags && (
        <span className="ml-1" aria-label={title} title={title}>
          <Info className="w-3.5 h-3.5 opacity-90" />
        </span>
      )}
    </span>
  );
}
