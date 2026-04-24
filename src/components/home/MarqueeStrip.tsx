'use client';

import React from 'react';
import Image from 'next/image';
import styles from './MarqueeStrip.module.css';

const ITEMS = [
  'https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/StripImages/image-145-1.webp',
  'https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/StripImages/Group-688.webp',
  'https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/StripImages/Group-684.webp',
  'https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/StripImages/image-62.webp',
  'https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/StripImages/pngegg-4-1.webp',
  'https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/StripImages/pngfind-1.webp'
];

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            <div className={styles.imgWrapper}>
              <Image src={item} alt="Partner" fill style={{ objectFit: 'contain' }} sizes="250px" />
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}
