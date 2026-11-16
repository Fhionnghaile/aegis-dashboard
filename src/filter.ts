import type { Detection, Severity } from "./types";

export interface Filters {
  readonly severities: ReadonlySet<Severity>; // empty = all
  readonly source: string;                    // substring, case-insensitive
  readonly sinceMs: number;                   // 0 = no lower bound
}

export function applyFilters(rows: readonly Detection[], f: Filters): Detection[] {
  const q = f.source.trim().toLowerCase();
  return rows.filter((d) => {
    if (f.severities.size > 0 && !f.severities.has(d.severity)) return false;
    if (q.length > 0 && !d.source.toLowerCase().includes(q)) return false;
    if (f.sinceMs > 0 && Date.parse(d.detectedAt) < f.sinceMs) return false;
    return true;
  });
}

export function countBySeverity(rows: readonly Detection[]): Record<Severity, number> {
  const out: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const d of rows) out[d.severity] += 1;
  return out;
}
