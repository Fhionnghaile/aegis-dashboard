import { useEffect, useMemo, useState } from "react";
import type { Detection, Severity } from "./types";
import { SEVERITIES, SEVERITY_RANK } from "./types";
import { subscribeDetections } from "./feed";
import { applyFilters, countBySeverity, type Filters } from "./filter";

const SEV_COLOR: Record<Severity, string> = {
  critical: "#b2182b", high: "#d6604d", medium: "#d9a441", low: "#2166ac", info: "#6b7280",
};
const CAP = 500;

export default function App(): JSX.Element {
  const [rows, setRows] = useState<readonly Detection[]>([]);
  const [sevFilter, setSevFilter] = useState<ReadonlySet<Severity>>(new Set());
  const [source, setSource] = useState<string>("");
  const [selected, setSelected] = useState<Detection | null>(null);

  useEffect(() => {
    return subscribeDetections((d) => {
      setRows((prev) => {
        const next = [d, ...prev];
        return next.length > CAP ? next.slice(0, CAP) : next;
      });
    });
  }, []);

  const filters: Filters = useMemo(
    () => ({ severities: sevFilter, source, sinceMs: 0 }),
    [sevFilter, source],
  );
  const visible = useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const counts = useMemo(() => countBySeverity(rows), [rows]);
  const max = Math.max(1, ...SEVERITIES.map((s) => counts[s]));

  function toggleSev(s: Severity): void {
    setSevFilter((prev) => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s); else n.add(s);
      return n;
    });
  }

  return (
    <div className="wrap">
      <header>
        <h1>Aegis <span className="dim">· live detections</span></h1>
        <div className="live"><span className="pulse" /> {rows.length} total</div>
      </header>

      <section className="tiles">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            className={"tile" + (sevFilter.has(s) ? " on" : "")}
            style={{ borderColor: SEV_COLOR[s] }}
            onClick={() => toggleSev(s)}
            aria-pressed={sevFilter.has(s)}
          >
            <span className="dot" style={{ background: SEV_COLOR[s] }} />
            <b>{counts[s]}</b> <span className="sev">{s}</span>
          </button>
        ))}
      </section>

      <section className="chart" aria-label="detections by severity">
        {SEVERITIES.map((s) => (
          <div className="bar-row" key={s}>
            <span className="bar-label">{s}</span>
            <div className="bar-track">
              <div className="bar" style={{ width: `${(counts[s] / max) * 100}%`, background: SEV_COLOR[s] }} />
            </div>
            <span className="bar-num">{counts[s]}</span>
          </div>
        ))}
      </section>

      <div className="toolbar">
        <input
          type="text"
          placeholder="filter by source…"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <span className="dim">{visible.length} shown</span>
        {sevFilter.size > 0 && (
          <button className="clear" onClick={() => setSevFilter(new Set())}>clear severity filter</button>
        )}
      </div>

      <table className="rows">
        <thead>
          <tr><th>time</th><th>severity</th><th>rule</th><th>source</th><th>count</th></tr>
        </thead>
        <tbody>
          {visible.map((d) => (
            <tr key={d.id} onClick={() => setSelected(d)} className="row">
              <td className="mono">{new Date(d.detectedAt).toLocaleTimeString()}</td>
              <td><span className="pill" style={{ background: SEV_COLOR[d.severity] }}>{d.severity}</span></td>
              <td>{d.title}</td>
              <td className="mono">{d.source}</td>
              <td className="mono">{d.count ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected !== null && (
        <aside className="drawer" onClick={() => setSelected(null)}>
          <div className="drawer-card" onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setSelected(null)} aria-label="close">✕</button>
            <h2>{selected.title}</h2>
            <p className="dim">{selected.ruleId} · rank {SEVERITY_RANK[selected.severity]}</p>
            <dl>
              <dt>severity</dt><dd>{selected.severity}</dd>
              <dt>source</dt><dd>{selected.source}</dd>
              <dt>detected</dt><dd className="mono">{selected.detectedAt}</dd>
              {selected.groupKey !== undefined && (<><dt>group</dt><dd>{selected.groupKey}</dd></>)}
              {selected.count !== undefined && (<><dt>count</dt><dd>{selected.count}</dd></>)}
            </dl>
            <pre>{JSON.stringify(selected.event, null, 2)}</pre>
          </div>
        </aside>
      )}
    </div>
  );
}
