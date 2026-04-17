'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SiteSettings {
  siteName: string;
  logoUrl: string;
  siteTagline: string;
  initialized: boolean;   // true once the fetch has completed
}

const defaults: SiteSettings = {
  siteName: '',          // empty until initialized — prevents flash
  logoUrl: '',
  siteTagline: '',
  initialized: false,
};

const SiteContext = createContext<SiteSettings>(defaults);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setSettings({
            siteName:    data.siteName    ?? '',   // ?? keeps empty string as-is
            logoUrl:     data.logoUrl     ?? data.siteLogo ?? '',
            siteTagline: data.siteTagline ?? '',
            initialized: true,
          });
        } else {
          setSettings(prev => ({ ...prev, initialized: true }));
        }
      })
      .catch(() => {
        // On error, still mark initialized so we fall back to defaults gracefully
        setSettings(prev => ({ ...prev, initialized: true }));
      });
  }, []);

  return <SiteContext.Provider value={settings}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
