/**
 * Mock Observability Data
 * ----------------------
 * Realistic simulated industrial motor telemetry and validation results.
 * Replace this entire module with live API responses that satisfy the
 * interfaces in src/types/observability.ts – zero UI changes required.
 */

import type {
  ObservabilitySnapshot,
  TelemetryChannel,
  EquipmentEvent,
  ValidationResultItem,
  KpiCardData,
  SpectrumFrame,
  MotorTwinState,
  UploadItem,
} from "@/types/observability";

const now = new Date();
const iso = (minutesAgo: number) =>
  new Date(now.getTime() - minutesAgo * 60_000).toISOString();

export const mockMotor: MotorTwinState = {
  equipmentId: "MTR-07A-LINE3",
  name: "Line 3 Drive Motor",
  health: "warning",
  rpm: 1782,
  loadPercent: 67,
  temperatureC: 78.4,
  vibrationRms: 3.8,
  indicators: {
    heat: 0.62,
    vibration: 0.48,
    magnetic: 0.31,
  },
};

export const mockTelemetry: TelemetryChannel[] = [
  {
    id: "rpm",
    label: "Shaft Speed",
    unit: "RPM",
    current: 1782,
    min: 0,
    max: 1800,
    status: "healthy",
    sparkline: Array.from({ length: 24 }, (_, i) => ({
      timestamp: iso(24 - i),
      value: 1760 + Math.sin(i / 3) * 18 + Math.random() * 8,
    })),
  },
  {
    id: "current",
    label: "Phase Current",
    unit: "A",
    current: 42.7,
    min: 0,
    max: 60,
    status: "warning",
    sparkline: Array.from({ length: 24 }, (_, i) => ({
      timestamp: iso(24 - i),
      value: 38 + Math.sin(i / 2.5) * 4 + Math.random() * 3,
    })),
  },
  {
    id: "temp",
    label: "Winding Temp",
    unit: "°C",
    current: 78.4,
    min: 20,
    max: 110,
    status: "warning",
    sparkline: Array.from({ length: 24 }, (_, i) => ({
      timestamp: iso(24 - i),
      value: 68 + i * 0.4 + Math.random() * 2,
    })),
  },
  {
    id: "vib",
    label: "Vibration RMS",
    unit: "mm/s",
    current: 3.8,
    min: 0,
    max: 12,
    status: "degraded",
    sparkline: Array.from({ length: 24 }, (_, i) => ({
      timestamp: iso(24 - i),
      value: 2.2 + Math.sin(i / 4) * 1.1 + Math.random() * 0.6,
    })),
  },
];

export const mockSpectrum: SpectrumFrame = {
  id: "spec-001",
  timestamp: iso(0),
  sampleRateHz: 25600,
  bins: Array.from({ length: 128 }, (_, i) => {
    const f = (i / 128) * 12800;
    // Placeholder spectral shape – not a real algorithm
    const base = Math.exp(-f / 4000) * 0.6;
    const peak = f > 900 && f < 1100 ? 0.35 * Math.exp(-Math.pow((f - 1000) / 80, 2)) : 0;
    return {
      frequencyHz: f,
      magnitude: Math.min(1, base + peak + Math.random() * 0.04),
    };
  }),
  history: Array.from({ length: 16 }, () =>
    Array.from({ length: 64 }, (_, i) => ({
      frequencyHz: (i / 64) * 6400,
      magnitude: Math.random() * 0.7,
    })),
  ),
};

export const mockTimeline: EquipmentEvent[] = [
  {
    id: "evt-1",
    timestamp: iso(5),
    type: "alert",
    title: "Elevated winding temperature",
    description: "Temperature crossed 75 °C threshold",
    healthState: "warning",
    severity: "medium",
  },
  {
    id: "evt-2",
    timestamp: iso(42),
    type: "status_change",
    title: "Health state → Degraded",
    healthState: "degraded",
    severity: "low",
  },
  {
    id: "evt-3",
    timestamp: iso(180),
    type: "validation",
    title: "Baseline comparison completed",
    description: "Spectral comparison against last 7-day baseline",
    severity: "info",
  },
  {
    id: "evt-4",
    timestamp: iso(360),
    type: "upload",
    title: "Signal capture uploaded",
    description: "15-minute continuous acquisition",
    severity: "info",
  },
  {
    id: "evt-5",
    timestamp: iso(1440),
    type: "maintenance",
    title: "Scheduled inspection window",
    severity: "info",
  },
];

export const mockValidation: ValidationResultItem[] = [
  {
    id: "val-1",
    name: "Spectral baseline separation",
    category: "Signal Quality",
    status: "pass",
    score: 87,
    message: "Clear separation observed vs fixed-window baseline",
    timestamp: iso(30),
  },
  {
    id: "val-2",
    name: "Noise robustness (synthetic VFD)",
    category: "Robustness",
    status: "partial",
    score: 64,
    message: "Degradation under high switching frequency still under review",
    timestamp: iso(90),
  },
  {
    id: "val-3",
    name: "Reproducibility gate",
    category: "Process",
    status: "pass",
    score: 100,
    message: "Identical result on re-run with locked parameters",
    timestamp: iso(120),
  },
  {
    id: "val-4",
    name: "Edge compute envelope",
    category: "Deployment",
    status: "pending",
    message: "Benchmark pending target hardware profile",
  },
];

export const mockKpis: KpiCardData[] = [
  {
    id: "kpi-health",
    label: "Asset Health Index",
    value: 72,
    unit: "%",
    trend: "down",
    trendValue: -4.2,
    trendLabel: "24h",
    status: "warning",
    sparkline: [81, 79, 78, 76, 75, 74, 73, 72],
  },
  {
    id: "kpi-lead",
    label: "Detection Horizon",
    value: "6–12",
    unit: "weeks",
    trend: "flat",
    status: "healthy",
  },
  {
    id: "kpi-alerts",
    label: "Active Alerts",
    value: 2,
    trend: "up",
    trendValue: 1,
    trendLabel: "24h",
    status: "warning",
  },
  {
    id: "kpi-uptime",
    label: "Observed Uptime",
    value: 99.2,
    unit: "%",
    trend: "up",
    trendValue: 0.1,
    trendLabel: "7d",
    status: "healthy",
  },
];

export const mockUploads: UploadItem[] = [
  {
    id: "up-1",
    filename: "line3_mtr07a_20260722_0815.bin",
    sizeBytes: 4_194_304,
    status: "complete",
    progress: 100,
    uploadedAt: iso(40),
  },
  {
    id: "up-2",
    filename: "capture_15min_vfd_stress.raw",
    sizeBytes: 12_582_912,
    status: "processing",
    progress: 68,
  },
];

export const mockSnapshot: ObservabilitySnapshot = {
  equipment: mockMotor,
  telemetry: mockTelemetry,
  spectrum: mockSpectrum,
  timeline: mockTimeline,
  validation: mockValidation,
  kpis: mockKpis,
  uploads: mockUploads,
  lastUpdated: iso(0),
};
