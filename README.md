# Aegis Dashboard (TypeScript + React)

<!-- at-a-glance -->
> **A live SOC dashboard that shows detections as they land.**  
> **Result:** TypeScript with a strict typecheck + production build that passes clean (`tsc --noEmit && vite build`).  
> **Reproduce:** `npm ci && npm run build`  
> ![CI](https://github.com/fhionnghaile/aegis-dashboard/actions/workflows/ci.yml/badge.svg)
>
> **What this is worth:** Turns the pipeline's output into something a human can triage in seconds — detection is only useful if someone can see it.


A **strictly-typed** (zero `any`) real-time dashboard for the Aegis `detections` stream: live table,
severity tiles + bar chart, source filter, and a detail drawer.

## Run
```bash
npm install
npm run dev        # http://localhost:5173  — runs with a built-in mock feed
npm run build      # tsc --noEmit (strict) + vite production build
```
Point it at the real feed (Server-Sent Events of `Detection` JSON from 02):
```bash
VITE_FEED_URL=http://localhost:8081/api/detections/stream npm run dev
```
No `VITE_FEED_URL` ⇒ a built-in synthetic feed drives the UI, so the demo works with nothing else running.

## Type safety
`tsconfig.json` runs `strict` + `noUnusedLocals/Parameters` + `exactOptionalPropertyTypes` +
`noImplicitReturns`. `src/types.ts` mirrors the detector's `Detection`; the feed, filters and UI are typed
end to end — **the build fails on a single `any`**.

## Structure
`types.ts` (the Detection contract) · `feed.ts` (SSE + mock fallback) · `filter.ts` (pure, testable
filtering + aggregation) · `App.tsx` (tiles, chart, table, drawer).

## License
MIT.

## Key decisions

- TypeScript + React with strict types, so the UI's contract with the backend is checked at build.
- Real-time updates over polling, to match the 'as it happens' promise.
- Component-isolated so views are testable without the live backend.

## Scope & limits

- Reference UI wired to the Aegis event shape; productionising adds auth, RBAC and persistence.

