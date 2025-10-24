import { MessageSquare } from 'lucide-react';

type Props = {
  count: number;
  onClick?: () => void;
};

export default function NotesBadge({ count, onClick }: Props) {
  if (!count) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center ml-1 cursor-pointer rounded p-0.5
                 hover:bg-[var(--on-secondary)] transition"
      title={`${count} anotação${count > 1 ? 's' : ''}`}
      aria-label={`${count} anotação${count > 1 ? 's' : ''}`}
    >
      <MessageSquare className="w-4 h-4 text-[var(--primary)] opacity-80 hover:opacity-100" />
    </button>
  );
}
