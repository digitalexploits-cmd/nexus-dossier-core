import { useMemo, useState } from "react";
import { ExecutiveDashboard } from "@/components/observability";
import { mockSnapshot } from "@/data/mockObservability";
import { adaptObservabilityPayload } from "@/services/observabilityAdapter";
import type { ObservabilitySnapshot } from "@/types/observability";

/**
 * Standalone preview route: /observability-demo
 * Renders the premium ExecutiveDashboard against the mock snapshot
 * through the official adapter boundary so the path is identical
 * to a future live backend.
 */
export default function ObservabilityDemo() {
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Run the mock through the same adapter a real backend would use
  const adapted = useMemo(() => adaptObservabilityPayload(mockSnapshot), []);

  const data: ObservabilitySnapshot | null = adapted.ok ? adapted.data : null;
  const adapterError = adapted.ok ? null : adapted.error;

  const handleFiles = (_files: FileList) => {
    // Demo only – surface a graceful upload-failure state
    setUploadError("Upload service not connected in demo mode. Backend team will wire this.");
    setTimeout(() => setUploadError(null), 5000);
  };

  return (
    <div className="relative min-h-screen">
      {adapterError && (
        <div className="fixed top-4 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-rose-500/40 bg-rose-950/90 px-4 py-2 text-sm text-rose-200 shadow-lg">
          Adapter error: {adapterError}
        </div>
      )}
      {uploadError && (
        <div className="fixed top-4 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-amber-500/40 bg-amber-950/90 px-4 py-2 text-sm text-amber-200 shadow-lg">
          {uploadError}
        </div>
      )}

      <ExecutiveDashboard
        data={data}
        loading={false}
        onFilesSelected={handleFiles}
        partial={adapted.ok ? adapted.partial : false}
        errorMessage={adapterError}
      />
    </div>
  );
}
