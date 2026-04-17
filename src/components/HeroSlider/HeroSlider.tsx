'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './HeroSlider.module.css';

const SLIDES = [
  {
    badge: 'PERFORMANCE',
    title: 'RV Cushions',
    subtitle: 'Wrap your adventures in comfort with our RV cushion covers from CushionGuru – where every journey feels like home.',
    cta: 'Buy Now',
    href: '/shop/rv',
    mediaKey: 'shop_rv_hero',
    gradient: 'linear-gradient(135deg, #1a3c5e 0%, #FBB91E 100%)',
    emoji: '🚌',
  },
  {
    badge: 'PERFORMANCE',
    title: 'Indoor Cushions',
    subtitle: 'Transform your living space with the exquisite elegance of the Indoor Cushion Cover from CushionGuru, where comfort meets style seamlessly.',
    cta: 'Buy Now',
    href: '/shop/indoor',
    mediaKey: 'shop_indoor_hero',
    gradient: 'linear-gradient(135deg, #2c1654 0%, #1a3c5e 100%)',
    emoji: '🛋️',
  },
  {
    badge: 'PERFORMANCE',
    title: 'Pet Beds',
    subtitle: 'Where comfort meets style, cushion your pet\'s dreams with our bespoke pet beds from CushionGuru.',
    cta: 'Buy Now',
    href: '/shop/pet-bed',
    mediaKey: 'shop_pet-bed_hero',
    gradient: 'linear-gradient(135deg, #6b3a2a 0%, #c0652b 100%)',
    emoji: '🐾',
  },
  {
    badge: 'PERFORMANCE',
    title: 'Outdoor Cushions',
    subtitle: 'Experience comfort that lasts with CushionGuru\'s outdoor cushion covers where style meets durability, outdoors!',
    cta: 'Buy Now',
    href: '/shop/outdoor',
    mediaKey: 'shop_outdoor_hero',
    gradient: 'linear-gradient(135deg, #1a4a28 0%, #FBB91E 100%)',
    emoji: '☀️',
  },
  {
    badge: 'PERFORMANCE',
    title: 'Boat Cushions',
    subtitle: 'Where comfort meets style, cushion your Boat Cushions dreams with our bespoke Boat Cushions from CushionGuru.',
    cta: 'Buy Now',
    href: '/shop/boat',
    mediaKey: 'shop_boat_hero',
    gradient: 'linear-gradient(135deg, #0d2d4a 0%, #1a5d8a 100%)',
    emoji: '⛵',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [bannerUrls, setBannerUrls] = useState<Record<string, string>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch('/api/media?prefix=shop_', { cache: 'no-store' });
        if (!res.ok) return;
        const items: Array<{ key: string; url: string }> = await res.json();
        const map: Record<string, string> = {};
        items.forEach(item => {
          if (item.key && item.url) map[item.key] = item.url;
        });
        setBannerUrls(map);
      } catch (err) {
        console.error('Failed to load hero banner media:', err);
      }
    };

    loadBanners();
  }, []);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setTimeout(next, 5500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next]);

  const slide = SLIDES[current];
  const imageUrl = slide.mediaKey ? bannerUrls[slide.mediaKey] : undefined;

  return (
    <section
      className={styles.hero}
      aria-label="Hero slider"
      style={{
        background: imageUrl
          ? `linear-gradient(rgba(0,0,0,0.26), rgba(0,0,0,0.26)), url(${imageUrl}) center/cover no-repeat`
          : slide.gradient,
      }}
    >
      {/* Slide content */}
      <div className={`container ${styles.content} ${animating ? styles.exit : styles.enter}`}>
        <span className={styles.badge}>{slide.badge}</span>
        <h1 className={styles.title}>{slide.emoji} {slide.title}</h1>
        <p className={styles.subtitle}>{slide.subtitle}</p>
        <div className={styles.ctas}>
          <Link href={slide.href} className="btn btn-accent btn-lg">{slide.cta}</Link>
          <Link href="/customize" className="btn btn-ghost btn-lg">Customize Yours</Link>
        </div>
        <a href="#below-hero" className={styles.scrollCue} aria-label="Scroll down">
          <span>Scroll Down</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </a>
      </div>

      {/* Decorative shapes */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Controls */}
      <button onClick={prev} className={`${styles.arrow} ${styles.arrowLeft}`} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button onClick={next} className={`${styles.arrow} ${styles.arrowRight}`} aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      {/* Dots */}
      <div className={styles.dots} role="tablist" aria-label="Slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            role="tab"
            aria-selected={i === current}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className={styles.counter} aria-live="polite" aria-atomic="true">
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
}
