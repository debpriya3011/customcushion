import React from 'react';
import styles from './DesignPerformance.module.css';
import EditableMedia from '@/components/EditableMedia/EditableMedia';

const BADGES = [
  { icon: '💧', label: 'WATER & STAIN RESISTANT' },
  { icon: '☀️', label: 'UV/FADE RESISTANT' },
  { icon: '🧹', label: 'BLEACH CLEANABLE' },
  { icon: '🌿', label: 'MOLD/MILDEW RESISTANT' },
  { icon: '💨', label: 'BREATHABLE COMFORT' },
  { icon: '🛡️', label: 'SUN PROTECTION' },
];

export default function DesignPerformance() {
  return (
    <section className={`section-padding ${styles.section}`} aria-labelledby="design-perf-title">
      <div className="container">
        <div className={styles.grid}>
          {/* Text */}
          <div className={styles.textSide}>
            <span className="badge badge-accent">Partnership</span>
            <h2 id="design-perf-title">Design &amp; Performance</h2>
            <div className={styles.logoRow}>
              <div className={styles.logoBox}>CushionGuru</div>
              <span className={styles.cross}>×</span>
              <div className={styles.logoBox}>Sunbrella®</div>
            </div>
            <p className={styles.quote}>&ldquo;Your Vision, Our Craftsmanship&rdquo;</p>
            <p>
              In a groundbreaking collaboration, CushionGuru proudly partners with Sunbrella, combining their renowned fabric expertise 
              with our commitment to comfort and style. With Sunbrella&rsquo;s premium quality fabrics, we elevate our cushion covers to 
              unparalleled excellence, ensuring durability, fade resistance, and easy maintenance. Experience the pinnacle of luxury and 
              performance as we deliver nothing short of perfection in every stitch, setting the standard as the premier destination for 
              top-tier fabric cushion covers.
            </p>

            {/* Badge grid */}
            <div className={styles.badgeGrid}>
              {BADGES.map((b, i) => (
                <div key={i} className={styles.badge}>
                  <div className={styles.badgeIcon}>{b.icon}</div>
                  <span className={styles.badgeLabel}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className={styles.imageSide}>
            <div className={styles.imgFrame}>
              <EditableMedia
                mediaKey="home_design_performance"
                type="image"
                className={`img-placeholder ${styles.mainImg}`}
                defaultComponent={
                  <div className={styles.imgLabel}>CushionGuru × Sunbrella®<br/>Partnership Photo</div>
                }
              />
              <div className={styles.floatCard}>
                <span>🏅</span>
                <div>
                  <strong>Sunbrella® Certified</strong>
                  <p>Premium fabric partner since 2018</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
