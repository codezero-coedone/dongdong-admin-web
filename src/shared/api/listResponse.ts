export type NormalizedList<T> = {
  items: T[];
  total: number | null;
};

/**
 * Normalize various backend list response shapes into { items, total }.
 *
 * Supported shapes:
 * - { items: T[], total: number }
 * - { data:  T[], total: number }
 * - { rows:  T[], count: number }
 * - { data: { items: T[], total: number } }  (nested)
 */
export function normalizeListResponse<T = any>(payload: any): NormalizedList<T> {
  const p = payload && typeof payload === 'object' ? payload : {};
  const root = p?.data && typeof p.data === 'object' ? p.data : p;

  const items: T[] =
    Array.isArray(root?.items)
      ? (root.items as T[])
      : Array.isArray(root?.data)
        ? (root.data as T[])
        : Array.isArray(root?.rows)
          ? (root.rows as T[])
          : [];

  const total: number | null =
    typeof root?.total === 'number'
      ? (root.total as number)
      : typeof root?.count === 'number'
        ? (root.count as number)
        : null;

  return { items, total };
}

