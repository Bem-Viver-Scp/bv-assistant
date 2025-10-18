import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Send, MessageSquare, Clock } from 'lucide-react';
import type { ActionKey } from '../ActionMenu';
import api from '../../services/api';

type Annotation = {
  id: string;
  status?: string | null;
  message?: string | null;
  appointment_id: string;
  created_at?: string;
};

type Props = {
  appointmentId: string;
  doctorName: string;
  statusKey: ActionKey;
  onClose: () => void;
};

const statusLabel: Record<ActionKey, string> = {
  VERIFY_WITH_DOCTOR: 'Verificação com Médico',
  VERIFIED_NO_RETURN: 'Médico verificado, sem retorno',
  VERIFIED_JUSTIFIED: 'Médico verificado, justificado',
};

const placeholders: Record<ActionKey, string> = {
  VERIFY_WITH_DOCTOR: 'Descreva o feedback desta verificação com o médico...',
  VERIFIED_NO_RETURN:
    'Descreva o contato/checagem e o motivo do não retorno...',
  VERIFIED_JUSTIFIED: 'Descreva a justificativa informada pelo médico...',
};

// helper para decidir cor por status
function getStatusColor(status?: string | null) {
  return status === 'VERIFIED_NO_RETURN' ? 'var(--warning)' : 'var(--primary)';
}

export default function Modal({
  appointmentId,
  doctorName,
  statusKey,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [items, setItems] = useState<Annotation[]>([]);
  const [text, setText] = useState('');
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const optionLabel = useMemo(() => statusLabel[statusKey], [statusKey]);

  // cor atual (chip + borda do editor) baseada na opção escolhida
  const currentColor = getStatusColor(statusKey);

  const fetchAnnotations = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`/annotation/by-appointment/${appointmentId}`);
      setItems(resp.data ?? []);
    } finally {
      setLoading(false);
      // scroll bottom após carregar
      setTimeout(() => {
        scrollerRef.current?.scrollTo({
          top: scrollerRef.current.scrollHeight,
          behavior: 'instant',
        });
      }, 0);
    }
  };

  useEffect(() => {
    fetchAnnotations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const handleSend = async () => {
    const message = text.trim();
    if (!message) return;
    setSending(true);
    try {
      const payload = {
        status: statusKey,
        message,
        appointment_id: appointmentId,
      };
      const resp = await api.post('/annotation', payload);
      const saved: Annotation = resp.data ?? payload;
      setItems((prev) => [...prev, saved]);
      setText('');
      setTimeout(() => {
        scrollerRef.current?.scrollTo({
          top: scrollerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 50);
    } finally {
      setSending(false);
    }
  };

  // atalhos
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSend();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, text]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* dialog */}
      <div className="relative z-50 w-[96vw] max-w-3xl rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--ring)]/60">
          <div className="flex items-center gap-2">
            <MessageSquare
              className="w-5 h-5"
              style={{ color: currentColor }}
            />
            <div>
              <h3 className="text-lg font-semibold">
                Anotações de Verificação — {doctorName}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                {/* chip da opção selecionada */}
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1"
                  style={{
                    background: `color-mix(in oklab, ${currentColor} 16%, transparent)`,
                    color: currentColor,
                    borderColor: `color-mix(in oklab, ${currentColor} 36%, transparent)`,
                  }}
                >
                  {optionLabel}
                </span>
                <span className="text-sm text-[var(--muted)]">
                  Nova anotação
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-[var(--on-secondary)]"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* compose area */}
        <div className="px-5 pt-3 pb-4">
          <div
            className="rounded-2xl ring-2 px-3 py-2"
            style={{ borderColor: currentColor }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={placeholders[statusKey]}
              className="w-full bg-transparent outline-none text-sm resize-none min-h-[120px]"
            />
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm ring-1 ring-[var(--ring)] hover:bg-[var(--on-secondary)]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white disabled:opacity-50"
              style={{ background: 'var(--primary)' }} // mantém ação principal em primary
              title="Salvar Anotação"
            >
              <Send className="w-4 h-4" />
              Salvar Anotação
            </button>
          </div>
        </div>

        {/* divider */}
        <div className="px-5">
          <div className="h-px w-full" style={{ background: 'var(--ring)' }} />
        </div>

        {/* history header */}
        <div className="px-5 py-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <p className="text-sm font-medium">Histórico de Verificações</p>
        </div>

        {/* history list */}
        <div className="px-5 pb-5">
          {loading ? (
            <div className="space-y-2">
              <div className="h-6 w-2/3 rounded-xl bg-[var(--ring)]/40 animate-pulse" />
              <div className="h-6 w-1/2 rounded-xl bg-[var(--ring)]/40 animate-pulse" />
              <div className="h-6 w-3/4 rounded-xl bg-[var(--ring)]/40 animate-pulse" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <MessageSquare className="w-7 h-7 text-[var(--muted)]" />
              <p className="text-[var(--muted)] text-sm">
                Nenhuma anotação registrada ainda
              </p>
            </div>
          ) : (
            <div
              ref={scrollerRef}
              className="space-y-3 max-h-[40vh] overflow-y-auto pr-1"
            >
              {items.map((msg) => {
                const label =
                  statusLabel[msg.status as ActionKey] || msg.status || '';
                const color = getStatusColor(msg.status);
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-[var(--ring)] bg-[var(--card)] p-3"
                  >
                    {msg.status && (
                      <p className="text-xs font-medium mb-1" style={{ color }}>
                        {label}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    {msg.created_at && (
                      <p className="mt-1 text-[11px] text-[var(--muted)]">
                        {new Date(msg.created_at).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
