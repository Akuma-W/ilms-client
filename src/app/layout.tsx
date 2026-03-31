import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SWRProvider } from '@/features/providers/swr-provider';

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | KEIVerse',
    default: 'KEIVerse',
  },
  description: 'Kết nối tri thức. Khám phá hành trình học tập!',
  icons: {
    icon: [
      {
        url: '/images/logo.svg',
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
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SWRProvider>{children}</SWRProvider>
        <Toaster position="top-right" richColors theme="light" duration={2000} />
      </body>
    </html>
  );
}
