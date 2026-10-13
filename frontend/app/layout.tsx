import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

// ── DM Sans — clean modern body font ─────────────────────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// ── Space Grotesk — geometric display/UI font ─────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// ── Playfair Display — luxury serif for hero headings ────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const BASE_URL = "https://anvyra-klb2.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ANVYRA FASHION — Founded by Akanksha Deshmukh | Dress The Story",
    template: "%s | ANVYRA FASHION",
  },
  description:
    "ANVYRA FASHION is a premium Indian fashion brand founded by Akanksha Deshmukh in 2025, Pune. Shop premium jackets, oversized tees, shirts, trousers and jeans. Dress the Story.",
  keywords: [
    "ANVYRA",
    "ANVYRA FASHION",
    "Akanksha Deshmukh",
    "ANVYRA founder Akanksha Deshmukh",
    "ANVYRA fashion brand",
    "premium Indian fashion",
    "Indian fashion brand Pune",
    "dress the story",
    "premium streetwear India",
    "oversized t-shirts India",
    "premium jackets India",
    "fashion e-commerce India",
  ],
  authors: [
    {
      name: "Akanksha Deshmukh",
      url: "https://www.linkedin.com/in/akanksha-deshmukh-26210b244/",
    },
  ],
  creator: "Akanksha Deshmukh",
  publisher: "ANVYRA FASHION",
  category: "Fashion",
  openGraph: {
    title: "ANVYRA FASHION — Founded by Akanksha Deshmukh | Dress The Story",
    description:
      "ANVYRA FASHION is a premium Indian fashion brand founded by Akanksha Deshmukh in Pune, 2025. Shop jackets, tees, shirts, trousers and jeans.",
    type: "website",
    locale: "en_IN",
    siteName: "ANVYRA FASHION",
    url: BASE_URL,
    images: [
      {
        url: "/logos/Gold_on_Black.png",
        width: 1200,
        height: 630,
        alt: "ANVYRA FASHION — Founded by Akanksha Deshmukh | Dress The Story",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ANVYRA FASHION — Founded by Akanksha Deshmukh",
    description:
      "Premium Indian fashion brand by Akanksha Deshmukh. Dress the Story.",
    images: ["/logos/Gold_on_Black.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "sfTbEOxmbZGct1kCWGD5JN7XU4wTfU_x5D--B6X-OAM",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// JSON-LD — tells Google: ANVYRA FASHION was founded by Akanksha Deshmukh in Pune in 2025
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "ANVYRA FASHION",
      alternateName: "ANVYRA",
      description:
        "ANVYRA FASHION is a premium Indian fashion brand founded by Akanksha Deshmukh in 2025. Dress the Story.",
      url: BASE_URL,
      foundingDate: "2025",
      foundingLocation: {
        "@type": "Place",
        name: "Pune, Maharashtra, India",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logos/anvyra-badge.png`,
      },
      founder: {
        "@type": "Person",
        name: "Akanksha Deshmukh",
        jobTitle: "Founder & Full Stack Engineer",
        sameAs: [
          "https://www.linkedin.com/in/akanksha-deshmukh-26210b244/",
          "https://github.com/akankshad1712",
        ],
      },
      sameAs: [
        "https://github.com/akankshad1712/ANVYRA",
        "https://www.linkedin.com/in/akanksha-deshmukh-26210b244/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "ANVYRA FASHION",
      description:
        "Premium Indian Fashion — Dress the Story. Founded by Akanksha Deshmukh.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#F7F3EE] text-[#3D1A0A] antialiased font-sans">
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
