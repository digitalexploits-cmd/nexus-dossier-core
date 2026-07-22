# Observability UI – Premium Modular Components

Production-quality, completely modular React + TypeScript components for an industrial equipment observability experience.

**No business logic. No proprietary algorithms. No hard-coded backend assumptions.**

All data arrives through TypeScript interfaces / props / JSON via a single adapter seam.

---

## Quick Demo

```
/observability-demo
```

Standalone route that renders `ExecutiveDashboard` using the mock snapshot **through** the official adapter. Visible immediately; no backend required.

---

## Folder Structure

```
src/
├── types/observability.ts
├── data/mockObservability.ts
├── services/observabilityAdapter.ts   ← single backend seam + Zod validation
├── pages/ObservabilityDemo.tsx
└── components/observability/
    ├── index.ts
    ├── HealthBadge.tsx
    ├── KpiCard.tsx
    ├── TelemetryWidget.tsx
    ├── SpectrumWaterfall.tsx
    ├── EquipmentTimeline.tsx
    ├── UploadPanel.tsx
    ├── ValidationResultsPanel.tsx
    ├── MotorDigitalTwin.tsx
    ├── ExecutiveDashboard.tsx
    ├── LoadingTransition.tsx
    └── README.md
```

---

## Adapter Boundary (critical)

```ts
import { adaptObservabilityPayload } from "@/services/observabilityAdapter";

const result = adaptObservabilityPayload(unknownBackendJson);
if (result.ok) {
  // result.data is ObservabilitySnapshot
  // result.partial indicates some sections were recovered
}
```

- Accepts `unknown`
- Validates with Zod
- Isolates all field mapping
- UI components never import API-specific models
- Tolerates partial payloads

---

## Graceful States

| State | Behavior |
|-------|----------|
| `loading` | Full-screen overlay spinner |
| no data | Empty state card with guidance |
| malformed | Error banner + safe empty |
| partial snapshot | Amber banner + available sections rendered |
| upload failure | Toast-style banner (demo) |
| unavailable spectrum | Dashed placeholder inside SpectrumWaterfall |

---

## Public Exports

```ts
import {
  ExecutiveDashboard,
  type ExecutiveDashboardProps,
  MotorDigitalTwin,
  // ... all other components
  type ObservabilitySnapshot,
  type HealthState,
} from "@/components/observability";
```

---

## Dependencies

```bash
npm install          # picks up framer-motion already listed in package.json
npm run build
npm run lint
```

Optional later: `three @react-three/fiber @react-three/drei` for an R3F twin that keeps the same `MotorTwinState` interface.

---

## Theme

Reusable components prefer design tokens (`bg-card`, `text-primary`, `border-border`, `text-muted-foreground`, etc.) defined in `src/index.css`. Hard-coded brand hex values have been removed from the chrome; residual SVG accent colors inside the digital twin remain intentionally local for visual fidelity and can be overridden later via CSS variables if desired.
