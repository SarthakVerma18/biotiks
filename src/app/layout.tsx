import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import DNAHelix from '@/components/DNAHelix';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Biotiks — Competitive Biology Quiz E-Sport',
  description: 'Gamify your biology learning! Challenge your bio IQ in timed rounds, earn XP, maintain streaks, and climb global leaderboards.',
  keywords: ['biology', 'quiz', 'e-sport', 'science', 'game', 'learn'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Navbar />
        <DNAHelix />
        <main style={{ minHeight: 'calc(100vh - var(--navbar-height))', paddingTop: 'var(--navbar-height)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
