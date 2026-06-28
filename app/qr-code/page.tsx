import type { Metadata } from "next";
import QrCodeClient from "@/components/QrCodeClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online, 10 Types",
  description: "Generate QR codes for URLs, Wi-Fi, contacts (vCard), email, SMS, phone, VietQR payments, calendar events, and geo locations. Free, no signup, runs in your browser.",
  keywords: ["qr code generator", "qr code maker", "wifi qr code", "vcard qr code", "vietqr generator", "qr code url", "free qr code", "qr code online", "contact qr code"],
  alternates: { canonical: "/qr-code" },
  openGraph: { type: "website", url: `${siteUrl}/qr-code`, siteName: "Gadify", title: "QR Code Generator — Free, 10 Types", description: "URL, Wi-Fi, vCard, email, SMS, VietQR, calendar, geo. Customise colors and download PNG.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "QR Code Generator — Free Online Tool", description: "Generate QR codes for URLs, Wi-Fi, contacts, VietQR payments, and more. Download PNG free." },
};

const faqs = [
  { q: "Are QR codes generated on the server?", a: "No. QR codes are generated entirely in your browser using the open-source qrcode.js library. Nothing is uploaded or stored." },
  { q: "What is a Wi-Fi QR code?", a: "A Wi-Fi QR code encodes your network name, password, and security type. When scanned, most phones will automatically connect without typing the password." },
  { q: "What is VietQR?", a: "VietQR is the standard QR code format for Vietnamese bank transfers. Scanning one opens the bank app pre-filled with the recipient's account number, bank, and amount. It's supported by all major Vietnamese banks and e-wallets." },
  { q: "What is a vCard QR code?", a: "A vCard QR code encodes contact information (name, phone, email, address). Scanning it gives the recipient an option to add the contact directly to their phone." },
  { q: "What do the error correction levels mean?", a: "Error correction allows a QR code to be scanned even if part of it is damaged or obscured. L=7%, M=15%, Q=25%, H=30% of the code can be recovered. Higher levels make the QR code denser but more robust." },
  { q: "Can I use the generated QR code commercially?", a: "Yes. There are no restrictions on using QR codes you generate here, including for commercial products, print, or digital media." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "QR Code Generator", url: `${siteUrl}/qr-code`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free QR code generator supporting 10 types: URL, Wi-Fi, vCard, email, SMS, phone, VietQR, calendar, geo. Customise colors and download PNG." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to create a QR code online", step: [{ "@type": "HowToStep", position: 1, name: "Choose QR type", text: "Select from URL, Wi-Fi, Contact, Email, SMS, Phone, Payment, Calendar, or Geo." }, { "@type": "HowToStep", position: 2, name: "Fill in the details", text: "Enter the relevant information for your chosen QR type." }, { "@type": "HowToStep", position: 3, name: "Customise appearance", text: "Choose foreground and background colors, size, and error correction level." }, { "@type": "HowToStep", position: 4, name: "Download", text: "Click Download PNG to save your QR code." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "QR Code Generator", item: `${siteUrl}/qr-code` }] },
];

export default function QrCodePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">QR Code Generator</h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-4">Generate QR codes for 10 different types — URLs, Wi-Fi, contacts, email, SMS, VietQR payments, calendar events, and more.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["URL", "Wi-Fi", "vCard", "Email", "SMS", "VietQR", "Calendar", "Geo"].map((tag) => (
              <span key={tag} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-100">{tag}</span>
            ))}
          </div>
        </div>
      </section>
      <QrCodeClient />
      <section className="max-w-4xl mx-auto px-4 py-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </section>
      <RelatedTools current="qr-code" />
    </>
  );
}
