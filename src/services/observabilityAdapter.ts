/**
 * Observability Adapter Boundary
 * -----------------------------
 * Single seam between any future backend and the pure UI layer.
 * Accepts unknown JSON, validates with Zod, and returns a typed
 * ObservabilitySnapshot (or a partial/empty safe fallback).
 *
 * UI components must never import API-specific models.
 * All field mapping and normalization lives here only.
 */

import { z } from "zod";
import type {
  ObservabilitySnapshot,
  HealthState,
  TelemetryChannel,
  SpectrumFrame,
  EquipmentEvent,
  ValidationResultItem,
  KpiCardData,
  MotorTwinState,
  UploadItem,
} from "@/types/observability";

// ---------- Zod schemas (runtime) ----------

const HealthStateSchema = z.enum([
  "healthy",
  "degraded",
  "warning",
  "critical",
  "offline",
  "unknown",
]);

const TelemetryPointSchema = z.object({
  timestamp: z.string(),
  value: z.number(),
  unit: z.string().optional(),
});

const TelemetryChannelSchema = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.string(),
  current: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
  sparkline: z.array(TelemetryPointSchema).optional(),
  status: HealthStateSchema.optional(),
});

const SpectrumBinSchema = z.object({
  frequencyHz: z.number(),
  magnitude: z.number(),
});

const SpectrumFrameSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  sampleRateHz: z.number(),
  bins: z.array(SpectrumBinSchema),
  history: z.array(z.array(SpectrumBinSchema)).optional(),
});

const EquipmentEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(["status_change", "alert", "maintenance", "upload", "validation", "note"]),
  title: z.string(),
  description: z.string().optional(),
  healthState: HealthStateSchema.optional(),
  severity: z.enum(["info", "low", "medium", "high", "critical"]).optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const ValidationResultItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum(["pass", "fail", "partial", "pending", "not_run"]),
  score: z.number().optional(),
  message: z.string().optional(),
  evidenceRef: z.string().optional(),
  timestamp: z.string().optional(),
});

const KpiCardDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  trend: z.enum(["up", "down", "flat"]).optional(),
  trendValue: z.number().optional(),
  trendLabel: z.string().optional(),
  status: HealthStateSchema.optional(),
  sparkline: z.array(z.number()).optional(),
});

const MotorTwinStateSchema = z.object({
  equipmentId: z.string(),
  name: z.string(),
  health: HealthStateSchema,
  rpm: z.number().optional(),
  loadPercent: z.number().optional(),
  temperatureC: z.number().optional(),
  vibrationRms: z.number().optional(),
  indicators: z
    .object({
      heat: z.number().optional(),
      vibration: z.number().optional(),
      magnetic: z.number().optional(),
    })
    .optional(),
});

const UploadItemSchema = z.object({
  id: z.string(),
  filename: z.string(),
  sizeBytes: z.number(),
  status: z.enum(["queued", "uploading", "processing", "complete", "error"]),
  progress: z.number().optional(),
  errorMessage: z.string().optional(),
  uploadedAt: z.string().optional(),
});

const ObservabilitySnapshotSchema = z.object({
  equipment: MotorTwinStateSchema,
  telemetry: z.array(TelemetryChannelSchema),
  spectrum: SpectrumFrameSchema.optional(),
  timeline: z.array(EquipmentEventSchema),
  validation: z.array(ValidationResultItemSchema),
  kpis: z.array(KpiCardDataSchema),
  uploads: z.array(UploadItemSchema).optional(),
  lastUpdated: z.string(),
});

export type AdapterResult =
  | { ok: true; data: ObservabilitySnapshot; partial: boolean }
  | { ok: false; error: string; data: null };

/**
 * Convert unknown backend payload into a validated ObservabilitySnapshot.
 * Tolerant of partial data: missing optional sections become empty arrays / undefined.
 * Hard failures (completely unusable payload) return ok: false.
 */
export function adaptObservabilityPayload(raw: unknown): AdapterResult {
  if (raw == null) {
    return { ok: false, error: "Payload is null or undefined", data: null };
  }

  // Allow a top-level wrapper some backends use: { data: {...} } or { result: {...} }
  let candidate = raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object") candidate = obj.data;
    else if (obj.result && typeof obj.result === "object") candidate = obj.result;
    else if (obj.snapshot && typeof obj.snapshot === "object") candidate = obj.snapshot;
  }

  const parsed = ObservabilitySnapshotSchema.safeParse(candidate);

  if (parsed.success) {
    return { ok: true, data: parsed.data, partial: false };
  }

  // Attempt partial recovery: validate individual sections
  try {
    const obj = (candidate ?? {}) as Record<string, unknown>;

    const equipment = MotorTwinStateSchema.safeParse(obj.equipment);
    const telemetry = z.array(TelemetryChannelSchema).safeParse(obj.telemetry ?? []);
    const spectrum = obj.spectrum
      ? SpectrumFrameSchema.safeParse(obj.spectrum)
      : { success: true as const, data: undefined };
    const timeline = z.array(EquipmentEventSchema).safeParse(obj.timeline ?? []);
    const validation = z.array(ValidationResultItemSchema).safeParse(obj.validation ?? []);
    const kpis = z.array(KpiCardDataSchema).safeParse(obj.kpis ?? []);
    const uploads = obj.uploads
      ? z.array(UploadItemSchema).safeParse(obj.uploads)
      : { success: true as const, data: undefined };

    if (!equipment.success) {
      return {
        ok: false,
        error: `Core equipment block invalid: ${equipment.error.message}`,
        data: null,
      };
    }

    const snapshot: ObservabilitySnapshot = {
      equipment: equipment.data,
      telemetry: telemetry.success ? telemetry.data : [],
      spectrum: spectrum.success ? spectrum.data : undefined,
      timeline: timeline.success ? timeline.data : [],
      validation: validation.success ? validation.data : [],
      kpis: kpis.success ? kpis.data : [],
      uploads: uploads.success ? uploads.data : undefined,
      lastUpdated:
        typeof obj.lastUpdated === "string"
          ? obj.lastUpdated
          : new Date().toISOString(),
    };

    return { ok: true, data: snapshot, partial: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown adapter error",
      data: null,
    };
  }
}

/** Convenience: adapt and always return a usable (possibly empty) snapshot or null */
export function toSnapshotOrNull(raw: unknown): ObservabilitySnapshot | null {
  const result = adaptObservabilityPayload(raw);
  return result.ok ? result.data : null;
}
