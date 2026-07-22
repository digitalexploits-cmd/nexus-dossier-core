import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileAudio, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadItem } from "@/types/observability";

interface UploadPanelProps {
  items?: UploadItem[];
  onFilesSelected?: (files: FileList) => void;
  className?: string;
  accept?: string;
  maxSizeMb?: number;
}

/**
 * Presentational upload panel. Does not perform real uploads.
 * Calls onFilesSelected with the browser FileList so a parent
 * (or future backend adapter) can handle the actual transfer.
 */
export function UploadPanel({
  items = [],
  onFilesSelected,
  className,
  accept = ".bin,.raw,.wav,.csv,.parquet",
  maxSizeMb = 128,
}: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length && onFilesSelected) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && onFilesSelected) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-amber-400/60 bg-amber-400/5"
            : "border-white/10 bg-[#0a1424]/60 hover:border-white/20",
        )}
      >
        <Upload className="h-8 w-8 text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-200">Drop signal captures here</p>
        <p className="mt-1 text-xs text-slate-500">
          or click to browse · max {maxSizeMb} MB · {accept}
        </p>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-lg border border-white/8 bg-[#0c1829]/80 px-3 py-2.5"
          >
            <FileAudio className="h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-200">{item.filename}</p>
              <p className="text-[10px] text-slate-500">
                {(item.sizeBytes / 1024 / 1024).toFixed(1)} MB
              </p>
              {item.status === "uploading" || item.status === "processing" ? (
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress ?? 0}%` }}
                  />
                </div>
              ) : null}
            </div>
            <StatusIcon status={item.status} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StatusIcon({ status }: { status: UploadItem["status"] }) {
  if (status === "complete") return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  if (status === "error") return <AlertCircle className="h-4 w-4 text-rose-400" />;
  if (status === "uploading" || status === "processing")
    return <Loader2 className="h-4 w-4 animate-spin text-amber-400" />;
  return <div className="h-4 w-4 rounded-full border border-slate-600" />;
}
