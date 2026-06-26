export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  step: string;
  progress: number;
  outputUrl?: string;
  outputSize?: number;
  expiresAt?: string;
  error?: string;
  createdAt: number;
}

// In-memory store for dev / single-instance.
// In production swap this with Vercel KV or Upstash Redis.
const jobs = new Map<string, Job>();

export function createJob(id: string): Job {
  const job: Job = {
    id,
    status: "pending",
    step: "Queued",
    progress: 0,
    createdAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

export function updateJob(id: string, patch: Partial<Job>): Job | null {
  const job = jobs.get(id);
  if (!job) return null;
  const updated = { ...job, ...patch };
  jobs.set(id, updated);
  return updated;
}

export function getJob(id: string): Job | null {
  return jobs.get(id) ?? null;
}

export function generateJobId(): string {
  return `job_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

// Clean up jobs older than 2 hours from memory
export function pruneJobs(): void {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, job] of jobs.entries()) {
    if (job.createdAt < cutoff) jobs.delete(id);
  }
}
