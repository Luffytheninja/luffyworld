import type { Metadata, Viewport } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import VercelAnalytics from "@/components/layout/VercelAnalytics";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luffy World",
  description: "This is how I spend my time when nothing is required of me. Sound, screens, solitude, and motion.",
  keywords: ["Luffy", "3D", "experiential", "portfolio", "brutalist", "tech", "music", "anime"],
  openGraph: {
    title: "Luffy World",
    description: "Sound, screens, solitude, and motion.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1C1C1C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${ibmPlexMono.variable}`}>
      <body className="font-mono antialiased bg-charcoal text-bone min-h-screen overflow-x-hidden">
        <main className="relative min-h-screen">
          {children}
        </main>
        <VercelAnalytics />
      </body>
    </html>
  );
}
