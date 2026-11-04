import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Montserrat is loaded locally rather than via next/font/google: the Google
// loader breaks the Turbopack production build on Vercel ("next/font/google
// queries have exactly one entry" for the @vercel/turbopack-next internal
// font module). This is the latin variable font file from Google Fonts
// (v31), which covers the full 400–700 weight range we use — same glyphs,
// same look, no build-time network fetch.
const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  variable: "--font-montserrat",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Norbielink",
  description: "Norbielink Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=agriculture" />
      </head>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
