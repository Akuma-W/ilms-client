import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "KEIVerse",
  description: "Kết nối tri thức. Khám phá hành trình học tập!",
  icons: {
    icon: [
      {
        url: '/images/logo.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors theme="light" />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
