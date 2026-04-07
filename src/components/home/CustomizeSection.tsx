'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CustomizeSection.module.css';
import EditableMedia from '@/components/EditableMedia/EditableMedia';

const TYPES = ['Indoor', 'Outdoor', 'Boat', 'RV', 'Pet'];

export default function CustomizeSection() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [fade,    setFade]    = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTypeIdx(i => (i + 1) % TYPES.length);
        setFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`section-padding ${styles.section}`} aria-labelledby="customize-title">
      <div className="container">
        <div className={styles.grid}>
          {/* Image */}
          <div className={styles.imageSide}>
            <EditableMedia
              mediaKey="home_customize_section"
              type="image"
              className={`img-placeholder ${styles.img}`}
              defaultComponent={
                <div className={styles.imgLabel}>🐾 Calming round pet bed for dogs and cats</div>
              }
            />
            <div className={styles.imgBadge}>
              <span>🌟</span>
              <div>
                <strong>100% Custom</strong>
                <p>Made to your exact specs</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className={styles.textSide}>
            <span className="badge">Customization</span>
            <h2 id="customize-title">
              Customize your{' '}
              <span className={`${styles.dynamic} ${fade ? styles.visible : styles.hidden}`}>
                {TYPES[typeIdx]}
              </span>{' '}
              Cushion Covers
            </h2>
            <p>
              Cushion Guru offers complete freedom to customize cushion covers that reflect your personal style and the way you live. 
              From precise sizing and premium fabrics to carefully selected colors and designs, every detail is chosen by you and crafted 
              with intention. Whether enhancing a living space, refining a bedroom, or creating a thoughtful, made-to-order piece, Cushion Guru 
              makes customization effortless—transforming your vision into beautifully tailored comfort.
            </p>
            <div className={styles.stats}>
              {[['500+', 'Fabric Options'], ['99%', 'Satisfaction Rate'], ['3-4wk', 'Avg. Delivery']].map(([num, lbl]) => (
                <div key={lbl} className={styles.stat}>
                  <strong>{num}</strong>
                  <span>{lbl}</span>
                </div>
              ))}
            </div>
            <Link href="/customize" className={`btn btn-primary btn-lg ${styles.ctaBtn}`}>
              Customize Now
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
