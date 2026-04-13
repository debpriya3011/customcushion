'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type BlockType = 'paragraph' | 'heading' | 'bullet' | 'gap';
interface ContentBlock { id: string; type: BlockType; text: string; }
interface FaqItem { id: string; q: string; a: string; }

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fee2e2', color: '#dc2626', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} /> Out of Stock
    </span>
  );
  if (stock <= 5) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fef3c7', color: '#d97706', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /> Almost Gone — {stock} left
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', color: '#16a34a', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> In Stock
    </span>
  );
}

/** Parse **bold**, _italic_, __underline__ markers in a string into React nodes */
function parseInline(text: string): React.ReactNode {
  // Combined: **bold**, _italic_, __underline__
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|__(.+?)__|_(.+?)_)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith('**')) {
      parts.push(<strong key={key++} style={{ fontWeight: 800, color: 'inherit' }}>{match[2]}</strong>);
    } else if (match[0].startsWith('__')) {
      parts.push(<u key={key++} style={{ textDecorationColor: 'currentColor' }}>{match[3]}</u>);
    } else {
      parts.push(<em key={key++} style={{ fontStyle: 'italic' }}>{match[4]}</em>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

function RichContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      {blocks.map(block => {
        switch (block.type) {
          case 'heading':
            return (
              <h3 key={block.id} style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '1.2rem 0 0.4rem', lineHeight: 1.3 }}>
                {parseInline(block.text)}
              </h3>
            );
          case 'paragraph':
            return (
              <p key={block.id} style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0.25rem 0' }}>
                {parseInline(block.text)}
              </p>
            );
          case 'bullet':
            return (
              <div key={block.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', margin: '0.15rem 0', paddingLeft: '0.5rem' }}>
                <span style={{ color: 'var(--brand-secondary)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.5, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{parseInline(block.text)}</span>
              </div>
            );
          case 'gap':
            return <div key={block.id} style={{ height: '1.5rem' }} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {faqs.map((faq, idx) => (
        <div key={faq.id} style={{ border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: openIdx === idx ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
          <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            style={{ width: '100%', padding: '1rem 1.25rem', background: openIdx === idx ? 'var(--brand-primary)' : 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', textAlign: 'left', transition: 'background 0.2s' }}>
            <span style={{ fontWeight: 700, fontSize: '0.97rem', color: openIdx === idx ? 'white' : 'var(--text-primary)', lineHeight: 1.4 }}>
              {faq.q}
            </span>
            <span style={{ fontSize: '1rem', color: openIdx === idx ? 'white' : 'var(--text-muted)', flexShrink: 0, display: 'inline-block', transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}>
              ▼
            </span>
          </button>
          {openIdx === idx && (
            <div style={{ padding: '1rem 1.25rem 1.25rem', background: '#fafafa', borderTop: '1px solid var(--gray-100)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {parseInline(faq.a)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);          // ← Next.js 16: unwrap with React.use()
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const richBlocks: ContentBlock[] = (() => {
    try { return product?.richDescription ? JSON.parse(product.richDescription) : []; } catch { return []; }
  })();

  const faqs: FaqItem[] = (() => {
    try { return product?.faqData ? JSON.parse(product.faqData) : []; } catch { return []; }
  })();

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem({ id: product.id, name: product.name, price: product.sellingPrice || product.listingPrice, quantity: qty, image: product.imageUrl, category: 'Non-Customizable', stock: product.stock });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    addItem({ id: product.id, name: product.name, price: product.sellingPrice || product.listingPrice, quantity: qty, image: product.imageUrl, category: 'Non-Customizable', stock: product.stock });
    router.push('/cart');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'max(120px, 15vh)', background: 'var(--off-white)' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</div>
        Loading product...
      </div>
    </div>
  );

  if (!product || product.error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 'max(120px, 15vh)', background: 'var(--off-white)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
      <h1 style={{ color: 'var(--brand-primary)' }}>Product Not Found</h1>
      <Link href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back to Shop</Link>
    </div>
  );

  const price = product.sellingPrice || product.listingPrice;
  const hasDiscount = product.listingPrice > product.sellingPrice;
  const discountPct = hasDiscount ? Math.round(((product.listingPrice - product.sellingPrice) / product.listingPrice) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', paddingTop: 'max(100px, 12vh)', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link href="/products" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}>Shop</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
        </div>

        {/* Hero Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
          {/* Image */}
          <div style={{ flex: '1 1 380px', maxWidth: '500px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', aspectRatio: '1/1' }}>
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🛍️</div>}
            </div>
          </div>

          {/* Info panel */}
          <div style={{ flex: '1 1 300px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--brand-primary)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: '1rem' }}>
              <StockBadge stock={product.stock ?? 0} />
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-secondary)' }}>${price?.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.listingPrice?.toFixed(2)}</span>
                  <span style={{ background: '#fee2e2', color: '#ef4444', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800 }}>Save {discountPct}%</span>
                </>
              )}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', color: '#16a34a', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              🚚 Free Delivery
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>
            {/* <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>SKU: {product.sku}</div> */}

            {/* Qty picker */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Qty</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-200)', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
                  <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>−</button>
                  <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                  <button type="button" onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>+</button>
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {addedMsg && (
                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.65rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  ✓ Added to cart!
                </div>
              )}
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}>
                {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn btn-outline"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}>
                {product.stock === 0 ? 'Unavailable' : 'Buy Now →'}
              </button>
              <Link href="/products" style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', textDecoration: 'none', marginTop: '0.25rem' }}>
                ← Back to Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Rich Description */}
        {richBlocks.length > 0 && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--gray-100)' }}>
              Product Details
            </h2>
            <RichContentRenderer blocks={richBlocks} />
          </div>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.4rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Click an arrow to reveal the answer.
            </p>
            <FaqAccordion faqs={faqs} />
          </div>
        )}
      </div>
    </div>
  );
}
