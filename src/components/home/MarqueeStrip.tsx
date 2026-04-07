'use client';

import React from 'react';
import styles from './MarqueeStrip.module.css';

const ITEMS = [
  '🛋️ Indoor Cushions',
  '☀️ Outdoor Cushions',
  '🚌 RV Cushions',
  '⛵ Boat Cushions',
  '🐾 Pet Beds',
  '🌿 Sunbrella® Fabrics',
  '🏭 Factory Direct',
  '🌍 Free Worldwide Shipping',
  '✅ Perfect Fit Guarantee',
  '⚡ Fast Turnaround',
];

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.sep}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
