'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './account.module.css';

export default function AccountPageClient() {
  const { user, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.replace(user.role === 'ADMIN' ? '/admin' : '/account/dashboard');
    }
  }, [user, router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (mode === 'login') {
      const result = await login(form.email, form.password);
      if (result.ok) {
        router.push('/account/dashboard');
      } else {
        setError(result.error ?? 'Something went wrong');
      }
    } else {
      if (!termsAccepted) {
        setError('You must accept the Terms & Conditions to create an account.');
        setLoading(false);
        return;
      }
      const result = await register(form.name, form.email, form.password, showOtp ? otp : undefined);
      if (result.requireOtp) {
        setShowOtp(true);
      } else if (result.ok) {
        router.push('/account/dashboard');
      } else {
        setError(result.error ?? 'Something went wrong');
      }
    }
    setLoading(false);
  };

  const handleTabSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setShowOtp(false);
    setOtp('');
    setTermsAccepted(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`} onClick={() => handleTabSwitch('login')}>
            Login
          </button>
          <button className={`${styles.tab} ${mode === 'register' ? styles.active : ''}`} onClick={() => handleTabSwitch('register')}>
            Register
          </button>
        </div>

        <div className={styles.header}>
          <div className={styles.logo}>🛋️</div>
          <h1>{showOtp ? 'Verify Email' : (mode === 'login' ? 'Welcome Back' : 'Create Account')}</h1>
          <p>{showOtp ? 'Enter the verification code sent to your email.' : (mode === 'login' ? 'Sign in to your CushionGuru account' : 'Join CushionGuru for custom cushions')}</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {showOtp ? (
            <div className="form-group">
              <label className="form-label" htmlFor="acc-otp">Verification Code <span style={{ color: 'var(--error)' }}>*</span></label>
              <input id="acc-otp" name="otp" type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control" required autoFocus />
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="acc-name">Full Name</label>
                  <input id="acc-name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleInput} className="form-control" />
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="acc-email">Username or Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                <input id="acc-email" name="email" type="email" placeholder="Email address" value={form.email} onChange={handleInput} className="form-control" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="acc-pwd">Password <span style={{ color: 'var(--error)' }}>*</span></label>
                <div className={styles.pwdWrap}>
                  <input
                    id="acc-pwd"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={form.password}
                    onChange={handleInput}
                    className="form-control"
                    required
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)} aria-label="Toggle password visibility">
                    {showPwd ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className={styles.options}>
              <label className={styles.checkLabel}>
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleInput} id="remember-me" />
                Remember me
              </label>
              <Link href="/account/forgot-password" className={styles.forgot}>Lost your password?</Link>
            </div>
          )}

          {mode === 'register' && !showOtp && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="terms-accept"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                style={{ width: '16px', height: '16px', marginTop: '3px', cursor: 'pointer', flexShrink: 0 }}
              />
              <label htmlFor="terms-accept" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the{' '}
                <Link href="/terms" style={{ color: 'var(--brand-primary)', fontWeight: 600 }} target="_blank">Terms &amp; Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" style={{ color: 'var(--brand-primary)', fontWeight: 600 }} target="_blank">Privacy Policy</Link>
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} id="account-submit">
            {loading ? (mode === 'login' ? 'Signing in…' : (showOtp ? 'Verifying…' : 'Sending Code…')) : (mode === 'login' ? 'Log In' : (showOtp ? 'Verify Code' : 'Create Account'))}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>
        <p className={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className={styles.switchBtn} onClick={() => handleTabSwitch(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
