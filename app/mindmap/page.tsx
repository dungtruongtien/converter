import type { Metadata } from "next";
import MindmapClient from "@/components/MindmapClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Mind Map Maker — Free Online Visual Brainstorming Tool",
  description: "Create, edit, and export mind maps in your browser. No signup needed. Drag to pan, scroll to zoom, keyboard shortcuts for fast editing. Save and share as JSON.",
  keywords: ["mind map maker", "free mind map", "online mindmap", "brainstorming tool", "concept map", "mind mapping software", "mindmap json export"],
  alternates: { canonical: "/mindmap" },
  openGraph: { type: "website", url: `${siteUrl}/mindmap`, siteName: "Gadify", title: "Mind Map Maker — Free Online Tool", description: "Visual brainstorming in your browser. Pan, zoom, add/delete nodes, export JSON.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Mind Map Maker — Free Online Tool", description: "Create mind maps in the browser. Export and import JSON. Free, no signup." },
};

const faqs = [
  { q: "Does my mind map get saved automatically?", a: "Yes. Every change is saved to your browser's localStorage immediately. Your map will still be there if you close the tab and come back later." },
  { q: "How do I export and import a mind map?", a: "Click 'Export JSON' in the toolbar to download your map as a .json file. To restore it, click 'Import JSON' and select the file. The JSON format is a simple nested tree — easy to edit in any text editor." },
  { q: "What keyboard shortcuts are available?", a: "Tab adds a child to the selected node, Enter adds a sibling, F2 renames, Delete removes a node, and scroll wheel zooms in/out. Drag an empty area to pan around." },
  { q: "Can I share my mind map with others?", a: "Export the JSON file and send it. Anyone can import it with the Import JSON button. There is no server storage, so your data stays private on your own device." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Mind Map Maker", url: `${siteUrl}/mindmap`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free browser-based mind map tool with pan/zoom, keyboard shortcuts, and JSON export/import." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to create a mind map online", step: [{ "@type": "HowToStep", position: 1, name: "Select a node", text: "Click any node to select it. The root node is selected by default." }, { "@type": "HowToStep", position: 2, name: "Add children", text: "Press Tab or click 'Add Child' to add a child node to the selected node." }, { "@type": "HowToStep", position: 3, name: "Rename nodes", text: "Double-click or press F2 to rename the selected node inline." }, { "@type": "HowToStep", position: 4, name: "Export your map", text: "Click 'Export JSON' to download your mind map as a JSON file." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Mind Map Maker", item: `${siteUrl}/mindmap` }] },
];

export default function MindmapPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Mind Map Maker</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">Visual brainstorming in your browser. Pan, zoom, add nodes with keyboard shortcuts. Auto-saves locally. Export and import JSON.</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {["Auto-save", "JSON export/import", "Keyboard shortcuts", "Pan & zoom", "No signup"].map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tool */}
      <MindmapClient />

      {/* FAQ */}
      <section className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <dl className="space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-gray-900 mb-1">{q}</dt>
                <dd className="text-gray-500 text-sm leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Related tools */}
      <RelatedTools current="mindmap" />
    </>
  );
}
