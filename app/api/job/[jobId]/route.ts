import { NextRequest, NextResponse } from "next/server";
import { getJob, pruneJobs } from "@/lib/jobs";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobId || !jobId.startsWith("job_")) {
    return NextResponse.json({ error: "INVALID_JOB_ID" }, { status: 400 });
  }

  pruneJobs();

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  if (job.status === "done") {
    return NextResponse.json({
      status: "done",
      outputUrl: job.outputUrl,
      outputSize: job.outputSize,
      expiresAt: job.expiresAt,
    });
  }

  if (job.status === "failed") {
    return NextResponse.json({
      status: "failed",
      error: job.error ?? "Conversion failed",
    });
  }

  return NextResponse.json({
    status: job.status,
    step: job.step,
    progress: job.progress,
  });
}
