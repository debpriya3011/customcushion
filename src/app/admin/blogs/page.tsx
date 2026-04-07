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

export default function AdminBlogsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/account');
    } else if (user?.role === 'ADMIN') {
      fetchBlogs();
    }
  }, [user, loading, router]);

  const fetchBlogs = () => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || (!file && !editingId)) {
      alert('Please provide title, description, and an image (if creating)');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    if (file) {
      formData.append('image', file);
    }

    try {
      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        alert(`Blog post ${editingId ? 'updated' : 'created'}!`);
        resetForm();
        fetchBlogs();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to save blog'}`);
      }
    } catch (err) {
      alert('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setFile(null);
    setEditingId(null);
    const fileInput = document.getElementById('blogImageInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setDescription(blog.excerpt);
    setContent(blog.content || blog.excerpt);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (err) {
      alert('Failed to delete blog post');
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
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className={styles.sideNav}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className={styles.navItem} style={{ background: item.href === '/admin/blogs' ? 'rgba(255,255,255,.08)' : '', color: item.href === '/admin/blogs' ? '#fff' : '' }}>
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
          <h1>Manage Blogs</h1>
          <Link href="/admin" className="btn btn-outline btn-sm">Back to Dashboard</Link>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--brand-primary)', fontSize: '1.5rem' }}>{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Description (Excerpt)</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Content (Full Text)</label>
              <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Format with newlines..." required />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Thumbnail Image {editingId && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Leave blank to keep current)</span>}</label>
              <input type="file" id="blogImageInput" className="form-control" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} {...(!editingId && { required: true })} style={{ background: 'var(--gray-50)' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Blog' : 'Create Blog')}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 style={{ marginBottom: '1.5rem', color: 'var(--brand-primary)' }}>Existing Blogs</h2>
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {blogs.map(blog => (
            <div key={blog.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              {blog.imageUrl ? (
                <div style={{ height: '180px', overflow: 'hidden', background: 'var(--gray-100)' }}>
                  <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '180px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
              )}

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={blog.title}>{blog.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', flex: 1 }} title={blog.excerpt}>{blog.excerpt}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}><strong>Preview:</strong> {blog.content}</div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                  <button onClick={() => handleEdit(blog)} className="btn btn-outline btn-sm" style={{ flex: 1, borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="btn btn-outline btn-sm" style={{ flex: 1, borderColor: 'var(--error)', color: 'var(--error)' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {blogs.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No blog posts found.</p>}
        </div>
      </main>
    </div>
  );
}
