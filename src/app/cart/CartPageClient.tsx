'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ── Defined OUTSIDE the main component so React doesn't remount on every render ──
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem',
  border: '1px solid var(--gray-200)',
  borderRadius: 'var(--radius-md)', fontSize: '0.95rem',
  background: 'white', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  marginBottom: '0.35rem', display: 'block',
};

const FIELDS = [
  { name: 'fullName',  label: 'Full Name',          col: '1 / -1', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "Only letters and spaces allowed" },
  { name: 'email',     label: 'Email Address',       col: '1 / -1', type: 'email' },
  { name: 'phone',     label: 'Phone Number',        col: '', type: 'tel', pattern: "^[0-9\\+\\-\\s\\(\\)]{7,15}$", title: "Valid phone number required" },
  { name: 'address',   label: 'Street Address',      col: '1 / -1', type: 'text' },
  { name: 'city',      label: 'City',                col: '', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "City name should contain only letters" },
  { name: 'state',     label: 'State / Province',    col: '', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "State name should contain only letters" },
  { name: 'zip',       label: 'ZIP / Postal Code',   col: '', type: 'text', pattern: "^(?=.*[0-9])[a-zA-Z0-9\\s\\-]{3,10}$", title: "Valid ZIP/Postal code required (must contain numbers)" },
  { name: 'country',   label: 'Country',             col: '', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "Country name should contain only letters" },
];

interface AddrType { fullName: string; email: string; phone: string; address: string; city: string; state: string; zip: string; country: string; }

function AddressForm({ values, onChange }: { values: AddrType; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {FIELDS.map(field => (
        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gridColumn: field.col || '' }}>
          <label style={labelStyle}>{field.label}</label>
          <input 
            type={field.type || "text"}
            name={field.name} 
            value={(values as any)[field.name]} 
            onChange={onChange} 
            style={inputStyle} 
            required 
            placeholder={field.label}
            pattern={field.pattern}
            title={field.title}
          />
        </div>
      ))}
    </div>
  );
}

const EMPTY: AddrType = { fullName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '' };

const statusColor: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: '#fff7ed', color: '#f59e0b' },
  PROCESSING: { bg: '#eff6ff', color: '#3b82f6' },
  SHIPPED:    { bg: '#f5f3ff', color: '#8b5cf6' },
  DELIVERED:  { bg: '#f0fdf4', color: '#10b981' },
  CANCELLED:  { bg: '#fef2f2', color: '#ef4444' },
};

