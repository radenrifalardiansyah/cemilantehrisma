import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import SplashScreen from '@/components/SplashScreen';
import IOSInstallBanner from '@/components/IOSInstallBanner';
import AndroidInstallBanner from '@/components/AndroidInstallBanner';
import ScrollToTop from '@/components/ScrollToTop';
import { Analytics } from '@vercel/analytics/next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import VisitorTracker from '@/components/VisitorTracker';
import { logoVariant } from '@/lib/branding';
import { getCachedBranding } from '@/lib/server/branding';
import { BrandingProvider } from '@/lib/useLiveBranding';
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

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getCachedBranding();
  const iconBase = branding.logoUrl;
  return {
    metadataBase: new URL(branding.siteUrl),
    title: {
      default: branding.seoTitle,
      template: `%s | ${branding.brandName}`,
    },
    description: branding.seoDescription || undefined,
    keywords: branding.seoKeywords.length ? branding.seoKeywords : undefined,
    authors: [{ name: branding.legalName }],
    creator: branding.legalName,
    publisher: branding.legalName,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: branding.seoTitle,
      description: branding.seoDescription || undefined,
      type: 'website',
      locale: 'id_ID',
      siteName: branding.brandName,
      url: branding.siteUrl,
      images: [{ url: logoVariant(iconBase, 512) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: branding.seoTitle,
      description: branding.seoDescription || undefined,
    },
    alternates: {
      canonical: branding.siteUrl,
    },
    verification: branding.googleSiteVerification
      ? { google: branding.googleSiteVerification }
      : undefined,
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      title: branding.brandName,
      statusBarStyle: 'default',
    },
    icons: {
      apple: logoVariant(iconBase, 180),
      icon: [
        { url: logoVariant(iconBase, 192), sizes: '192x192', type: 'image/png' },
        { url: logoVariant(iconBase, 512), sizes: '512x512', type: 'image/png' },
      ],
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const branding = await getCachedBranding();
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: branding.themeColor,
    viewportFit: 'cover',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const branding = await getCachedBranding();
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={branding.brandName} />
      </head>
      <body className="antialiased">
        <BrandingProvider value={branding}>
        <LanguageProvider>
        <AuthProvider>
        <SplashScreen />
        <IOSInstallBanner />
        <AndroidInstallBanner />
        <ScrollToTop />
        <VisitorTracker />
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
        </AuthProvider>
        </LanguageProvider>
        </BrandingProvider>
        <Analytics />
      </body>
    </html>
  );
}
