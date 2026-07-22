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

interface ExecutiveDashboardProps {
  data?: ObservabilitySnapshot | null;
  loading?: boolean;
  className?: string;
  onFilesSelected?: (files: FileList) => void;
}

/**
 * Premium executive composition.
 * Accepts a full ObservabilitySnapshot (or null while loading).
 * Every child is independently replaceable and driven solely by props.
 */
export function ExecutiveDashboard({
  data,
  loading = false,
  className,
  onFilesSelected,
}: ExecutiveDashboardProps) {
  return (
    <div className={cn("relative min-h-screen bg-[#060d18] text-slate-100", className)}>
      <LoadingOverlay visible={loading} />

      <PageTransition className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400/80">
              Equipment Observability
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              Executive View
            </h1>
          </div>
          {data?.lastUpdated && (
            <p className="text-xs text-slate-500 tabular-nums">
              Last update · {new Date(data.lastUpdated).toLocaleString()}
            </p>
          )}
        </header>

        {/* KPI row */}
        {data?.kpis && <KpiGrid items={data.kpis} />}

        {/* Main grid: Twin + Spectrum + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4">
            {data?.equipment && (
              <MotorDigitalTwin state={data.equipment} className="h-full min-h-[380px]" />
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            <SpectrumWaterfall frame={data?.spectrum} height={180} />
            {data?.telemetry && <TelemetryGrid channels={data.telemetry} />}
          </div>

          <div className="lg:col-span-3 space-y-5">
            <section className="rounded-xl border border-white/8 bg-[#0a1424]/70 p-4">
              <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Status Timeline
              </h2>
              {data?.timeline && <EquipmentTimeline events={data.timeline} />}
            </section>
          </div>
        </div>

        {/* Lower row: Validation + Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="rounded-xl border border-white/8 bg-[#0a1424]/70 p-4">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Validation Results
            </h2>
            {data?.validation && <ValidationResultsPanel results={data.validation} />}
          </section>

          <section className="rounded-xl border border-white/8 bg-[#0a1424]/70 p-4">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Signal Capture Upload
            </h2>
            <UploadPanel items={data?.uploads} onFilesSelected={onFilesSelected} />
          </section>
        </div>
      </PageTransition>
    </div>
  );
}
