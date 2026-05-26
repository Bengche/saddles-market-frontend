import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import { SITE_CONFIG } from '@/lib/siteConfig';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — Premium Horse Saddles`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.seo.defaultDescription,
  keywords: SITE_CONFIG.seo.keywords,
  openGraph: {
    type: 'website',
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — Premium Horse Saddles`,
    description: SITE_CONFIG.seo.defaultDescription,
    url: SITE_CONFIG.url,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — Premium Horse Saddles`,
    description: SITE_CONFIG.seo.defaultDescription,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.pwa.themeColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-cream-100 font-sans antialiased" suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Header />
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
                <CookieConsent />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
