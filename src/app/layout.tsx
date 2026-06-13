import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TBP Global Strategists",
    template: "%s | TBP Global Strategists",
  },
  description:
    "Empowering global enterprises and visionary strategists to navigate complexity, drive innovation, and shape the future of business.",
  keywords: [
    "strategy",
    "consulting",
    "innovation",
    "global business",
    "TBP",
    "strategists",
  ],
  authors: [{ name: "TBP Global Strategists" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TBP Global Strategists",
    title: "TBP Global Strategists",
    description:
      "Empowering global enterprises and visionary strategists to navigate complexity, drive innovation, and shape the future of business.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
