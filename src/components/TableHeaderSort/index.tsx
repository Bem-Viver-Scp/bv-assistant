import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SortOrder } from '../../hooks/tableSort';

type Props = {
  label: string;
  active: boolean;
  order: SortOrder;
  onClick: () => void;
};

export default function TableHeaderSort({
  label,
  active,
  order,
  onClick,
}: Props) {
  return (
    <th
      onClick={onClick}
      className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-[var(--on-secondary)] transition"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {active ? (
          order === 'asc' ? (
            <ChevronUp className="w-3.5 h-3.5 opacity-70" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          )
        ) : (
          <ChevronDown className="w-3.5 h-3.5 opacity-30" />
        )}
      </div>
    </th>
  );
}
