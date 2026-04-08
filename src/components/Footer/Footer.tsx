'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { useSite } from '@/context/SiteContext';
import { useAuth } from '@/context/AuthContext';


const USEFUL_LINKS = [
  { href: '/about', label: 'About CushionGuru' },
  { href: '/how-to-measure', label: 'How To Measure' },
  { href: '/terms', label: 'Terms & Condition' },
  { href: '/cleaning', label: 'Cleaning' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
];

const SOCIAL = [
  { href: 'https://www.linkedin.com/company/cushion-guru/', label: 'LinkedIn', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg> },
  { href: 'https://www.instagram.com/cushiongurullc/', label: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
  { href: 'https://www.facebook.com/people/Cushion-Guru/61554651403990/', label: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
  // { href: 'https://twitter.com', label: 'Twitter/X', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { href: 'https://pin.it/1szMzWT', label: 'Pinterest', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.373 23.178c-.1-.937-.19-2.378.04-3.402.21-.906 1.41-5.98 1.41-5.98s-.36-.72-.36-1.786c0-1.673.97-2.924 2.176-2.924 1.027 0 1.524.77 1.524 1.695 0 1.032-.658 2.577-.998 4.008-.284 1.197.6 2.173 1.779 2.173 2.135 0 3.779-2.249 3.779-5.498 0-2.876-2.066-4.884-5.015-4.884-3.415 0-5.42 2.56-5.42 5.207 0 1.03.397 2.133.893 2.736a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24a12 12 0 0 0 0-24z" /></svg> },
  { href: 'https://www.youtube.com/channel/UCcdDcKJ-uTH8lIIO6CgjXxA', label: 'YouTube', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46A2.78 2.78 0 0 0 22.54 17.58 29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg> },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { siteName, logoUrl, siteTagline, initialized } = useSite();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSent(true);
    } catch (err) { }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <Link href="/" className={styles.brandLogo}>
                {!initialized
                  ? <span style={{ display: 'inline-block', width: '100px', height: '28px' }} />
                  : <>
                    {logoUrl
                      ? <img src={logoUrl} alt={siteName} style={{ height: '36px', width: 'auto', objectFit: 'contain', maxWidth: '150px' }} />
                      : <span>🛋️</span>
                    }
                    {siteName && <span>{siteName}</span>}
                  </>
                }
              </Link>
              <p>{siteTagline || 'Premium custom cushions crafted for comfort, style, and lasting performance. Powered by Sunbrella® fabrics.'}</p>
              <div className={styles.socialRow}>
                {SOCIAL.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className={styles.colTitle}>Useful Links</h4>
              <ul className={styles.links}>
                {USEFUL_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.footerLink}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className={styles.colTitle}>Contact Info</h4>
              <ul className={styles.contactList}>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>328 Stewart Avenue, Bethpage, New York 11714</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <a href="mailto:contact@cushionguru.com" target="_blank" rel="noopener noreferrer">contact@cushionguru.com</a>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  <a href="https://cushionguru.com" target="_blank" rel="noopener noreferrer">cushionguru.com</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className={styles.colTitle}>Follow Us</h4>
              <p className={styles.newsText}>Stay updated with our latest collections and exclusive offers.</p>
              {sent ? (
                <div className="alert alert-success" style={{ padding: '0.75rem', fontSize: '0.85rem' }}>🎉 Thanks for subscribing!</div>
              ) : (
                <form className={styles.newsForm} onSubmit={handleSubscribe}>
                  <input type="email" placeholder="Email address" className={styles.newsInput} id="footer-newsletter" value={email} onChange={e => setEmail(e.target.value)} required />
                  <button type="submit" className="btn btn-accent btn-sm">Join</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p>© Copyright {year} — <strong>CushionGuru LLC – New York</strong>. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms">Terms</Link>
            <span>·</span>
            <Link href="/contact">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
