'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Invalid products data:', data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.sellingPrice || product.listingPrice,
      quantity: 1,
      image: product.imageUrl,
      category: 'Non-Customizable'
    });
    alert('Added to cart!');
  };

  const handleBuyNow = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.sellingPrice || product.listingPrice,
      quantity: 1,
      image: product.imageUrl,
      category: 'Non-Customizable'
    });
    router.push('/cart');
  };

  return (
    <main className="section-padding fade-in" style={{ background: 'var(--off-white)', minHeight: '100vh', paddingTop: 'max(120px, 15vh)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--gap-3xl)', gap: '1rem' }}>
          <h1 style={{ color: 'var(--brand-primary)', margin: 0 }}>Shop Products</h1>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ flex: 1 }}
            />
          </div>
          {user?.role === 'ADMIN' && (
            <Link href="/admin/products" className="btn btn-primary btn-lg whitespace-nowrap">
              Add Product (Admin)
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>Loading products...</div>
        ) : (
          <div className="grid-4">
            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
              <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {product.imageUrl ? (
                  <div style={{ width: '100%', height: '240px', overflow: 'hidden', background: 'var(--gray-50)' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '240px', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem' }}>🛍️</span>
                  </div>
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.name}>{product.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }} title={product.description}>{product.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-secondary)' }}>
                      ${(product.sellingPrice || product.listingPrice)?.toFixed(2)}
                    </div>
                    {product.listingPrice > product.sellingPrice && (
                      <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ${product.listingPrice?.toFixed(2)}
                      </div>
                    )}
                    {product.listingPrice > product.sellingPrice && (
                      <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                        ↓ {Math.round(((product.listingPrice - product.sellingPrice) / product.listingPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="btn btn-outline"
                      style={{ width: '100%' }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>
                No products found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
