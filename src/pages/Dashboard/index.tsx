import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ArrowsUpFromLine } from 'lucide-react';

import { useHospital } from '../../contexts/HospitalContext';
import api from '../../services/api';
import {
  getCurrentDate,
  getCurrentMonth,
  getCurrentYear,
  getFormatHours,
} from '../../utils/date';

import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import TableSkeleton from '../../components/TableSkeleton';
import TableHeaderSort from '../../components/TableHeaderSort';
import DashboardFilters from '../../components/Filters';
import ActionMenu, { type ActionKey } from '../../components/ActionMenu';
import NotesBadge from '../../components/NotesBadge';

import {
  computeStatus,
  addHours,
  type Appointment,
  type Status,
} from '../../utils/appointments';

import { useTableSort } from '../../hooks/tableSort';
import MobileRowCard from '../../components/MobileCard';
import Modal from '../../components/Modal';

/** ---------- Utils ---------- */
function formatPtDate(d: Date) {
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Linha da tabela/lista com campos derivados usados para sort
type Row = Appointment & {
  _doctor: string;
  _expertise: string;
  _status: string;
};

export default function Dashboard() {
  const today = new Date();
  const { currentHospital } = useHospital();

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState<{
    search: string;
    expertise: string;
    unit: string;
    status: Status | '';
  }>({ search: '', expertise: '', unit: '', status: '' });

  // persistência de sort (funciona pra mobile e desktop)
  const { sortKey, sortOrder, toggleSort, sortData } =
    useTableSort<Row>('bv.dashboard.sort');

  // painel de filtros mobile
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // menu por linha e modal
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    appointmentId: string;
    action: ActionKey;
    doctorName: string;
  } | null>(null);

  // mapa: id do appointment -> quantidade de anotações
  const [notesCountMap, setNotesCountMap] = useState<Record<string, number>>(
    {}
  );

  const handleChangeFilters = (next: Partial<typeof filters>) =>
    setFilters((prev) => ({ ...prev, ...next }));

  /** Busca plantões do dia */
  const fetchAppointments = async (currentName: string) => {
    if (!currentHospital?.value) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/appointment/admin/year/${getCurrentYear(today)}/month/${
          getCurrentMonth(today) + 1
        }/day/${getCurrentDate(today)}/byHospital/${
          currentHospital.value
        }/byName/${currentName}`
      );

      const data = (response.data ?? []) as Appointment[];

      const base =
        currentName === 'listall' || currentName.length < 3
          ? data
          : data.filter((a) =>
              a.expertise?.name
                ?.toLowerCase()
                .includes(currentName.toLowerCase())
            );

      const withStatus = base.map((it) => computeStatus(it));
      setAppointments(withStatus);
    } finally {
      setLoading(false);
    }
  };

  // carrega contagem de anotações para cada appointment
  const refreshNotesCounts = async (ids: string[]) => {
    if (!ids.length) return;
    try {
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const r = await api.get(`/annotation/by-appointment/${id}`);
            const count = Array.isArray(r.data) ? r.data.length : 0;
            return [id, count] as const;
          } catch {
            return [id, 0] as const;
          }
        })
      );
      setNotesCountMap(Object.fromEntries(entries));
    } catch {
      /* noop */
    }
  };

  const refreshOneNotesCount = async (id: string) => {
    try {
      const r = await api.get(`/annotation/by-appointment/${id}`);
      const count = Array.isArray(r.data) ? r.data.length : 0;
      setNotesCountMap((m) => ({ ...m, [id]: count }));
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    fetchAppointments('listall');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHospital?.value]);

  // quando a lista de appointments mudar, busca as contagens
  useEffect(() => {
    const ids = appointments.map((a) => a.id);
    if (ids.length) refreshNotesCounts(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  /** filtros locais */
  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const okDoctor = filters.search
        ? a.user?.name?.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const okExpertise = filters.expertise
        ? a.expertise?.name
            ?.toLowerCase()
            .includes(filters.expertise.toLowerCase())
        : true;
      const okUnit = filters.unit
        ? a.hospital?.name?.toLowerCase().includes(filters.unit.toLowerCase())
        : true;
      const okStatus = filters.status ? a.status === filters.status : true;
      return okDoctor && okExpertise && okUnit && okStatus;
    });
  }, [appointments, filters]);

  /** aplica ordenação (com campos derivados) */
  const sorted = useMemo(() => {
    const list: Row[] = filtered.map((a) => ({
      ...a,
      _doctor: a.user?.name ?? '',
      _expertise: a.expertise?.name ?? '',
      _status: (a.status ?? '').toString(),
    }));
    return sortData(list);
  }, [filtered, sortData]);

  /** métricas */
  const stats = useMemo(() => {
    const ativos = filtered.filter(
      (a) => a.status?.toUpperCase() === 'ATIVO'
    ).length;
    const atrasos = filtered.filter(
      (a) => a.status?.toUpperCase() === 'ATRASADO'
    ).length;
    const escalados = new Set(filtered.map((a) => a?.user?.name)).size;
    const ausentes = filtered.filter(
      (a) => a.status?.toUpperCase() === 'AUSENTE'
    ).length;
    return { ativos, atrasos, escalados, ausentes };
  }, [filtered]);

  /** ----- Ações / Modal ----- */
  const openActions = (id: string) =>
    setOpenMenuFor((cur) => (cur === id ? null : id));

  const handleActionSelect = (appointmentId: string, action: ActionKey) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    setOpenMenuFor(null);
    setModal({
      appointmentId,
      action,
      doctorName: appt?.user?.name ?? 'Médico',
    });
  };

  const handleCloseModal = async (lastId?: string) => {
    const id = lastId ?? modal?.appointmentId;
    setModal(null);
    if (id) await refreshOneNotesCount(id); // atualiza o badge
  };

  // mobile: seletor de ordenação
  const mobileSortKey = (sortKey as string) || '';
  const handleMobileSortChange = (key: string) => toggleSort(key as keyof Row);
  const toggleMobileOrder = () => {
    if (!sortKey) return;
    toggleSort(sortKey as keyof Row);
  };

  return (
    <div className="space-y-6">
      {/* título e cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-[var(--primary)]">
          Dashboard de Plantões
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {formatPtDate(today)} •{' '}
          {currentHospital?.label ?? 'Selecione um hospital'}
        </p>
      </div>

      {/* cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Plantões Ativos"
          value={stats.ativos}
          sub="Em andamento no momento"
          icon={<CalendarDays className="size-5 text-[var(--muted)]" />}
        />
        <StatCard title="Atrasos" value={stats.atrasos} />
        <StatCard title="Ausentes" value={stats.ausentes} />
        <StatCard title="Médicos Escalados" value={stats.escalados} />
      </div>

      {/* ------ Filtros mobile-first ------ */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
            placeholder="Buscar por médico..."
            value={filters.search}
            onChange={(e) =>
              setFilters((s) => ({ ...s, search: e.target.value }))
            }
          />
          <button
            onClick={() => setShowMobileFilters((s) => !s)}
            className="rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)] bg-[var(--card)]"
          >
            Filtros
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={mobileSortKey}
            onChange={(e) => handleMobileSortChange(e.target.value)}
            className="flex-1 rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
          >
            <option value="">Ordenar por…</option>
            <option value="_doctor">Médico</option>
            <option value="_expertise">Especialidade</option>
            <option value="_status">Status</option>
          </select>

          <button
            disabled={!sortKey}
            onClick={toggleMobileOrder}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)] disabled:opacity-50"
            title="Inverter ordem"
          >
            <ArrowsUpFromLine className="w-4 h-4" />
            {sortOrder ?? '—'}
          </button>

          <button
            onClick={() => fetchAppointments('listall')}
            className="rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)] bg-[var(--primary)] text-white"
          >
            Atualizar
          </button>
        </div>

        {showMobileFilters && (
          <div className="rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] p-3 space-y-2">
            <input
              className="w-full rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
              placeholder="Especialidade..."
              value={filters.expertise}
              onChange={(e) =>
                setFilters((s) => ({ ...s, expertise: e.target.value }))
              }
            />
            <input
              className="w-full rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
              placeholder="Unidade..."
              value={filters.unit}
              onChange={(e) =>
                setFilters((s) => ({ ...s, unit: e.target.value }))
              }
            />
            <select
              className="w-full rounded-xl bg-[var(--on-secondary)] ring-1 ring-[var(--ring)] px-3 py-2 text-sm outline-none"
              value={filters.status}
              onChange={(e) =>
                setFilters((s) => ({
                  ...s,
                  status: e.target.value as Status | '',
                }))
              }
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
                onClick={() => fetchAppointments('listall')}
                className="flex-1 rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)] bg-[var(--primary)] text-white"
              >
                Aplicar
              </button>
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    expertise: '',
                    unit: '',
                    status: '',
                  })
                }
                className="flex-1 rounded-xl px-3 py-2 text-sm ring-1 ring-[var(--ring)]"
              >
                Limpar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filtros completos no desktop */}
      <div className="hidden md:block">
        <DashboardFilters
          values={filters}
          onChange={handleChangeFilters}
          onRefresh={() => fetchAppointments('listall')}
          onClear={() =>
            setFilters({ search: '', expertise: '', unit: '', status: '' })
          }
        />
      </div>

      {/* ------ Lista (mobile) ------ */}
      <div className="md:hidden">
        {loading ? (
          <div className="space-y-3">
            <div className="h-24 rounded-2xl bg-[var(--ring)]/40 animate-pulse" />
            <div className="h-24 rounded-2xl bg-[var(--ring)]/40 animate-pulse" />
            <div className="h-24 rounded-2xl bg-[var(--ring)]/40 animate-pulse" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center text-sm text-[var(--muted)] py-8">
            Nenhum plantão encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((item) => (
              <MobileRowCard
                key={item.id}
                item={item}
                notesCount={notesCountMap[item.id] ?? 0}
                isMenuOpen={openMenuFor === item.id}
                onOpenMenu={openActions}
                onSelectAction={handleActionSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* ------ Tabela (desktop md+) ------ */}
      <div className="hidden md:block rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] overflow-x-auto md:min-h-[360px]">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="border-b border-[var(--ring)]/60">
              <TableHeaderSort
                label="Médico"
                active={sortKey === '_doctor'}
                order={sortOrder}
                onClick={() => toggleSort('_doctor')}
              />
              <TableHeaderSort
                label="Especialidade"
                active={sortKey === '_expertise'}
                order={sortOrder}
                onClick={() => toggleSort('_expertise')}
              />
              <th className="px-4 py-3 font-medium">Horário</th>
              <TableHeaderSort
                label="Status"
                active={sortKey === '_status'}
                order={sortOrder}
                onClick={() => toggleSort('_status')}
              />
              <th className="px-4 py-3 font-medium">Entrada Real</th>
              <th className="px-4 py-3 font-medium">Saída Real</th>
              <th className="px-4 py-3 font-medium">Troca de Plantão</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableSkeleton cols={8} rows={6} />
            ) : sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-[var(--muted)]"
                >
                  Nenhum plantão encontrado.
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr key={item.id} className="border-t border-[var(--ring)]/60">
                  <td className="px-4 py-3">
                    <span className="align-middle">{item?.user?.name}</span>
                    <NotesBadge count={notesCountMap[item.id] ?? 0} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[var(--on-secondary)] px-2.5 py-1 text-xs ring-1 ring-[var(--ring)]">
                      {item?.expertise?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const start = getFormatHours(item?.date);
                      const end = getFormatHours(
                        addHours(item.date, (item.duration as number) ?? 0)
                      );
                      return `${start} — ${end}`;
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={item.status || 'PENDENTE'}
                      lateStart={item._lateStart}
                      earlyStop={item._earlyStop}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {item?.start_checkin
                      ? getFormatHours(item.start_checkin)
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item?.stop_checkin
                      ? getFormatHours(item.stop_checkin)
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item?.transfering ? (
                      <span className="inline-flex rounded-full px-2.5 py-1 text-xs ring-1 ring-[var(--ring)]">
                        Oferta Aberta
                      </span>
                    ) : (
                      'Não'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ActionMenu
                      open={openMenuFor === item.id}
                      onToggle={() => openActions(item.id)}
                      onSelect={(key) => handleActionSelect(item.id, key)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de anotações */}
      {modal && (
        <Modal
          appointmentId={modal.appointmentId}
          doctorName={modal.doctorName}
          statusKey={modal.action}
          onClose={() => handleCloseModal(modal.appointmentId)}
        />
      )}
    </div>
  );
}
