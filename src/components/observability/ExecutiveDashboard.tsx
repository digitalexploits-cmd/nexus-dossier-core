import { cn } from "@/lib/utils";
import type { ObservabilitySnapshot } from "@/types/observability";
import { MotorDigitalTwin } from "./MotorDigitalTwin";
import { KpiGrid } from "./KpiCard";
import { TelemetryGrid } from "./TelemetryWidget";
import { SpectrumWaterfall } from "./SpectrumWaterfall";
import { EquipmentTimeline } from "./EquipmentTimeline";
import { ValidationResultsPanel } from "./ValidationResultsPanel";
import { UploadPanel } from "./UploadPanel";
import { PageTransition, LoadingOverlay } from "./LoadingTransition";

export interface ExecutiveDashboardProps {
  data?: ObservabilitySnapshot | null;
  loading?: boolean;
  /** True when adapter recovered a partial snapshot */
  partial?: boolean;
  /** Human-readable adapter / data error */
  errorMessage?: string | null;
  className?: string;
  onFilesSelected?: (files: FileList) => void;
}

/**
 * Premium executive composition.
 * Accepts a full (or partial) ObservabilitySnapshot.
 * Every child is independently replaceable and driven solely by props.
 * Graceful states: loading, empty, malformed, partial, missing spectrum.
 */
export function ExecutiveDashboard({
  data,
  loading = false,
  partial = false,
  errorMessage = null,
  className,
  onFilesSelected,
}: ExecutiveDashboardProps) {
  const hasData = Boolean(data?.equipment);

  return (
    <div
      className={cn(
        "relative min-h-screen bg-background text-foreground",
        className,
      )}
    >
      <LoadingOverlay visible={loading} />

      <PageTransition className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary/80">
              Equipment Observability
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              Executive View
            </h1>
          </div>
          {data?.lastUpdated && (
            <p className="text-xs text-muted-foreground tabular-nums">
              Last update · {new Date(data.lastUpdated).toLocaleString()}
            </p>
          )}
        </header>

        {/* Status banners */}
        {errorMessage && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
            Data error: {errorMessage}
          </div>
        )}
        {partial && !errorMessage && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm text-primary">
            Partial snapshot — some sections could not be fully validated and are shown with available data only.
          </div>
        )}

        {/* Empty / no-data state */}
        {!loading && !hasData && !errorMessage && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <p className="text-lg font-medium text-foreground">No observability data</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Connect a backend that returns an ObservabilitySnapshot, or load the demo mock via the adapter.
            </p>
          </div>
        )}

        {/* Main content when we have at least equipment */}
        {hasData && data && (
          <>
            {/* KPI row */}
            {data.kpis && data.kpis.length > 0 && <KpiGrid items={data.kpis} />}

            {/* Main grid: Twin + Spectrum + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4">
                <MotorDigitalTwin state={data.equipment} className="h-full min-h-[380px]" />
              </div>

              <div className="lg:col-span-5 space-y-5">
                <SpectrumWaterfall frame={data.spectrum} height={180} />
                {data.telemetry && data.telemetry.length > 0 ? (
                  <TelemetryGrid channels={data.telemetry} />
                ) : (
                  <EmptySection label="Telemetry channels unavailable" />
                )}
              </div>

              <div className="lg:col-span-3 space-y-5">
                <section className="rounded-xl border border-border bg-card/70 p-4">
                  <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Status Timeline
                  </h2>
                  {data.timeline && data.timeline.length > 0 ? (
                    <EquipmentTimeline events={data.timeline} />
                  ) : (
                    <EmptySection label="No timeline events" compact />
                  )}
                </section>
              </div>
            </div>

            {/* Lower row: Validation + Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <section className="rounded-xl border border-border bg-card/70 p-4">
                <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Validation Results
                </h2>
                {data.validation && data.validation.length > 0 ? (
                  <ValidationResultsPanel results={data.validation} />
                ) : (
                  <EmptySection label="No validation results" compact />
                )}
              </section>

              <section className="rounded-xl border border-border bg-card/70 p-4">
                <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Signal Capture Upload
                </h2>
                <UploadPanel items={data.uploads} onFilesSelected={onFilesSelected} />
              </section>
            </div>
          </>
        )}
      </PageTransition>
    </div>
  );
}

function EmptySection({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground",
        compact ? "py-6" : "py-10",
      )}
    >
      {label}
    </div>
  );
}
