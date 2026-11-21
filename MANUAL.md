# Aegis Dashboard (TypeScript + React) — manual

*One page, eight blocks. Every figure here comes from this repository's own tests and README.*

## 1. Claim
The dashboard is strictly typed end to end. A single `any` fails the build.

## 2. What it is
A live view of the detections the Aegis pipeline produces: severity tiles, a chart, a filterable table and a detail drawer. It runs on a built-in synthetic feed, so it can be demoed with nothing else running.

## 3. Demo
Run locally with the mock feed (`npm run dev`, then open http://localhost:5173). Capture to record: a short screen recording of the live table filling.

## 4. Run it yourself
**Prerequisites:** Node.js and npm.

```bash
npm ci
npm run build
npm run dev
```

## 5. What you will see
The strict typecheck and production build pass clean. The dev server shows detections arriving from the synthetic feed.

## 6. 30-second talking point
> Detection is only useful if someone can see it and triage it in seconds. The dashboard's contract with the detector is checked at build time, so a change in the alert shape breaks the build, not the SOC screen.

## 7. Scope and limits
- Reference UI. Productionising adds auth, RBAC and persistence.

## 8. Links
[Repository](https://github.com/fhionnghaile/aegis-dashboard) · [README](README.md)
