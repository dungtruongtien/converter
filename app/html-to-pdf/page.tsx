import type { Metadata } from "next";
import { ConverterForm } from "@/components/converter-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "HTML to PDF Converter — Free Online Tool",
  description:
    "Convert HTML to PDF online for free. Pixel-perfect rendering with full CSS support. No signup required.",
};

export default function HtmlToPdfPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-100 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">HTML → PDF Converter</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Paste HTML or upload a file and get a pixel-perfect PDF. Free · No signup · Files deleted in 1 hr.
        </p>
      </div>
      <ConverterForm mode="html-to-pdf" />
      <RelatedTools current="html-to-pdf" />
    </>
  );
}
