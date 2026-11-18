import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import {
  DESCRIPTION,
  FAQ,
  GITHUB_ORG_URL,
  ICORETECH_URL,
  IMAGE_URL,
  LICENSE_URL,
  plainAnswer,
  RELEASES_URL,
  REPO_URL,
  SHARE_TITLE,
  SITE_URL,
  TITLE,
  X_HANDLE,
  X_URL,
} from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const OG_ALT =
  "A coral Airbroke ticket reading: Keep your SDKs. Own your errors. Self-hosted, open-source error catcher.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/`,
    types: { "text/plain": "/llms.txt" },
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Airbroke",
    locale: "en_US",
    title: SHARE_TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: OG_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    title: SHARE_TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", alt: OG_ALT }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16111f",
  colorScheme: "light",
};

// One structured-data graph: iCoreTech as publisher, Airbroke as the
// application, and the FAQ that is visible on the page.
const organization = "https://icorete.ch/#organization";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organization,
      name: "iCoreTech",
      legalName: "iCoreTech, Inc.",
      url: ICORETECH_URL,
      sameAs: [GITHUB_ORG_URL, X_URL],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Airbroke",
      url: `${SITE_URL}/`,
      description: DESCRIPTION,
      image: `${SITE_URL}/og.png`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux",
      softwareRequirements:
        "PostgreSQL 15 or later; Docker, Kubernetes with Helm, or Node.js 26.13.1 or later",
      downloadUrl: IMAGE_URL,
      releaseNotes: RELEASES_URL,
      license: LICENSE_URL,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": organization },
      publisher: { "@id": organization },
      sameAs: [REPO_URL],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      url: `${SITE_URL}/`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.a) },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from constants
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
