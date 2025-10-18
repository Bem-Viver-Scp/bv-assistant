import { useEffect, useState } from 'react';

export type SortOrder = 'asc' | 'desc' | null;

type PersistShape = {
  sortKey: string | null;
  sortOrder: SortOrder;
};

/**
 * Hook de ordenação com persistência opcional em localStorage.
 * Passe um storageKey (ex: "bv.dashboard.sort") para salvar/restaurar.
 */
export function useTableSort<T extends Record<string, any>>(
  storageKey?: string
) {
  const readPersist = (): PersistShape | null => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as PersistShape) : null;
    } catch {
      return null;
    }
  };

  const persisted = readPersist();

  const [sortKey, setSortKey] = useState<keyof T | null>(
    (persisted?.sortKey as keyof T) ?? null
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    persisted?.sortOrder ?? null
  );

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortData = (data: T[]) => {
    if (!sortKey || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      // compara de forma estável e case-insensitive
      const as = av == null ? '' : String(av);
      const bs = bv == null ? '' : String(bv);

      const cmp = as.localeCompare(bs, 'pt-BR', { sensitivity: 'base' });
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  };

  // persiste sempre que mudar
  useEffect(() => {
    if (!storageKey) return;
    try {
      const payload: PersistShape = {
        sortKey: (sortKey as string) ?? null,
        sortOrder,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      /* noop */
    }
  }, [sortKey, sortOrder, storageKey]);

  return { sortKey, sortOrder, toggleSort, sortData };
}
