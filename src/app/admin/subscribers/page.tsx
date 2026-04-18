'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/hero', label: 'Hero Images', icon: '🖼️' },
  // { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { href: '/admin/blogs', label: 'Blogs', icon: '📝' },
  { href: '/admin/products', label: 'Products', icon: '🛍️' },
  { href: '/admin/fabrics', label: 'Fabrics', icon: '🧵' },
  { href: '/admin/users', label: 'Users Data', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSubscribersPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/account');
    } else if (user?.role === 'ADMIN') {
      fetch('/api/newsletter')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSubscribers(data);
        })
        .catch(console.error);
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return <div className={styles.loading}><div className={styles.spinner} /></div>;
  }

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
              style={{ background: item.href === '/admin/subscribers' ? 'rgba(255,255,255,.08)' : '', color: item.href === '/admin/subscribers' ? '#fff' : '' }}>
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
          <h1>Subscribers</h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {subscribers.length} total
            </span>
            <Link href="/admin" className="btn btn-outline btn-sm">Back to Dashboard</Link>
          </div>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          {subscribers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No subscribers yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Signed Up On</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{sub.email}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