export default function CartPageClient() {
  const { items, total, count, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDetectingBilling, setIsDetectingBilling] = useState(false);
  const [shipping, setShipping] = useState<AddrType>({ ...EMPTY });
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState<AddrType>({ ...EMPTY });
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'COD'>('STRIPE');
  const deliveryCharge = 15;
  const finalTotal = total + deliveryCharge;

  // Open checkout automatically when ?checkout=1 is in the URL
  useEffect(() => {
    if (searchParams.get('checkout') === '1' && user && count > 0) {
      setShowCheckout(true);
      window.scrollTo({ top: 0 });
    }
  }, [searchParams, user, count]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDetectAddress = () => {
    if ("geolocation" in navigator) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          if (data && data.address) {
            setShipping(prev => ({
              ...prev,
              address: data.address.road || data.address.suburb || data.address.neighbourhood || prev.address,
              city: data.address.city || data.address.town || data.address.village || prev.city,
              state: data.address.state || prev.state,
              zip: data.address.postcode || prev.zip,
              country: data.address.country || prev.country
            }));
          } else {
            alert("Could not detect address automatically.");
          }
        } catch (error) {
          alert("Failed to detect address from location.");
        } finally {
          setIsDetecting(false);
        }
      }, (error) => {
        alert("Geolocation error: " + error.message);
        setIsDetecting(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleDetectBillingAddress = () => {
    if ("geolocation" in navigator) {
      setIsDetectingBilling(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          if (data && data.address) {
            setBilling(prev => ({
              ...prev,
              address: data.address.road || data.address.suburb || data.address.neighbourhood || prev.address,
              city: data.address.city || data.address.town || data.address.village || prev.city,
              state: data.address.state || prev.state,
              zip: data.address.postcode || prev.zip,
              country: data.address.country || prev.country
            }));
          } else {
            alert("Could not detect address automatically.");
          }
        } catch (error) {
          alert("Failed to detect address from location.");
        } finally {
          setIsDetectingBilling(false);
        }
      }, (error) => {
        alert("Geolocation error: " + error.message);
        setIsDetectingBilling(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBilling(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/account'); return; }
    setIsProcessing(true);
    try {
      // 1. Create the Order in DB
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items,
          total: finalTotal,
          deliveryCharge,
          paymentMethod,
          status: 'PENDING',
          shippingAddr: shipping,
          billingAddr: billingSame ? shipping : billing,
          notes: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Stripe checkout initiated',
        }),
      });
      if (res.ok) {
        const order = await res.json();
        
        if (paymentMethod === 'STRIPE') {
          // 2. Init Stripe Checkout
          const stripeRes = await fetch('/api/checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ orderId: order.id }),
          });
          const session = await stripeRes.json();
          if (session.url) {
            window.location.href = session.url;
          } else {
            alert('Stripe error: ' + (session.error || 'Unknown'));
            setIsProcessing(false);
          }
        } else {
          // COD - finish
          clearCart();
          router.push('/account/orders');
        }
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || err.error}`);
        setIsProcessing(false);
      }
    } catch {
      alert('Error placing order');
      setIsProcessing(false);
    }
  };

  if (count === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 'max(120px, 15vh)', background: 'var(--off-white)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
        <h1 style={{ fontFamily: 'Playfair Display', color: 'var(--brand-primary)', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>Your Cart is Empty</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>Add some products to get started.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/products" className="btn btn-primary btn-lg">Shop Products</Link>
          <Link href="/customize" className="btn btn-outline btn-lg">Custom Cushion</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', paddingTop: 'max(120px, 15vh)', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontFamily: 'Playfair Display', color: 'var(--brand-primary)', fontSize: '2.5rem', margin: '0 0 2.5rem 0' }}>
          {showCheckout ? 'Checkout' : 'Your Cart'}
        </h1>

        {!showCheckout ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>
            {/* Items */}
            <div style={{ flex: '1 1 580px' }}>
              <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {items.map((item, index) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1.5rem', paddingBottom: index < items.length - 1 ? '2rem' : 0, borderBottom: index < items.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <div style={{ width: '110px', height: '110px', flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.category === 'Non-Customizable' ? '🛍️' : '🛋️')}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} style={{ color: 'var(--error)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Remove</button>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {item.category === 'Non-Customizable' ? 'Ready-made Product' : 'Custom Cushion'}
                      </div>
                      {item.customOptions && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--gray-50)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.2rem', marginBottom: '0.2rem' }}>
                          <span style={{fontWeight: 600}}>Details:</span> {Object.entries(item.customOptions)
                            .filter(([k,v]) => k !== 'shape' && v)
                            .map(([k,v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                            .join(' | ')}
                        </div>
                      )}
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Unit price: <strong>${(item.price || 0).toFixed(2)}</strong></div>
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Qty:</label>
                          <select value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                            style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--brand-secondary)', fontSize: '1.2rem' }}>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ flex: '1 1 280px', maxWidth: '380px' }}>
              <div className="card" style={{ padding: '2rem', position: 'sticky', top: 'calc(var(--nav-height, 80px) + 2rem)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>Order Summary</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <span>Subtotal ({count} items)</span><span>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-100)', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <span>Delivery Charge</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${deliveryCharge.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 800, fontSize: '1.3rem' }}>
                  <span>Total</span><span style={{ color: 'var(--brand-secondary)' }}>${finalTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => { if (!user) { router.push('/account'); return; } setShowCheckout(true); window.scrollTo({ top: 0 }); }}
                  className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Proceed to Checkout →
                </button>
                <Link href="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* CHECKOUT */
          <form onSubmit={handlePlaceOrder}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 560px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--brand-primary)' }}>🚚 Shipping Address</h2>
                    <button 
                      type="button" 
                      onClick={handleDetectAddress} 
                      disabled={isDetecting}
                      className="btn btn-outline" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      {isDetecting ? 'Detecting...' : '📍 Auto-Detect'}
                    </button>
                  </div>
                  <AddressForm values={shipping} onChange={handleShippingChange} />
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--brand-primary)' }}>💳 Billing Address</h2>
                      {!billingSame && (
                        <button 
                          type="button" 
                          onClick={handleDetectBillingAddress} 
                          disabled={isDetectingBilling}
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          {isDetectingBilling ? 'Detecting...' : '📍 Auto-Detect'}
                        </button>
                      )}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={billingSame} onChange={e => setBillingSame(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                      Same as shipping
                    </label>
                  </div>
                  {billingSame
                    ? <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>✓ Using same address as shipping</div>
                    : <AddressForm values={billing} onChange={handleBillingChange} />
                  }
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem 0', color: 'var(--brand-primary)' }}>💲 Payment Method</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `2px solid ${paymentMethod === 'STRIPE' ? 'var(--brand-primary)' : 'var(--gray-200)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'STRIPE' ? '#f0f4f8' : 'white' }}>
                      <input type="radio" name="paymentMethod" value="STRIPE" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} style={{ transform: 'scale(1.2)' }} />
                      <div style={{ fontWeight: 600 }}>Pay with Stripe (Card)</div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `2px solid ${paymentMethod === 'COD' ? 'var(--brand-primary)' : 'var(--gray-200)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'COD' ? '#f0f4f8' : 'white' }}>
                      <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ transform: 'scale(1.2)' }} />
                      <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order recap */}
              <div style={{ flex: '1 1 280px', maxWidth: '400px' }}>
                <div className="card" style={{ padding: '2rem', position: 'sticky', top: 'calc(var(--nav-height, 80px) + 2rem)' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>Order Items</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '52px', height: '52px', flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                          {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.category === 'Non-Customizable' ? '🛍️' : '🛋️')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                          {item.customOptions && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                              {item.customOptions.dimensions && <span>📐 {item.customOptions.dimensions} </span>}
                              {item.customOptions.fabric && <span>🧵 {item.customOptions.fabric} </span>}
                              {item.customOptions.fill && <span>• {item.customOptions.fill}</span>}
                            </div>
                          )}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--brand-secondary)', whiteSpace: 'nowrap' }}>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}

                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>Subtotal</span><span>${total.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>Delivery Charge</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 800, fontSize: '1.25rem', paddingTop: '1rem', borderTop: '2px solid var(--gray-200)' }}>
                    <span>Total</span><span style={{ color: 'var(--brand-secondary)' }}>${finalTotal.toFixed(2)}</span>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }} disabled={isProcessing}>
                    {isProcessing ? 'Processing…' : (paymentMethod === 'STRIPE' ? 'Pay with Stripe' : 'Place Order')}
                  </button>
                  <button type="button" onClick={() => setShowCheckout(false)} style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    ← Back to Cart
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
