import type { Metadata, Viewport } from "next";
// @ts-expect-error Next.js handles global CSS imports at build time.
import "./globals.css";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: config.siteTitle,
  description: config.siteDescription,
  openGraph: {
    title: config.siteTitle,
    description: config.siteDescription,
    type: "website",
    locale: "id_ID",
    // Tambahkan gambar preview WhatsApp: taruh public/og.jpg (1200x630), lalu aktifkan baris ini
    // images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300;1,500&family=Jost:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
