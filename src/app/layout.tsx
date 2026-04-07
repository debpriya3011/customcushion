import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { SiteProvider } from '@/context/SiteContext';
import CookieConsent from '@/components/CookieConsent/CookieConsent';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteProvider>
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
