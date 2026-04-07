'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';
import Newsletter from '@/components/home/Newsletter';

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSent(true); setForm({ name: '', email: '', message: '' }); }
      else { const d = await res.json(); setError(d.error ?? 'Failed'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="badge">Get in Touch</span>
            <h1>Our friendly team is always here to chat.</h1>
            <p>We&rsquo;re here for you · Contact Us</p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className={`section-padding ${styles.section}`}>
        <div className="container">
          <div className={styles.grid}>
            {/* Form */}
            <div className={styles.formSide}>
              <h2>Get In Touch</h2>
              <p className={styles.subtext}>Your email address will not be published. Required fields are marked <span style={{ color: 'var(--error)' }}>*</span></p>

              {sent ? (
                <div className="alert alert-success" style={{ marginTop: '2rem' }}>
                  ✅ Thank you! We&rsquo;ll get back to you within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  {error && <div className="alert alert-error">{error}</div>}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Name <span>*</span></label>
                    <input id="contact-name" name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleInput} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email <span>*</span></label>
                    <input id="contact-email" name="email" type="email" placeholder="Your Email Address" value={form.email} onChange={handleInput} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Message <span>*</span></label>
                    <textarea id="contact-message" name="message" placeholder="Your question or message" value={form.message} onChange={handleInput} className="form-control" rows={6} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} id="contact-submit">
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Map + Info */}
            <div className={styles.infoSide}>
              {/* Google Map placeholder */}
              <div className={styles.map}>
                <iframe
                  title="CushionGuru HQ"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3017.2!2d-73.486!3d40.746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzQ1LjYiTiA3M8KwMjknMTEuNiJX!5e0!3m2!1sen!2sus!4v1234"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <span>📍</span>
                  <div>
                    <strong>Address</strong>
                    <p>328 Stewart Avenue, Bethpage, New York 11714</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <span>✉️</span>
                  <div>
                    <strong>Email</strong>
                    <a href="https://mail.google.com/mail/?fs=1&to=contact@cushionguru.com&tf=cm" target="_blank" rel="noopener noreferrer">contact@cushionguru.com</a>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <span>🌐</span>
                  <div>
                    <strong>Website</strong>
                    <a href="https://cushionguru.com" target="_blank" rel="noopener noreferrer">cushionguru.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
