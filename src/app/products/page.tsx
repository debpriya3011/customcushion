'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ── Stock badge for regular products ── */
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />Out of Stock
    </span>
  );
  if (stock <= 5) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />Almost Gone
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />In Stock
    </span>
  );
}

/* ── Check if a linked product has a detail page (rich content) ── */
function hasRichContent(lp: any): boolean {
  try {
    const blocks = lp.richDescription ? JSON.parse(lp.richDescription) : [];
    const faqs = lp.faqData ? JSON.parse(lp.faqData) : [];
    return blocks.length > 0 || faqs.length > 0;
  } catch { return false; }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [linkedProducts, setLinkedProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()).catch(() => []),
      fetch('/api/linked-products').then(r => r.json()).catch(() => []),
    ]).then(([prod, linked]) => {
      setProducts(Array.isArray(prod) ? prod : []);
      setLinkedProducts(Array.isArray(linked) ? linked : []);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) { alert('This product is out of stock.'); return; }
    addItem({ id: product.id, name: product.name, price: product.sellingPrice || product.listingPrice, quantity: 1, image: product.imageUrl, category: 'Non-Customizable', stock: product.stock });
    alert('Added to cart!');
  };

  const handleBuyNow = (product: any) => {
    if (product.stock === 0) { alert('This product is out of stock.'); return; }
    addItem({ id: product.id, name: product.name, price: product.sellingPrice || product.listingPrice, quantity: 1, image: product.imageUrl, category: 'Non-Customizable', stock: product.stock });
    router.push('/cart');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredLinked = linkedProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalResults = filteredProducts.length + filteredLinked.length;

  return (
    <main className="section-padding fade-in" style={{ background: 'var(--off-white)', minHeight: '100vh', paddingTop: 'max(120px, 15vh)' }}>
      <div className="container">

        {/* ── Header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-3xl)', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'var(--brand-primary)', margin: 0 }}>Shop Products</h1>
            {!loading && (
              <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {totalResults} product{totalResults !== 1 ? 's' : ''} available
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '400px' }}>
            <input type="text" placeholder="Search products..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className="form-control" style={{ flex: 1 }} />
          </div>
          {user?.role === 'ADMIN' && (
            <Link href="/admin/products" className="btn btn-primary btn-lg whitespace-nowrap">
              Manage Products
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            Loading products...
          </div>
        ) : (
          <>
            {/* ── Single unified grid: regular + linked together ── */}
            <div className="grid-4">

              {/* Regular (non-customisable) products */}
              {filteredProducts.map(product => (
                <div key={product.id} className="card"
                  style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>

                  {/* Image — links to product detail page */}
                  <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    {product.imageUrl ? (
                      <div style={{ width: '100%', height: '240px', overflow: 'hidden', background: 'var(--gray-50)' }}>
                        <img src={product.imageUrl} alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s' }}
                          onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.05)')}
                          onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = '')} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '240px', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '4rem' }}>🛍️</span>
                      </div>
                    )}
                  </Link>

                  <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <StockBadge stock={product.stock ?? 0} />
                    </div>

                    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.55 }}>
                      {product.description}
                    </p>

                    {/* spacer — pushes price + buttons to bottom */}
                    <div style={{ flex: 1 }} />

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--brand-secondary)' }}>
                        ${(product.sellingPrice || product.listingPrice)?.toFixed(2)}
                      </span>
                      {product.listingPrice > product.sellingPrice && (
                        <>
                          <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ${product.listingPrice?.toFixed(2)}
                          </span>
                          <span style={{ background: '#fee2e2', color: '#ef4444', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.73rem', fontWeight: 700 }}>
                            -{Math.round(((product.listingPrice - product.sellingPrice) / product.listingPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                      <Link href={`/products/${product.id}`} className="btn btn-outline"
                        style={{ width: '100%', textAlign: 'center', fontSize: '0.875rem', padding: '0.55rem' }}>
                        View Details
                      </Link>
                      <button onClick={() => handleAddToCart(product)} className="btn btn-primary"
                        style={{ width: '100%' }} disabled={product.stock === 0}>
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button onClick={() => handleBuyNow(product)} className="btn btn-outline"
                        style={{ width: '100%' }} disabled={product.stock === 0}>
                        {product.stock === 0 ? 'Unavailable' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Linked products — appear in the same grid */}
              {filteredLinked.map(lp => {
                // View Details always goes to internal detail page
                const detailHref = `/products/linked/${lp.id}`;
                const shopHref = lp.link;
                const isExternal = shopHref?.startsWith('http');

                return (
                  <div key={lp.id} className="card"
                    style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>

                    {/* Image — goes to internal detail page */}
                    <a href={detailHref}
                      style={{ textDecoration: 'none', display: 'block' }}>
                      {lp.imageUrl ? (
                        <div style={{ width: '100%', height: '240px', overflow: 'hidden', background: 'var(--gray-50)' }}>
                          <img src={lp.imageUrl} alt={lp.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s' }}
                            onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.05)')}
                            onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = '')} />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '240px', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '4rem' }}>🔗</span>
                        </div>
                      )}
                    </a>

                    <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                          🔗 Linked Product
                        </span>
                      </div> */}

                      <a href={detailHref} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lp.name}>
                          {lp.name}
                        </h3>
                      </a>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.55 }}>
                        {lp.description}
                      </p>

                      {/* spacer pushes price + buttons to bottom */}
                      <div style={{ flex: 1 }} />

                      {/* Price */}
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-secondary)', marginBottom: '0.9rem' }}>
                        From ${lp.startingPrice?.toFixed(2)}
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {/* View Details → always internal page */}
                        <a href={detailHref} style={{ textDecoration: 'none' }}>
                          <div className="btn btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.875rem', padding: '0.55rem', display: 'block' }}>
                            View Details
                          </div>
                        </a>
                        {/* Customize / Shop Now → goes straight to the linked URL */}
                        <a href={shopHref} target={isExternal ? '_blank' : '_self'}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          style={{ textDecoration: 'none' }}>
                          <div className="btn btn-primary" style={{ width: '100%', textAlign: 'center', fontSize: '0.875rem', padding: '0.55rem', display: 'block' }}>
                            {isExternal ? 'Shop Now →' : '🛋️ Customize Now →'}
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Empty state */}
            {totalResults === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '5rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>No products found</div>
                <div style={{ fontSize: '0.9rem' }}>Try a different search term.</div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
