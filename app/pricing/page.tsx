import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — PDF↔HTML Converter",
  description: "Free plan with 3 conversions per day. Pro plan at $4.99/mo for unlimited conversions, larger files, batch convert, and API access.",
};

const FREE_FEATURES = [
  "3 conversions per day",
  "Up to 10 MB per file",
  "PDF → HTML conversion",
  "HTML → PDF conversion (A4)",
  "Files stored for 1 hour",
];

const PRO_FEATURES = [
  "Unlimited conversions",
  "Up to 100 MB per file",
  "All page sizes (A4, Letter, A3)",
  "Batch convert (up to 10 files)",
  "30-day conversion history",
  "API access with key",
  "No ads",
  "Files stored for 7 days",
  "Priority processing queue",
];

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Simple pricing</h1>
        <p className="mt-3 text-gray-500">Start free. Upgrade when you need more.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Free */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-bold text-gray-900">Free</h2>
          <p className="text-4xl font-bold text-gray-900 mt-4">
            $0
            <span className="text-base font-normal text-gray-400">/mo</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">No signup required</p>

          <ul className="mt-8 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/pdf-to-html"
            className="mt-8 block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Start converting free
          </Link>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>

          <h2 className="text-xl font-bold text-gray-900">Pro</h2>
          <p className="text-4xl font-bold text-gray-900 mt-4">
            $4.99
            <span className="text-base font-normal text-gray-400">/mo</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>

          <ul className="mt-8 space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-blue-600 shrink-0 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">FAQ</h2>
        <div className="space-y-6 max-w-2xl mx-auto">
          {[
            {
              q: "Do I need to sign up?",
              a: "No. The free tier works entirely without an account. You just upload and convert.",
            },
            {
              q: "How long are my files stored?",
              a: "Free: 1 hour. Pro: 7 days. Files are permanently deleted after expiry.",
            },
            {
              q: "What does API access include?",
              a: "Pro users get an API key and can hit our convert endpoints programmatically with up to 500 requests/day.",
            },
            {
              q: "Can I cancel my Pro subscription?",
              a: "Yes, any time. You keep Pro access until the end of your billing period.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 text-sm">{q}</h3>
              <p className="mt-2 text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
