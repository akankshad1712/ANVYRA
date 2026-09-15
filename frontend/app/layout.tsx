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

export const metadata: Metadata = {
  title: {
    default: "ANVYRA | Style Meets You",
    template: "%s | ANVYRA",
  },
  description:
    "ANVYRA — Style Meets You. Premium fashion and lifestyle crafted for timeless design, quality and confidence.",
  keywords: ["ANVYRA", "luxury fashion", "premium streetwear", "lifestyle brand", "style meets you"],
  openGraph: {
    title: "ANVYRA | Style Meets You",
    description: "Style Meets You. Premium fashion and lifestyle brand.",
    type: "website",
    locale: "en_US",
    siteName: "ANVYRA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANVYRA | Style Meets You",
    description: "Style Meets You. Premium fashion and lifestyle brand.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
