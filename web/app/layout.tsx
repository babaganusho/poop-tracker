import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { pick } from "@/lib/puns";
import RegisterServiceWorker from "./register-sw";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#92400e",
};

export function generateMetadata(): Metadata {
  return {
    title: pick("appTitle"),
    description: "Log a daily weight reading and compare with other users.",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/apple-touch-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-100">
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
