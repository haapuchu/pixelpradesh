import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FAFAF9",
};

export const metadata: Metadata = {
  title: "PixelPradesh — Autonomous Regional Media Localization Engine",
  description:
    "Transform 1 master product photo into a 12-variant regional festive ad matrix across India's cultural markets, scripts, and channels.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
        {children}
      </body>
    </html>
  );
}
