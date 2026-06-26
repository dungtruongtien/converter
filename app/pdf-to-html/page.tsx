import type { Metadata } from "next";
import { ConverterForm } from "@/components/converter-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "PDF to HTML Converter — Free Online Tool",
  description:
    "Convert PDF to HTML online for free. Preserves layout, fonts, and images. No signup. Files deleted in 1 hour.",
};

export default function PdfToHtmlPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-100 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">PDF → HTML Converter</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Upload a PDF and get clean, responsive HTML. Free · No signup · Files deleted in 1 hr.
        </p>
      </div>
      <ConverterForm mode="pdf-to-html" />
      <RelatedTools current="pdf-to-html" />
    </>
  );
}
