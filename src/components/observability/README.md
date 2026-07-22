# Observability UI – Premium Modular Components

Production-quality, completely modular React + TypeScript components for an industrial equipment observability experience.

**No business logic. No proprietary algorithms. No hard-coded backend assumptions.**

All data arrives through TypeScript interfaces / props / JSON. Any future API that satisfies `ObservabilitySnapshot` (or the individual interfaces) can power the UI without modification.

---

## Folder Structure

```
src/
├── types/
│   └── observability.ts          # All contracts / interfaces
├── data/
│   └── mockObservability.ts      # Simulated JSON (replace with live data)
└── components/
    └── observability/
        ├── index.ts              # Public exports
        ├── HealthBadge.tsx
        ├── KpiCard.tsx
        ├── TelemetryWidget.tsx
        ├── SpectrumWaterfall.tsx
        ├── EquipmentTimeline.tsx
        ├── UploadPanel.tsx
        ├── ValidationResultsPanel.tsx
        ├── MotorDigitalTwin.tsx
        ├── ExecutiveDashboard.tsx  # Composer
        ├── LoadingTransition.tsx
        └── README.md             # This file
```

---

## Component Hierarchy

```
ExecutiveDashboard
├── LoadingOverlay / PageTransition
├── KpiGrid → KpiCard[]
├── MotorDigitalTwin (+ HealthBadge)
├── SpectrumWaterfall
├── TelemetryGrid → TelemetryWidget[]
├── EquipmentTimeline (+ HealthBadge)
├── ValidationResultsPanel
└── UploadPanel
```

Every leaf component can be imported and used independently.

---

## Required Dependencies

Already present in the project:
- `react`, `react-dom`, `tailwindcss`, `lucide-react`, `date-fns`, `clsx` / `tailwind-merge`

**Add these:**

```bash
npm install framer-motion
```

Optional (for a future Three.js digital twin swap):

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

The current `MotorDigitalTwin` is a high-fidelity CSS/SVG + Framer Motion implementation that already satisfies the full visual contract. A React Three Fiber version can later replace the file while keeping the identical `MotorTwinState` prop interface.

---

## Quick Start (Mock Data)

```tsx
import { ExecutiveDashboard } from "@/components/observability";
import { mockSnapshot } from "@/data/mockObservability";

export default function ObservabilityPage() {
  return (
    <ExecutiveDashboard
      data={mockSnapshot}
      loading={false}
      onFilesSelected={(files) => {
        // Hand off to your upload service
        console.log("Files selected", files);
      }}
    />
  );
}
```

---

## Connecting a Real Backend

1. Your API (REST, GraphQL, WebSocket, Supabase, etc.) returns JSON that satisfies:

```ts
import type { ObservabilitySnapshot } from "@/types/observability";
```

2. Fetch or subscribe in a parent (React Query, SWR, custom hook, etc.):

```tsx
const { data, isLoading } = useObservabilityQuery(equipmentId);

return (
  <ExecutiveDashboard
    data={data ?? null}
    loading={isLoading}
    onFilesSelected={handleUpload}
  />
);
```

3. Zero changes are required inside any component under `src/components/observability/`.

### Individual component usage

```tsx
import { MotorDigitalTwin, TelemetryGrid, SpectrumWaterfall } from "@/components/observability";

<MotorDigitalTwin state={api.equipment} />
<TelemetryGrid channels={api.telemetry} />
<SpectrumWaterfall frame={api.spectrum} />
```

---

## Design Notes

- **Aesthetic**: Dark navy (`#060d18` / `#0a1424`) + gold/amber accents, consistent with the existing NEXUS visual system.
- **Motion**: Framer Motion for all entrances, health transitions, progress bars, and micro-interactions.
- **Responsive**: Mobile-first grids that expand cleanly to executive wide layouts.
- **Accessibility**: Semantic structure, sufficient contrast on primary text, reduced-motion friendly springs.
- **Replaceability**: Any single component can be swapped (e.g., a real R3F twin, a different chart library for spectrum, a real file-uploader) without touching siblings.

---

## What This Is Not

- Not a complete application.
- Not a data-processing or signal-analysis engine.
- Not an implementation of any proprietary algorithm.
- Not tied to any specific backend, database, or authentication scheme.

It is a pure premium presentation layer ready for the engineering team that owns the observability pipeline.
