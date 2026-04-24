import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { SiteProvider } from '@/context/SiteContext';
import CookieConsent from '@/components/CookieConsent/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
});

import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: {
    default: 'CushionGuru – Custom Cushions, Factory Direct',
    template: '%s | CushionGuru',
  },
  description:
    'CushionGuru crafts premium custom cushions for indoor, outdoor, RV, boat, and pet use. Factory-direct pricing with Sunbrella fabrics. Free worldwide shipping.',
  keywords: [
    'custom cushions', 'outdoor cushions', 'sunbrella cushions', 'rv cushions',
    'boat cushions', 'pet beds', 'indoor cushions', 'cushion covers',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'CushionGuru',
    locale: 'en_US',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let siteName = '';
  let logoUrl = '';
  let siteTagline = '';

  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    
    siteName = map.siteName || '';
    logoUrl = map.logoUrl || map.siteLogo || '';
    siteTagline = map.siteTagline || '';
  } catch (error) {
    console.error('Failed to load settings in layout:', error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com" />
      </head>
      <body>
        <AuthProvider>
          <SiteProvider initialSettings={{ siteName, logoUrl, siteTagline, initialized: true }}>
            <CartProvider>
              <a href="#main-content" className="skip-link">Skip to content</a>
              <Navbar />
              <main id="main-content">{children}</main>
              <Footer />
              <CookieConsent />
            </CartProvider>
          </SiteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
