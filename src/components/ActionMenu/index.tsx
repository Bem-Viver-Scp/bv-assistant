import { useEffect, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';

export type ActionKey =
  | 'VERIFY_WITH_DOCTOR'
  | 'VERIFIED_NO_RETURN'
  | 'VERIFIED_JUSTIFIED';

export const ACTIONS: { key: ActionKey; label: string }[] = [
  { key: 'VERIFY_WITH_DOCTOR', label: 'Verificar com Médico' },
  { key: 'VERIFIED_NO_RETURN', label: 'Médico verificado, sem retorno' },
  { key: 'VERIFIED_JUSTIFIED', label: 'Médico verificado, justificado' },
];

type Props = {
  open: boolean;
  onToggle: () => void;
  onSelect: (key: ActionKey) => void;
};

export default function ActionMenu({ open, onToggle, onSelect }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Fecha ao clicar fora (usa 'click', não 'mousedown')
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        if (open) onToggle();
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open, onToggle]);

  const handleItemClick = (key: ActionKey) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(key); // o pai fecha o menu e abre o modal
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className="cursor-pointer rounded-lg px-2 py-1 ring-1 ring-[var(--ring)] hover:bg-[var(--on-secondary)]"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Ações"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-64 rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={handleItemClick(a.key)}
              className="cursor-pointer w-full text-left px-4 py-3 text-sm hover:bg-[var(--on-secondary)]"
              role="menuitem"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
