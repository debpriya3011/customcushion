'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/hero', label: 'Hero Images', icon: '🖼️' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { href: '/admin/blogs', label: 'Blogs', icon: '📝' },
  { href: '/admin/products', label: 'Products', icon: '🛍️' },
  { href: '/admin/fabrics', label: 'Fabrics', icon: '🧵' },
  { href: '/admin/users', label: 'Users Data', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const CATEGORY_BANNERS = [
  { key: 'home_cat_indoorcushions', label: 'Custom Indoor Cushions' },
  { key: 'home_cat_outdoorcushions', label: 'Custom Outdoor Cushions' },
  { key: 'home_cat_rvcushions', label: 'Custom RV Cushions' },
  { key: 'home_cat_boatcushions', label: 'Custom Boat Cushions' },
  { key: 'home_cat_petbed', label: 'Custom Pet Bed' },
];

export default function AdminHeroPage() {
  const { user, logout, loading, refreshMedia } = useAuth();
  const router = useRouter();

  const [heroKey, setHeroKey] = useState(CATEGORY_BANNERS[0].key);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/account');
    }
  }, [user, loading, router]);

  const handleHeroUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroKey || !heroFile) {
      setHeroMsg('❌ Select a category and an image file.');
      return;
    }
    setHeroUploading(true);
    setHeroMsg('');

    const fd = new FormData();
    fd.append('file', heroFile);
    fd.append('key', heroKey);
    fd.append('type', 'image');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setHeroMsg(`✅ Hero image uploaded for ${CATEGORY_BANNERS.find(b => b.key === heroKey)?.label}`);
      setHeroFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (refreshMedia) refreshMedia();
    } catch (err: any) {
      setHeroMsg(`❌ ${err.message}`);
    } finally {
      setHeroUploading(false);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') {
    return <div className={styles.loading}><div className={styles.spinner} /></div>;
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span>🛋️</span>
          <div><strong>CushionGuru</strong></div>
        </div>
        <nav className={styles.sideNav}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItem}
              style={{
                background: item.href === '/admin/hero' ? 'rgba(255,255,255,.08)' : '',
                color: item.href === '/admin/hero' ? '#fff' : '',
              }}
            >
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminUser}>
            <div className={styles.avatar}>{user.name?.[0] ?? 'A'}</div>
            <div><strong>{user.name ?? 'Admin'}</strong><span>{user.email}</span></div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="btn btn-outline btn-sm"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1>Hero Banner Management</h1>
          <Link href="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
        </div>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '.5rem', color: 'var(--brand-primary)' }}>
            🖼️ Category Banners
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', marginBottom: '1rem' }}>
            Upload the main hero background image for each category page.
          </p>
          <div className="card" style={{ padding: '1.5rem' }}>
            <form onSubmit={handleHeroUpload}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                <div className="form-group">
                  <label className="form-label">Category Page</label>
                  <select className="form-control" value={heroKey} onChange={e => setHeroKey(e.target.value)}>
                    {CATEGORY_BANNERS.map(k => <option key={k.key} value={k.key}>{k.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Background Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={e => setHeroFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={heroUploading}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {heroUploading ? 'Uploading…' : 'Upload Image'}
                </button>
              </div>
              {heroMsg && (
                <div
                  className={`alert ${heroMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}
                  style={{ marginTop: '.75rem' }}
                >
                  {heroMsg}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
