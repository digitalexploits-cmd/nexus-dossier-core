/**
 * Observability UI – Placeholder Interfaces
 * -----------------------------------------
 * Pure presentation contracts. No business logic, no proprietary algorithms.
 * All data arrives via props or injected JSON. Future APIs can satisfy these
 * interfaces without any UI component changes.
 */

export type HealthState = "healthy" | "degraded" | "warning" | "critical" | "offline" | "unknown";

export interface TelemetryPoint {
  timestamp: string; // ISO-8601
  value: number;
  unit?: string;
}

export interface TelemetryChannel {
  id: string;
  label: string;
  unit: string;
  current: number;
  min?: number;
  max?: number;
  sparkline?: TelemetryPoint[];
  status?: HealthState;
}

export interface SpectrumBin {
  frequencyHz: number;
  magnitude: number; // normalized 0–1 or dB
}

export interface SpectrumFrame {
  id: string;
  timestamp: string;
  sampleRateHz: number;
  bins: SpectrumBin[];
  /** Optional waterfall history (oldest → newest) */
  history?: SpectrumBin[][];
}

export interface EquipmentEvent {
  id: string;
  timestamp: string;
  type: "status_change" | "alert" | "maintenance" | "upload" | "validation" | "note";
  title: string;
  description?: string;
  healthState?: HealthState;
  severity?: "info" | "low" | "medium" | "high" | "critical";
  metadata?: Record<string, string | number | boolean>;
}

export interface ValidationResultItem {
  id: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "partial" | "pending" | "not_run";
  score?: number; // 0–100
  message?: string;
  evidenceRef?: string;
  timestamp?: string;
}

export interface KpiCardData {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: number; // e.g. +2.4 or -1.1
  trendLabel?: string;
  status?: HealthState;
  sparkline?: number[];
}

export interface MotorTwinState {
  equipmentId: string;
  name: string;
  health: HealthState;
  rpm?: number;
  loadPercent?: number;
  temperatureC?: number;
  vibrationRms?: number;
  /** Optional 0–1 values for visual intensity of heat / vibration / magnetic indicators */
  indicators?: {
    heat?: number;
    vibration?: number;
    magnetic?: number;
  };
}

export interface UploadItem {
  id: string;
  filename: string;
  sizeBytes: number;
  status: "queued" | "uploading" | "processing" | "complete" | "error";
  progress?: number; // 0–100
  errorMessage?: string;
  uploadedAt?: string;
}

/** Top-level shape a future API or mock can provide to the entire experience */
export interface ObservabilitySnapshot {
  equipment: MotorTwinState;
  telemetry: TelemetryChannel[];
  spectrum?: SpectrumFrame;
  timeline: EquipmentEvent[];
  validation: ValidationResultItem[];
  kpis: KpiCardData[];
  uploads?: UploadItem[];
  lastUpdated: string;
}
