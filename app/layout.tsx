import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IntroOverlay } from "./intro-overlay";
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
  title: "TBM SHIPPING",
  description: "TBM SHIPPING — 물류의 모든 단계에서 신뢰를 더합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <IntroOverlay />
        {children}
      </body>
    </html>
  );
}
