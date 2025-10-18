import type { Status } from '../../utils/appointments';

type Props = {
  values: {
    search: string;
    expertise: string;
    unit: string;
    status: Status | '';
  };
  onChange: (next: Partial<Props['values']>) => void;
  onRefresh: () => void;
  onClear: () => void;
};

export default function DashboardFilters({
  values,
  onChange,
  onRefresh,
  onClear,
}: Props) {
  return (
    <div className="rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] p-3 md:p-4">
      <div className="grid gap-3 md:grid-cols-5">
        <input
          className="rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
          placeholder="Médico..."
          value={values.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
        <input
          className="rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
          placeholder="Especialidade..."
          value={values.expertise}
          onChange={(e) => onChange({ expertise: e.target.value })}
        />
        <input
          className="rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
          placeholder="Unidade..."
          value={values.unit}
          onChange={(e) => onChange({ unit: e.target.value })}
        />
        <select
          className="rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
          value={values.status}
          onChange={(e) => onChange({ status: e.target.value as Status | '' })}
        >
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativo</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="AUSENTE">Ausente</option>
          <option value="PENDENTE">Pendente</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)] bg-[var(--primary)] text-white hover:opacity-90"
          >
            Atualizar
          </button>
          <button
            onClick={onClear}
            className="rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)] bg-[var(--on-secondary)] hover:bg-[var(--card)]"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
