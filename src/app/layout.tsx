import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cemilan Teh Risma — Keripik Kimpul Gurih, Bikin Nagih!',
  description:
    'Keripik Kimpul / Talas Balitung super renyah dari Bogor. Tersedia 3 varian rasa: Original, BBQ Pedas, dan Jagung Manis. Mulai Rp 26.400. Pesan lewat WhatsApp!',
  keywords: ['keripik kimpul', 'cemilan teh risma', 'keripik talas', 'keripik bogor', 'keripik bbq', 'keripik jagung', 'cemilan renyah'],
  openGraph: {
    title: 'Cemilan Teh Risma — Keripik Kimpul',
    description: 'Gurih, Bikin Nagih! Keripik Kimpul Talas Balitung dari Bogor',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFBF5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: 'rgba(30, 13, 0, 0.95)',
              color: '#FFF8F0',
              border: '1px solid rgba(212, 160, 23, 0.3)',
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#D4A017', secondary: '#050200' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#050200' },
            },
          }}
        />
      </body>
    </html>
  );
}
