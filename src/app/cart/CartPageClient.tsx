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

const COUNTRY_CODES = [
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'AU (+61)' },
  { code: '+91', label: 'IN (+91)' },
  { code: '+81', label: 'JP (+81)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+33', label: 'FR (+33)' },
  { code: '+39', label: 'IT (+39)' },
  { code: '+34', label: 'ES (+34)' },
  { code: '+55', label: 'BR (+55)' },
  { code: '+52', label: 'MX (+52)' },
  { code: '+82', label: 'KR (+82)' },
  { code: '+86', label: 'CN (+86)' },
  { code: '+65', label: 'SG (+65)' },
  { code: '+971', label: 'AE (+971)' },
  { code: '+966', label: 'SA (+966)' },
  { code: '+27', label: 'ZA (+27)' },
  { code: '+7', label: 'RU (+7)' },
  { code: '+351', label: 'PT (+351)' },
  { code: '+31', label: 'NL (+31)' },
  { code: '+64', label: 'NZ (+64)' },
  { code: '+20', label: 'EG (+20)' },
  { code: '+234', label: 'NG (+234)' },
  { code: '+254', label: 'KE (+254)' },
  { code: '+60', label: 'MY (+60)' },
  { code: '+62', label: 'ID (+62)' },
  { code: '+63', label: 'PH (+63)' },
  { code: '+66', label: 'TH (+66)' },
  { code: '+90', label: 'TR (+90)' },
  { code: '+46', label: 'SE (+46)' },
  { code: '+47', label: 'NO (+47)' },
  { code: '+45', label: 'DK (+45)' },
  { code: '+358', label: 'FI (+358)' },
  { code: '+48', label: 'PL (+48)' },
  { code: '+420', label: 'CZ (+420)' },
  { code: '+36', label: 'HU (+36)' },
  { code: '+40', label: 'RO (+40)' },
  { code: '+380', label: 'UA (+380)' },
  { code: '+30', label: 'GR (+30)' },
  { code: '+972', label: 'IL (+972)' },
  { code: '+92', label: 'PK (+92)' },
  { code: '+880', label: 'BD (+880)' },
  { code: '+94', label: 'LK (+94)' },
  { code: '+977', label: 'NP (+977)' },
  { code: '+95', label: 'MM (+95)' },
  { code: '+84', label: 'VN (+84)' },
  { code: '+57', label: 'CO (+57)' },
  { code: '+54', label: 'AR (+54)' },
  { code: '+56', label: 'CL (+56)' },
  { code: '+51', label: 'PE (+51)' },
  { code: '+58', label: 'VE (+58)' },
  { code: '+593', label: 'EC (+593)' },
];

const FIELDS = [
  { name: 'fullName',  label: 'Full name',          col: '1 / -1', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "Only letters and spaces allowed" },
  { name: 'email',     label: 'Email address',       col: '1 / -1', type: 'email' },
  { name: 'phone',     label: 'Phone number',        col: '', type: 'tel', isPhone: true },
  { name: 'address',   label: 'Street address',      col: '1 / -1', type: 'text' },
  { name: 'city',      label: 'City',                col: '', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "City name should contain only letters" },
  { name: 'state',     label: 'State / Province',    col: '', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "State name should contain only letters" },
  { name: 'zip',       label: 'ZIP / Postal code',   col: '', type: 'text', pattern: "^(?=.*[0-9])[a-zA-Z0-9\\s\\-]{3,10}$", title: "Valid ZIP/Postal code required (must contain numbers)" },
  { name: 'country',   label: 'Country',             col: '', type: 'text', pattern: "^[a-zA-Z\\s\\-']{2,}$", title: "Country name should contain only letters" },
];

interface AddrType { fullName: string; email: string; phone: string; phoneCode: string; address: string; city: string; state: string; zip: string; country: string; }

