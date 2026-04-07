'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface EditableMediaProps {
  mediaKey: string;
  type?: 'image' | 'video';
  defaultComponent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditableMedia({ mediaKey, type = 'image', defaultComponent, className = '', style }: EditableMediaProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [url, setUrl] = useState<string | null>(null);
  // Don't flash fallback initially if we check fast
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/media/${mediaKey}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.url) setUrl(data.url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mediaKey]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', mediaKey);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      // clear input
      e.target.value = '';
    }
  };

  const wrapWithEdit = (content: React.ReactNode) => {
    if (!isAdmin) return <div className={`editable-media-wrapper ${className}`} style={style}>{content}</div>;

    return (
      <div className={`editable-media-wrapper editable-admin ${className}`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
        {content}
        <div className="edit-overlay" style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0,
          transition: 'opacity 0.2s', cursor: 'pointer', zIndex: 10, fontWeight: 600
        }}>
          {uploading ? 'Uploading...' : `Upload ${type === 'video' ? 'Video' : 'Image'}`}
          <input type="file" accept={type === 'video' ? 'video/*' : 'image/*'} 
                 onChange={handleUpload} 
                 style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                 disabled={uploading} />
        </div>
      </div>
    );
  };

  if (loading && !url) {
    return wrapWithEdit(defaultComponent || <div className={`img-placeholder ${className}`} style={{ width: '100%', height: '100%' }} />);
  }

  if (url) {
    if (type === 'video') {
      return wrapWithEdit(
        // Use a key to force reload if url changes
        <video key={url} src={url} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      );
    }
    return wrapWithEdit(
      <img src={url} alt={mediaKey} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    );
  }

  return wrapWithEdit(defaultComponent || <div className={`img-placeholder ${className}`} style={{ width: '100%', height: '100%' }} />);
}
