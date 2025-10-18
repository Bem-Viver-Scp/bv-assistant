import {
  Clock3,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import type { Status } from '../../utils/appointments';

type Props = {
  status: Status;
  lateStart?: boolean;
  earlyStop?: boolean;
};

export default function StatusBadge({ status, lateStart, earlyStop }: Props) {
  const s = (status || 'PENDENTE').toUpperCase();

  const iconMap: Record<string, JSX.Element> = {
    ATIVO: <Clock3 className="w-3.5 h-3.5 mr-1" />,
    ATRASADO: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
    CONCLUIDO: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    AUSENTE: <XCircle className="w-3.5 h-3.5 mr-1" />,
    PENDENTE: <HelpCircle className="w-3.5 h-3.5 mr-1" />,
  };

  const clsMap: Record<string, string> = {
    ATIVO: 'bg-emerald-600 text-white',
    ATRASADO: 'bg-amber-500 text-white',
    CONCLUIDO: 'bg-teal-600 text-white',
    AUSENTE: 'bg-rose-600 text-white',
    PENDENTE: 'bg-slate-500 text-white',
  };

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
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        clsMap[s] ?? clsMap.PENDENTE
      }`}
    >
      {iconMap[s] ?? iconMap.PENDENTE}
      {s[0] + s.slice(1).toLowerCase()}
      {hasFlags && (
        <span className="ml-1 group relative" aria-label={title} title={title}>
          <Info className="w-3.5 h-3.5 opacity-90" />
          {/* tooltip puro (usa title), se quiser custom: 
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition">
            {title}
          </span> */}
        </span>
      )}
    </span>
  );
}
