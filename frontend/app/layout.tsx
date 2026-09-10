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
    default: "ANVYRA | Built For Legacy",
    template: "%s | ANVYRA",
  },
  description:
    "Premium fashion and lifestyle brand. Luxury streetwear crafted for timeless design, premium quality and confidence.",
  keywords: ["ANVYRA", "luxury fashion", "premium streetwear", "lifestyle brand"],
  openGraph: {
    title: "ANVYRA | Built For Legacy",
    description: "Premium fashion and lifestyle brand.",
    type: "website",
    locale: "en_US",
    siteName: "ANVYRA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANVYRA | Built For Legacy",
    description: "Premium fashion and lifestyle brand.",
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
      <body className="min-h-screen bg-white text-black antialiased">
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
