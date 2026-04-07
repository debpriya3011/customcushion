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


export default function AdminProductsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/account');
    } else if (user?.role === 'ADMIN') {
      fetchProducts();
    }
  }, [user, loading, router]);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Invalid admin products data:', data);
          setProducts([]);
        }
      })
      .catch(console.error);
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setSku(product.sku);
    setListingPrice(product.listingPrice.toString());
    setSellingPrice(product.sellingPrice.toString());
    setDescription(product.description);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setSku('');
    setListingPrice('');
    setSellingPrice('');
    setDescription('');
    setFile(null);
    const fileInput = document.getElementById('productImageInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !description || !listingPrice || !sellingPrice) {
      alert('Please provide all fields');
      return;
    }

    if (parseFloat(sellingPrice) >= parseFloat(listingPrice)) {
      alert('Selling price must be less than the listing price.');
      return;
    }

    if (!editingId && !file) {
      alert('An image is required when adding a new product');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('sku', sku);
    formData.append('description', description);
    formData.append('listingPrice', listingPrice);
    formData.append('sellingPrice', sellingPrice);
    if (file) {
      formData.append('image', file);
    }

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        alert(editingId ? 'Product updated!' : 'Product created!');
        handleCancel();
        fetchProducts();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to save product'}`);
      }
    } catch (err) {
      alert('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading || !user || user.role !== 'ADMIN') return <div className={styles.loading}><div className={styles.spinner} /></div>;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span>🛋️</span>
          <div>
            <strong>CushionGuru</strong>
            {/* <span>Admin Panel</span> */}
          </div>
        </div>
        <nav className={styles.sideNav}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className={styles.navItem} style={{ background: item.href === '/admin/products' ? 'rgba(255,255,255,.08)' : '', color: item.href === '/admin/products' ? '#fff' : '' }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminUser}>
            <div className={styles.avatar}>{user.name?.[0] ?? 'A'}</div>
            <div>
              <strong>{user.name ?? 'Admin'}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1>Manage Products</h1>
          <Link href="/admin" className="btn btn-outline btn-sm">Back to Dashboard</Link>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--brand-primary)', fontSize: '1.5rem' }}>{editingId ? 'Edit Product Details' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Listing Price ($)</label>
                <input type="number" step="0.01" className="form-control" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Selling Price ($)</label>
                <input type="number" step="0.01" className="form-control" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Product Image {editingId && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Leave blank to keep current)</span>}</label>
                <input type="file" id="productImageInput" className="form-control" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} {...(!editingId && { required: true })} style={{ background: 'var(--gray-50)' }} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 style={{ marginBottom: '1.5rem', color: 'var(--brand-primary)' }}>Existing Products</h2>
        <div className="grid-4" style={{ gap: '1.5rem' }}>
          {products.map(product => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              {product.imageUrl ? (
                <div style={{ height: '180px', overflow: 'hidden', background: 'var(--gray-100)' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '180px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🛍️</div>
              )}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.name}>{product.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>SKU:</strong> {product.sku}</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--brand-secondary)', fontWeight: 700, fontSize: '1.2rem' }}>${(product.sellingPrice || product.listingPrice)?.toFixed(2)}</div>
                  {product.listingPrice > product.sellingPrice && (
                    <div style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem' }}>${product.listingPrice?.toFixed(2)}</div>
                  )}
                  {product.listingPrice > product.sellingPrice && (
                    <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ↓ {Math.round(((product.listingPrice - product.sellingPrice) / product.listingPrice) * 100)}%
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, margin: '0.5rem 0' }} title={product.description}>{product.description}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                  <button onClick={() => handleEdit(product)} className="btn btn-outline btn-sm" style={{ flex: 1, borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-outline btn-sm" style={{ flex: 1, borderColor: 'var(--error)', color: 'var(--error)' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No products found.</p>}
        </div>
      </main>
    </div>
  );
}
