import { addHours } from 'date-fns';
import { getFormatHours } from '../../utils/date';
import type { ActionKey } from '../ActionMenu';
import NotesBadge from '../NotesBadge';
import StatusBadge from '../StatusBadge';
import ActionMenu from '../ActionMenu';
import type { Appointment } from '../../utils/appointments';

type ItemRow = Appointment & { _lateStart?: boolean; _earlyStop?: boolean };

type Props = {
  item: ItemRow;
  notesCount: number;
  isMenuOpen: boolean;
  onOpenMenu: (id: string) => void;
  onSelectAction: (id: string, action: ActionKey) => void;
};

/** Helpers locais */
function formatPtShortDate(d: Date | string) {
  const date = new Date(d);
  // ex.: "sex • 08/11"
  const wd = date
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '');
  const dm = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
  return `${wd} • ${dm}`;
}

function formatDurationH(duration?: number | null) {
  if (!duration && duration !== 0) return '—';
  const totalMin = Math.round(Number(duration) * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function MobileRowCard({
  item,
  notesCount,
  isMenuOpen,
  onOpenMenu,
  onSelectAction,
}: Props) {
  const start = getFormatHours(item.date);
  const end = getFormatHours(
    addHours(item.date, (item.duration as number) ?? 0)
  );

  const entryDay = formatPtShortDate(item.date);
  const durationLabel = formatDurationH(item.duration as number);

  return (
    <div className="rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] p-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {item?.user?.name}
            <NotesBadge count={notesCount} />
          </p>
          <p className="text-xs text-[var(--muted)] truncate">
            {item?.hospital?.name ?? '—'}
          </p>
        </div>
        {item.status && (
          <StatusBadge
            status={item.status}
            lateStart={item._lateStart}
            earlyStop={item._earlyStop}
          />
        )}
      </div>

      {/* Linha de “chips” (especialidade, horário, dia e duração) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-[var(--on-secondary)] px-2.5 py-1 text-xs ring-1 ring-[var(--ring)]">
          {item?.expertise?.name}
        </span>

        <span className="text-xs text-[var(--muted)]">
          {start} — {end}
        </span>

        <span className="inline-flex rounded-full bg-[var(--on-secondary)] px-2 py-0.5 text-[11px] ring-1 ring-[var(--ring)]">
          {entryDay}
        </span>

        <span className="inline-flex rounded-full bg-[var(--on-secondary)] px-2 py-0.5 text-[11px] ring-1 ring-[var(--ring)]">
          {durationLabel}
        </span>

        {item?.transfering && (
          <span className="inline-flex rounded-full px-2.5 py-1 text-xs ring-1 ring-[var(--ring)]">
            Oferta Aberta
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] p-2">
          <p className="text-[var(--muted)]">Entrada real</p>
          <p className="font-medium">
            {item?.start_checkin ? getFormatHours(item.start_checkin) : '-'}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] p-2">
          <p className="text-[var(--muted)]">Saída real</p>
          <p className="font-medium">
            {item?.stop_checkin ? getFormatHours(item.stop_checkin) : '-'}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <ActionMenu
          open={isMenuOpen}
          onToggle={() => onOpenMenu(item.id)}
          onSelect={(key) => onSelectAction(item.id, key)}
        />
      </div>
    </div>
  );
}
