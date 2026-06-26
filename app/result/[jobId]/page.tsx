import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { getJob } from "@/lib/jobs";
import { formatBytes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Conversion Complete",
};

function timeUntilExpiry(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""}`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs !== 1 ? "s" : ""}`;
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) notFound();

  if (job.status === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Conversion failed</h1>
        <p className="text-gray-500 mb-8">{job.error ?? "An unexpected error occurred."}</p>
        <div className="flex justify-center gap-3">
          <Link href="/pdf-to-html" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
            Try PDF → HTML
          </Link>
          <Link href="/html-to-pdf" className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200">
            Try HTML → PDF
          </Link>
        </div>
      </div>
    );
  }

  if (job.status !== "done") {
    // Job still processing — client should have been polling; redirect back
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Still converting…</h1>
        <p className="text-gray-500">This page will reload automatically.</p>
        <meta httpEquiv="refresh" content="2" />
      </div>
    );
  }

  const isHtml = job.outputUrl?.endsWith(".html") || job.outputUrl?.includes(".html");
  const filename = isHtml ? `${jobId}.html` : `${jobId}.pdf`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">Conversion complete</h1>
        <p className="mt-2 text-gray-500 text-sm">
          {job.outputSize ? formatBytes(job.outputSize) : ""}{" "}
          {job.expiresAt ? `· expires in ${timeUntilExpiry(job.expiresAt)}` : ""}
        </p>
      </div>

      {/* Download card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center mb-4">
        <p className="text-sm text-gray-500 mb-1">Your file is ready</p>
        <p className="font-mono text-sm text-gray-900 mb-6">{filename}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href={job.outputUrl}
            download={filename}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            ⬇ Download
          </a>
          {job.outputUrl && (
            <a
              href={job.outputUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              👁 Preview
            </a>
          )}
          <CopyLinkButton url={job.outputUrl ?? ""} />
        </div>
      </div>

      {/* AdSense — best placement */}
      <AdSlot slot="3456789012" format="leaderboard" className="mb-6" />

      {/* Convert another */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600 mb-4 font-medium">Convert another file?</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/pdf-to-html" className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
            New PDF → HTML
          </Link>
          <Link href="/html-to-pdf" className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
            New HTML → PDF
          </Link>
        </div>
      </div>

      {/* AdSense rectangle */}
      <div className="mt-6">
        <AdSlot slot="4567890123" format="rectangle" className="mx-auto max-w-[300px]" />
      </div>

      {/* Related tools */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p className="mb-2 font-medium">Related tools coming soon</p>
        <p>Compress PDF · PDF to Word · PDF to Markdown · Merge PDF</p>
      </div>
    </div>
  );
}

// Client copy-link button — can't use "use client" in a server page so we inline it
function CopyLinkButton({ url }: { url: string }) {
  // This will be a server-rendered button; clicking uses a script tag
  return (
    <button
      onClick={undefined}
      data-copy-url={url}
      className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
      id="copy-link-btn"
    >
      🔗 Copy link
    </button>
  );
}
