'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSite } from '@/context/SiteContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';
import { downloadInvoice } from '@/lib/invoice';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/hero', label: 'Hero Images', icon: '🖼️' },
  // { href: '/admin/media', label: 'Media', icon: '🖼️' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { href: '/admin/blogs', label: 'Blogs', icon: '📝' },
  { href: '/admin/products', label: 'Products', icon: '🛍️' },
  { href: '/admin/fabrics', label: 'Fabrics', icon: '🧵' },
  { href: '/admin/users', label: 'Users Data', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const STATUS_OPTIONS = [
  'ORDER_RECEIVED',
  'STITCHING',
  'PROCESSING',
  'PACKING',
  'SHIPPING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

const STATUS_LABELS: Record<string, string> = {
  ORDER_RECEIVED:    'Order Received (Pending)',
  STITCHING:         'Stitching In Progress',
  PROCESSING:        'Processing / Picking',
  PACKING:           'Packing',
  SHIPPING:          'Shipping (In Transit)',
  OUT_FOR_DELIVERY:  'Out for Delivery',
  DELIVERED:         'Delivered',
  CANCELLED:         'Cancelled',
};

const statusColor: Record<string, { bg: string; color: string }> = {
  ORDER_RECEIVED:   { bg: '#fff7ed', color: '#f59e0b' },
  STITCHING:        { bg: '#fdf4ff', color: '#a855f7' },
  PROCESSING:       { bg: '#eff6ff', color: '#3b82f6' },
  PACKING:          { bg: '#fff1f2', color: '#f43f5e' },
  SHIPPING:         { bg: '#f5f3ff', color: '#8b5cf6' },
  OUT_FOR_DELIVERY: { bg: '#fefce8', color: '#ca8a04' },
  DELIVERED:        { bg: '#f0fdf4', color: '#10b981' },
  CANCELLED:        { bg: '#fef2f2', color: '#ef4444' },
  // legacy fallbacks
  PENDING:    { bg: '#fff7ed', color: '#f59e0b' },
  SHIPPED:    { bg: '#f5f3ff', color: '#8b5cf6' },
};

export default function AdminOrdersPage() {
  const { user, logout, loading } = useAuth();
  const { logoUrl, siteName } = useSite();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/account');
    } else if (user?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(console.error);
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('Error updating status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  if (loading || !user || user.role !== 'ADMIN') return <div className={styles.loading}><div className={styles.spinner} /></div>;

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
              style={{ background: item.href === '/admin/orders' ? 'rgba(255,255,255,.08)' : '', color: item.href === '/admin/orders' ? '#fff' : '' }}>
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
          <h1>Orders</h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{orders.length} total</span>
            <Link href="/admin" className="btn btn-outline btn-sm">Back to Dashboard</Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['ALL', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: '1px solid',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                background: filter === s ? 'var(--brand-primary)' : 'white',
                color: filter === s ? 'white' : 'var(--text-secondary)',
                borderColor: filter === s ? 'var(--brand-primary)' : 'var(--gray-200)',
              }}>
              {s === 'ALL' ? 'ALL' : (STATUS_LABELS[s] || s)}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.length === 0 && (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No orders found{filter !== 'ALL' ? ` with status "${filter}"` : ''}.
            </div>
          )}
          {filtered.map(order => {
            const sc = statusColor[order.status] ?? { bg: '#f3f4f6', color: '#6b7280' };
            return (
              <div key={order.id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                      Order #{order.id.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>{order.user?.name ?? order.user?.email ?? 'Unknown User'}</strong>
                      {' · '}{order.user?.email}
                      {' · '}{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {order.status}
                    </span>
                    <span style={{ fontWeight: 800, color: 'var(--brand-secondary)', fontSize: '1.25rem' }}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items with images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--gray-100)' }}>
                  {(order.items as any[])?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ width: '56px', height: '56px', flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.category === 'Non-Customizable' ? '🛍️' : '🛋️')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category ?? 'Custom'} · Qty: {item.quantity} · ${item.price?.toFixed(2)} each</div>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--brand-secondary)', whiteSpace: 'nowrap' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ width: '250px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span>Delivery Charge</span>
                        <span>${(order.deliveryCharge || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping + Billing Addresses */}
                {order.shippingAddr && (() => {
                  const ship = order.shippingAddr.shipping ?? order.shippingAddr;
                  const bill = order.shippingAddr.billing;
                  // Compare every field — any difference shows the billing address separately
                  const billDiff = bill && JSON.stringify(bill) !== JSON.stringify(ship);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--gray-100)' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>🚚 Shipping Address</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                          <strong>{ship.fullName}</strong><br />
                          {ship.address}<br />
                          {ship.city}{ship.state ? `, ${ship.state}` : ''} {ship.zip}<br />
                          {ship.country}<br />
                          {ship.phone && <span>📞 {ship.phone}<br /></span>}
                          {ship.email && <span>✉️ {ship.email}</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>💳 Billing Address</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                          {billDiff ? (
                            <>
                              <strong>{bill.fullName}</strong><br />
                              {bill.address}<br />
                              {bill.city}{bill.state ? `, ${bill.state}` : ''} {bill.zip}<br />
                              {bill.country}
                            </>
                          ) : (
                            <em style={{ color: 'var(--text-muted)' }}>Same as shipping address</em>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Status update */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Update Status:</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {STATUS_OPTIONS.filter(s => s !== order.status).map(s => {
                      const c = statusColor[s] || { bg: '#f3f4f6', color: '#6b7280' };
                      return (
                        <button key={s} onClick={() => updateStatus(order.id, s)}
                          disabled={updating === order.id}
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: '999px',
                            border: `1px solid ${c.color}`,
                            background: 'white',
                            color: c.color,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            opacity: updating === order.id ? 0.5 : 1,
                            transition: 'all 0.2s',
                          }}>
                          → {STATUS_LABELS[s] || s}
                        </button>
                      );
                    })}
                  </div>
                  {order.notes && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>📝 {order.notes}</span>}

                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Paid via {order.paymentMethod || 'COD'}
                    </div>
                    <button onClick={() => downloadInvoice(order, logoUrl, siteName)} className="btn btn-outline btn-sm">
                      📄 Invoice
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
