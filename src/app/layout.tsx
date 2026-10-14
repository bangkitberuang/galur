import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GALUR - Garis Alur, Ngajentrekeun Struktur | Diagram & Flowchart Builder',
  description: 'Garis Alur, Ngajentrekeun Struktur. Diagram alur teknis ala Visio dan Mind Map modern yang fleksibel.',
  icons: {
    icon: '/logo-v2.png',
    shortcut: '/logo-v2.png',
    apple: '/logo-v2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
