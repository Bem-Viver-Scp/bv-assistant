import { MessageSquare } from 'lucide-react';

export default function NotesBadge({ count }: { count: number }) {
  if (!count) return null;

  return (
    <div
      className="inline-flex items-center justify-center ml-1 cursor-pointer"
      title={`${count} anotação${count > 1 ? 's' : ''}`}
    >
      <MessageSquare className="w-4 h-4 text-[var(--primary)] opacity-80 hover:opacity-100 transition" />
    </div>
  );
}
