'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminPlaceholderPage() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <div className="p-20 text-center">Loading...</div>;

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--brand-primary)', marginBottom: '1rem' }}>Support Messages coming soon</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>Message center will allow you to read queries incoming from the website.</p>
      <Link href="/admin" className="btn btn-primary">Back to Dashboard</Link>
    </div>
  );
}
