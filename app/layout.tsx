import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Airbroke',
  description: 'Self-hosted, Cost-effective, Open Source Error Tracking for a Sustainable Startup Journey.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-airbroke-900">
      <body className={`h-full antialiased scrollbar-none ${inter.className}`}>{children}</body>
    </html>
  );
}
