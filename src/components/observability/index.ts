/**
 * Observability UI – Public Surface
 * ---------------------------------
 * Import only what you need. Every component is independently replaceable.
 */

export { HealthBadge } from "./HealthBadge";
export { KpiCard, KpiGrid } from "./KpiCard";
export { TelemetryWidget, TelemetryGrid } from "./TelemetryWidget";
export { SpectrumWaterfall } from "./SpectrumWaterfall";
export { EquipmentTimeline } from "./EquipmentTimeline";
export { UploadPanel } from "./UploadPanel";
export { ValidationResultsPanel } from "./ValidationResultsPanel";
export { MotorDigitalTwin } from "./MotorDigitalTwin";
export { ExecutiveDashboard } from "./ExecutiveDashboard";
export type { ExecutiveDashboardProps } from "./ExecutiveDashboard";
export { LoadingOverlay, PageTransition } from "./LoadingTransition";

// Re-export core types so consumers can stay in one import path
export type {
  ObservabilitySnapshot,
  MotorTwinState,
  TelemetryChannel,
  SpectrumFrame,
  EquipmentEvent,
  ValidationResultItem,
  KpiCardData,
  UploadItem,
  HealthState,
} from "@/types/observability";
