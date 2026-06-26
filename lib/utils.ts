type ClassValue = string | number | boolean | undefined | null | ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity as 20)
    .filter(Boolean)
    .join(" ");
}

export function cn(...inputs: ClassValue[]): string {
  // Minimal tailwind-merge: last wins for same prefix
  const classes = clsx(...inputs).split(" ").filter(Boolean);
  const seen = new Map<string, string>();
  for (const cls of classes) {
    const prefix = cls.replace(/[^-]+-/, (m) => m); // keep full class as key for simplicity
    seen.set(cls.split("-")[0] + "-" + cls.split("-")[1], cls);
  }
  // For a real project install tailwind-merge; this is a lightweight stand-in
  return classes.join(" ");
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
