import { describe, it, expect } from "vitest";
import { adaptObservabilityPayload, toSnapshotOrNull } from "../observabilityAdapter";
import { mockSnapshot } from "@/data/mockObservability";

describe("observabilityAdapter", () => {
  it("accepts a full valid mock snapshot", () => {
    const result = adaptObservabilityPayload(mockSnapshot);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.partial).toBe(false);
      expect(result.data.equipment.equipmentId).toBe("MTR-07A-LINE3");
      expect(result.data.telemetry.length).toBeGreaterThan(0);
      expect(result.data.kpis.length).toBeGreaterThan(0);
    }
  });

  it("returns ok:false for null payload", () => {
    const result = adaptObservabilityPayload(null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/null|undefined/i);
      expect(result.data).toBeNull();
    }
  });

  it("returns ok:false for completely malformed payload", () => {
    const result = adaptObservabilityPayload({ foo: "bar" });
    expect(result.ok).toBe(false);
  });

  it("recovers a partial snapshot when equipment is valid but other sections are missing", () => {
    const partial = {
      equipment: mockSnapshot.equipment,
      lastUpdated: new Date().toISOString(),
    };
    const result = adaptObservabilityPayload(partial);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.partial).toBe(true);
      expect(result.data.equipment.name).toBe(mockSnapshot.equipment.name);
      expect(result.data.telemetry).toEqual([]);
      expect(result.data.timeline).toEqual([]);
    }
  });

  it("unwraps common backend wrappers { data } / { result } / { snapshot }", () => {
    const wrapped = { data: mockSnapshot };
    const result = adaptObservabilityPayload(wrapped);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.equipment.equipmentId).toBe("MTR-07A-LINE3");
    }
  });

  it("toSnapshotOrNull returns null on failure and data on success", () => {
    expect(toSnapshotOrNull(null)).toBeNull();
    expect(toSnapshotOrNull(mockSnapshot)?.equipment.equipmentId).toBe("MTR-07A-LINE3");
  });
});
