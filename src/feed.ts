import type { Detection, Severity } from "./types";

type Listener = (d: Detection) => void;

/**
 * Subscribe to the live detections feed. If VITE_FEED_URL is set it connects via
 * Server-Sent Events; otherwise it runs a built-in mock so the demo works standalone.
 * Returns an unsubscribe function.
 */
export function subscribeDetections(onDetection: Listener): () => void {
  const url = import.meta.env.VITE_FEED_URL;
  if (typeof url === "string" && url.length > 0) {
    const es = new EventSource(url);
    es.onmessage = (e: MessageEvent<string>) => {
      try { onDetection(JSON.parse(e.data) as Detection); } catch { /* ignore bad frame */ }
    };
    return () => es.close();
  }
  return startMock(onDetection);
}

const RULES: ReadonlyArray<{ ruleId: string; title: string; severity: Severity; source: string }> = [
  { ruleId: "s3-public", title: "S3 bucket made public", severity: "critical", source: "cloudtrail" },
  { ruleId: "auth-bruteforce", title: "Repeated failed logins", severity: "high", source: "auth" },
  { ruleId: "suspicious-exec", title: "Suspicious process execution", severity: "medium", source: "edr" },
  { ruleId: "new-admin", title: "New admin role granted", severity: "high", source: "iam" },
  { ruleId: "geo-anomaly", title: "Impossible travel", severity: "low", source: "sso" },
];
const USERS = ["alice", "bob", "carol", "dave"] as const;

function startMock(onDetection: Listener): () => void {
  let seq = 0;
  const timer = window.setInterval(() => {
    const r = RULES[Math.floor(Math.random() * RULES.length)]!;
    const user = USERS[Math.floor(Math.random() * USERS.length)]!;
    const d: Detection = {
      id: `d-${Date.now()}-${seq++}`,
      ruleId: r.ruleId,
      title: r.title,
      severity: r.severity,
      detectedAt: new Date().toISOString(),
      source: r.source,
      ...(r.ruleId === "auth-bruteforce" ? { groupKey: user, count: 5 + Math.floor(Math.random() * 10) } : {}),
      event: { actor: { user }, raw: "synthetic demo event" },
    };
    onDetection(d);
  }, 1100);
  return () => window.clearInterval(timer);
}
