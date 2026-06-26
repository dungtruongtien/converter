"use client";

import { useCallback, useState } from "react";
import { formatBytes } from "@/lib/utils";

interface UploadZoneProps {
  accept: string;
  maxSizeMb?: number;
  label: string;
  hint?: string;
  onFile: (file: File) => void;
}

export function UploadZone({ accept, maxSizeMb = 10, label, hint, onFile }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<File | null>(null);

  const validate = useCallback(
    (file: File): string | null => {
      const acceptedTypes = accept.split(",").map((s) => s.trim());
      const typeOk = acceptedTypes.some((t) => {
        if (t.startsWith(".")) return file.name.toLowerCase().endsWith(t);
        if (t.endsWith("/*")) return file.type.startsWith(t.replace("/*", ""));
        return file.type === t;
      });
      if (!typeOk) return `Invalid file type. Accepted: ${accept}`;
      if (file.size > maxSizeMb * 1024 * 1024) return `File too large. Max ${maxSizeMb} MB.`;
      return null;
    },
    [accept, maxSizeMb]
  );

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) { setError(err); return; }
      setError(null);
      setSelected(file);
      onFile(file);
    },
    [validate, onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <label
        className={[
          "block w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
          "p-10 text-center",
          dragging
            ? "border-blue-500 bg-blue-50 scale-[1.02]"
            : selected
            ? "border-emerald-400 bg-emerald-50"
            : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30",
        ].join(" ")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={onInputChange}
        />

        <div className="flex flex-col items-center gap-3">
          <span className={["text-4xl transition-transform", dragging ? "scale-125" : ""].join(" ")}>
            {selected ? "✅" : dragging ? "📂" : "📄"}
          </span>

          {selected ? (
            <div>
              <p className="font-medium text-gray-900">{selected.name}</p>
              <p className="text-sm text-gray-500">{formatBytes(selected.size)}</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-gray-700">{label}</p>
              <p className="text-sm text-gray-400 mt-1">
                {hint ?? `or click to browse · up to ${maxSizeMb} MB`}
              </p>
            </div>
          )}
        </div>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
