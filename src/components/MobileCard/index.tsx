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
        <StatusBadge
          status={item.status || 'PENDENTE'}
          lateStart={item._lateStart}
          earlyStop={item._earlyStop}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-[var(--on-secondary)] px-2.5 py-1 text-xs ring-1 ring-[var(--ring)]">
          {item?.expertise?.name}
        </span>
        <span className="text-xs text-[var(--muted)]">
          {start} — {end}
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
