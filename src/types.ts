export type Severity = "critical" | "high" | "medium" | "low" | "info";

export const SEVERITIES: readonly Severity[] = ["critical", "high", "medium", "low", "info"] as const;

/** Mirrors the detector's Detection JSON (02 Detection Consumer). Strictly typed — no `any`. */
export interface Detection {
  readonly id: string;
  readonly ruleId: string;
  readonly title: string;
  readonly severity: Severity;
  readonly detectedAt: string;        // ISO-8601
  readonly source: string;
  readonly groupKey?: string;
  readonly count?: number;
  readonly event: Readonly<Record<string, unknown>>;
}

export const SEVERITY_RANK: Readonly<Record<Severity, number>> = {
  critical: 0, high: 1, medium: 2, low: 3, info: 4,
};
