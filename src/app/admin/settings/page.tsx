'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  // { href: '/admin/media', label: 'Media', icon: '🖼️' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { href: '/admin/blogs', label: 'Blogs', icon: '📝' },
  { href: '/admin/products', label: 'Products', icon: '🛍️' },
  { href: '/admin/fabrics', label: 'Fabrics', icon: '🧵' },
  { href: '/admin/users', label: 'Users Data', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSettingsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [siteName, setSiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/account');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSiteName(data.siteName || 'CushionGuru');
        setSiteTagline(data.siteTagline || 'Custom Cushions, Factory Direct');
        setLogoUrl(data.logoUrl || '');
      })
      .catch(() => { });
  }, [user]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('logo', logoFile);
    try {
      const res = await fetch('/api/settings', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setLogoUrl(data.logoUrl);
        setLogoFile(null);
        setLogoPreview('');
        const inp = document.getElementById('logoInput') as HTMLInputElement;
        if (inp) inp.value = '';
        // Force reload context
        window.location.reload();
      } else {
        alert(data.error || 'Failed to upload logo');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!confirm('Remove the current logo? The default icon will be used.')) return;
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: '' }),
      });
      setLogoUrl('');
      window.location.reload();
    } catch {
      alert('Failed to remove logo');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, siteTagline }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save');
      }
    } catch {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') return <div className={styles.loading}><div className={styles.spinner} /></div>;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)',
    fontSize: '0.95rem', background: 'white', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block',
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span>🛋️</span>
          <div><strong>CushionGuru</strong>
            {/* <span>Admin Panel</span> */}
          </div>
        </div>
        <nav className={styles.sideNav}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className={styles.navItem}
              style={{ background: item.href === '/admin/settings' ? 'rgba(255,255,255,.08)' : '', color: item.href === '/admin/settings' ? '#fff' : '' }}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminUser}>
            <div className={styles.avatar}>{user.name?.[0] ?? 'A'}</div>
            <div><strong>{user.name ?? 'Admin'}</strong><span>{user.email}</span></div>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Sign Out</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1>Site Settings</h1>
          <Link href="/admin" className="btn btn-outline btn-sm">Back to Dashboard</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>

          {/* Logo Section */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🖼️ Site Logo
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Upload a custom logo image. It will replace the default 🛋️ icon and site name in the navigation bar. Recommended size: 160×40px or similar landscape ratio.
            </p>

            {/* Current logo preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '160px', height: '60px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Current Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>🛋️</span>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {logoUrl ? 'Current Logo' : 'No logo uploaded'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {logoUrl ? 'Logo is active across the site' : 'Default icon + site name is shown'}
                </div>
                {logoUrl && (
                  <button onClick={handleRemoveLogo} style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                    Remove logo
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Upload New Logo</label>
                <input id="logoInput" type="file" accept="image/*" onChange={handleLogoChange} style={{ ...inputStyle, background: 'var(--gray-50)', paddingTop: '0.5rem' }} />
              </div>
              <button onClick={handleUploadLogo} className="btn btn-primary" disabled={!logoFile || uploadingLogo} style={{ whiteSpace: 'nowrap' }}>
                {uploadingLogo ? 'Uploading…' : 'Upload Logo'}
              </button>
            </div>
          </div>

          {/* Text Settings */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✏️ Brand Text
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              These values appear throughout the site — in the navbar (when no logo is uploaded), browser tab titles, footer, and admin panel.
            </p>

            <form onSubmit={handleSaveText} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. CushionGuru (leave blank to hide)"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Shown in the navbar when no logo is uploaded — also used in page titles.</div>
              </div>
              <div>
                <label style={labelStyle}>Site Tagline</label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={e => setSiteTagline(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Custom Cushions, Factory Direct"
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Short description shown in the footer and metadata.</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {saved && <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>✓ Saved successfully!</span>}
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="card" style={{ padding: '2rem', background: '#0d2438' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
              👁️ Navbar Preview
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
              {(logoPreview || logoUrl)
                ? <img src={logoPreview || logoUrl} alt="logo" style={{ height: '36px', width: 'auto', objectFit: 'contain', maxWidth: '140px' }} />
                : <span style={{ fontSize: '1.5rem' }}>🛋️</span>
              }
              <span style={{ color: 'white', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>{siteName || 'CushionGuru'}</span>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>This is how your brand appears in the navigation bar.</div>
          </div>

        </div>
      </main>
    </div>
  );
}
