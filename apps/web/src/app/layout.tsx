import type { Metadata } from 'next';
import './globals.css';
import { AGGridInitializer } from '@/lib/ag-grid-init';

export const metadata: Metadata = {
  title: 'Trading Blotter',
  description: 'Professional trading order management system with hierarchical order structure and real-time updates',
  keywords: 'trading, orders, blotter, financial, real-time, hierarchy, client orders, algo orders, market orders',
  authors: [{ name: 'Trading Platform Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Trading Blotter - Order Management System',
    description: 'High-performance hierarchical order management system',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e293b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-mono bg-[hsl(var(--trading-bg))] text-[hsl(var(--trading-text))]">
        <AGGridInitializer>
          {children}
        </AGGridInitializer>
      </body>
    </html>
  );
}