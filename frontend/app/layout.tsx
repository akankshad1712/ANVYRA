import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const BASE_URL = "https://anvyra-klb2.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ANVYRA — Dress the Story | Premium Indian Fashion",
    template: "%s | ANVYRA",
  },
  description:
    "ANVYRA is a premium Indian fashion brand founded by Akanksha Deshmukh. Shop premium jackets, oversized tees, shirts, trousers and jeans. Dress the Story.",
  keywords: [
    "ANVYRA",
    "Akanksha Deshmukh",
    "ANVYRA founder",
    "premium Indian fashion",
    "Indian fashion brand",
    "dress the story",
    "premium streetwear India",
    "oversized t-shirts",
    "premium jackets India",
    "fashion e-commerce India",
    "luxury fashion India",
  ],
  authors: [{ name: "Akanksha Deshmukh", url: "https://www.linkedin.com/in/akanksha-deshmukh-26210b244/" }],
  creator: "Akanksha Deshmukh",
  publisher: "ANVYRA",
  category: "Fashion",
  openGraph: {
    title: "ANVYRA — Dress the Story | Premium Indian Fashion",
    description:
      "ANVYRA is a premium Indian fashion brand founded by Akanksha Deshmukh. Shop jackets, tees, shirts, trousers and jeans.",
    type: "website",
    locale: "en_IN",
    siteName: "ANVYRA",
    url: BASE_URL,
    images: [
      {
        url: "/logos/Gold_on_Black.png",
        width: 1200,
        height: 630,
        alt: "ANVYRA — Dress the Story",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ANVYRA — Dress the Story | Premium Indian Fashion",
    description:
      "ANVYRA is a premium Indian fashion brand founded by Akanksha Deshmukh.",
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
    google: "", // add Google Search Console verification code here when ready
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data — tells Google who founded ANVYRA
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "ANVYRA",
      alternateName: "ANVYRA Fashion",
      description:
        "ANVYRA is a premium Indian fashion brand. Dress the Story.",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logos/anvyra-badge.png`,
      },
      founder: {
        "@type": "Person",
        name: "Akanksha Deshmukh",
        sameAs: [
          "https://www.linkedin.com/in/akanksha-deshmukh-26210b244/",
          "https://github.com/akankshad1712",
        ],
      },
      foundingLocation: {
        "@type": "Place",
        name: "Pune, India",
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
      name: "ANVYRA",
      description: "Premium Indian Fashion — Dress the Story",
      publisher: {
        "@id": `${BASE_URL}/#organization`,
      },
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
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* cream background — warm luxury base */}
      <body className="min-h-screen bg-[#F7F3EE] text-[#3D1A0A] antialiased">
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
