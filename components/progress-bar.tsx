"use client";

export interface ProgressStep {
  label: string;
  status: "done" | "active" | "waiting";
}

interface ProgressBarProps {
  steps: ProgressStep[];
  percent: number;
}

export function ProgressBar({ steps, percent }: ProgressBarProps) {
  return (
    <div className="space-y-4">
      {/* Linear bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Step list */}
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span
              className={[
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                step.status === "done"
                  ? "bg-emerald-100 text-emerald-600"
                  : step.status === "active"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400",
              ].join(" ")}
            >
              {step.status === "done" ? "✓" : i + 1}
            </span>

            <span
              className={[
                "flex-1",
                step.status === "done"
                  ? "text-gray-500 line-through"
                  : step.status === "active"
                  ? "text-gray-900 font-medium"
                  : "text-gray-400",
              ].join(" ")}
            >
              {step.label}
            </span>

            {step.status === "active" && (
              <span className="inline-flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
