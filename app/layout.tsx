// app/layout.tsx

import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'Airbroke',
  description: 'Self-hosted, Cost-effective and Open Source Error Tracking.',
};

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-condensed',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-airbroke-900">
      <body className={`h-full antialiased ${robotoCondensed.className} ${robotoMono.variable}`}>{children}</body>
    </html>
  );
}