function AddressForm({ values, onChange, onCodeChange }: { values: AddrType; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onCodeChange?: (code: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
      {FIELDS.map(field => (
        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gridColumn: field.col || '' }}>
          <label style={labelStyle}>{field.label.charAt(0).toUpperCase() + field.label.slice(1)}</label>
          {field.isPhone ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={values.phoneCode || '+1'}
                onChange={e => onCodeChange && onCodeChange(e.target.value)}
                style={{ ...inputStyle, width: '130px', flexShrink: 0 }}
              >
                {COUNTRY_CODES.map(cc => (
                  <option key={cc.code} value={cc.code}>{cc.label}</option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                value={values.phone}
                onChange={onChange}
                style={{ ...inputStyle, flex: 1 }}
                required
                placeholder="Phone number"
                pattern="^[0-9\-\s\(\)]{5,15}$"
                title="Valid phone number required"
              />
            </div>
          ) : (
            <input 
              type={field.type || "text"}
              name={field.name} 
              value={(values as any)[field.name]} 
              onChange={onChange} 
              style={inputStyle} 
              required 
              placeholder={field.label.charAt(0).toUpperCase() + field.label.slice(1)}
              pattern={(field as any).pattern}
              title={(field as any).title}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const EMPTY: AddrType = { fullName: '', email: '', phone: '', phoneCode: '+1', address: '', city: '', state: '', zip: '', country: '' };

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const deliveryCharge = 0;
  const finalTotal = total + deliveryCharge;

  // Open checkout automatically when ?checkout=1 is in the URL
  useEffect(() => {
    if (searchParams.get('checkout') === '1' && user && count > 0) {
      setShowCheckout(true);
      window.scrollTo({ top: 0 });
    }
  }, [searchParams, user, count]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (e.target.name !== 'email' && typeof val === 'string' && val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setShipping(prev => ({ ...prev, [e.target.name]: val }));
  };

  const handleDetectAddress = () => {
    if ("geolocation" in navigator) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          if (data && data.address) {
            let detectedPhoneCode = shipping.phoneCode || '+1';
            if (data.address.country_code) {
              const detectedIso = data.address.country_code.toLowerCase();
              const isoToCode: Record<string, string> = { us: '+1', ca: '+1', gb: '+44', au: '+61', in: '+91', jp: '+81', de: '+49', fr: '+33', it: '+39', es: '+34', br: '+55', mx: '+52', kr: '+82', cn: '+86', sg: '+65', ae: '+971', sa: '+966', za: '+27', ru: '+7', pt: '+351', nl: '+31', nz: '+64', eg: '+20', ng: '+234', ke: '+254', my: '+60', id: '+62', ph: '+63', th: '+66', tr: '+90', se: '+46', no: '+47', dk: '+45', fi: '+358', pl: '+48', cz: '+420', hu: '+36', ro: '+40', ua: '+380', gr: '+30', il: '+972', pk: '+92', bd: '+880', lk: '+94', np: '+977', mm: '+95', vn: '+84', co: '+57', ar: '+54', cl: '+56', pe: '+51', ve: '+58', ec: '+593' };
              detectedPhoneCode = isoToCode[detectedIso] || detectedPhoneCode;
            }
            setShipping(prev => ({
              ...prev,
              phoneCode: detectedPhoneCode,
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
            let detectedPhoneCode = billing.phoneCode || '+1';
            if (data.address.country_code) {
              const detectedIso = data.address.country_code.toLowerCase();
              const isoToCode: Record<string, string> = { us: '+1', ca: '+1', gb: '+44', au: '+61', in: '+91', jp: '+81', de: '+49', fr: '+33', it: '+39', es: '+34', br: '+55', mx: '+52', kr: '+82', cn: '+86', sg: '+65', ae: '+971', sa: '+966', za: '+27', ru: '+7', pt: '+351', nl: '+31', nz: '+64', eg: '+20', ng: '+234', ke: '+254', my: '+60', id: '+62', ph: '+63', th: '+66', tr: '+90', se: '+46', no: '+47', dk: '+45', fi: '+358', pl: '+48', cz: '+420', hu: '+36', ro: '+40', ua: '+380', gr: '+30', il: '+972', pk: '+92', bd: '+880', lk: '+94', np: '+977', mm: '+95', vn: '+84', co: '+57', ar: '+54', cl: '+56', pe: '+51', ve: '+58', ec: '+593' };
              detectedPhoneCode = isoToCode[detectedIso] || detectedPhoneCode;
            }
            setBilling(prev => ({
              ...prev,
              phoneCode: detectedPhoneCode,
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

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (e.target.name !== 'email' && typeof val === 'string' && val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setBilling(prev => ({ ...prev, [e.target.name]: val }));
  };

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
          status: 'ORDER_RECEIVED',
          shippingAddr: { ...shipping, phone: `${shipping.phoneCode || '+1'}${shipping.phone}` },
          billingAddr: billingSame ? { ...shipping, phone: `${shipping.phoneCode || '+1'}${shipping.phone}` } : { ...billing, phone: `${billing.phoneCode || '+1'}${billing.phone}` },
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
            <div style={{ flex: '1 1 min(100%, 580px)', minWidth: 0 }}>
              <div className="card card-responsive-padding" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {items.map((item, index) => (
                  <div key={item.id} className="cart-item-row" style={{ paddingBottom: index < items.length - 1 ? '2rem' : 0, borderBottom: index < items.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <div className="cart-item-image-wrapper">
                      {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.category === 'Non-Customizable' ? '🛍️' : '🛋️')}
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-title-row">
                        <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} style={{ color: 'var(--error)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Remove</button>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        {item.category === 'Non-Customizable' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Ready-made Product
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f3e8ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Custom Cushion
                          </span>
                        )}
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
                      <div className="cart-item-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Qty:</label>
                          <select value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                            style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                            {Array.from({ length: item.category === 'Non-Customizable' && item.stock ? Math.min(item.stock, 10) : 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
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
            <div style={{ flex: '1 1 min(100%, 280px)', maxWidth: '100%', width: '100%', flexBasis: '280px' }}>
              <div className="card card-responsive-padding" style={{ position: 'sticky', top: 'calc(var(--nav-height, 80px) + 2rem)' }}>
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
              <div style={{ flex: '1 1 min(100%, 560px)', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <div className="card card-responsive-padding">
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
                  <AddressForm values={shipping} onChange={handleShippingChange} onCodeChange={(code) => setShipping(prev => ({ ...prev, phoneCode: code }))} />
                </div>

                <div className="card card-responsive-padding">
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
                    : <AddressForm values={billing} onChange={handleBillingChange} onCodeChange={(code) => setBilling(prev => ({ ...prev, phoneCode: code }))} />
                  }
                </div>

                <div className="card card-responsive-padding">
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
              <div style={{ flex: '1 1 min(100%, 280px)', maxWidth: '100%', width: '100%', flexBasis: '280px' }}>
                <div className="card card-responsive-padding" style={{ position: 'sticky', top: 'calc(var(--nav-height, 80px) + 2rem)' }}>
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
