import React from 'react';
import styles from './PremiumSection.module.css';

export default function PremiumSection() {
  return (
    <section className={`section-padding-sm ${styles.section}`} aria-labelledby="premium-title">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.text}>
            <h2 id="premium-title">Premium Custom Cushions for Every Home</h2>
            <p>
              At Cushion Guru, we specialize in high-quality custom cushions designed to fit your unique furniture.
              Whether you need replacement cushions for outdoor furniture, a cozy window seat cushion, or durable marine-grade seating,
              our expert team crafts each piece to your exact specifications.
            </p>
            <h3>Sunbrella® Fabric Excellence</h3>
            <p>
              We partner exclusively with Sunbrella® to ensure your outdoor patio cushions withstand the elements.
              Fade-resistant, water-repellent, and easy to clean, our fabrics ensure your investment looks new for years.
              Browse our collection of custom bench cushions and elevate your living space today.
            </p>
          </div>
          <div className={styles.badges}>
            {[
              { icon: '🌿', text: 'Eco-Friendly Materials' },
              { icon: '🏅', text: 'Award-Winning Craft' },
              { icon: '🔒', text: 'Secure Checkout' },
              { icon: '🌍', text: 'Ships Worldwide' },
            ].map((b, i) => (
              <div key={i} className={styles.badge}>
                <span>{b.icon}</span>
                <strong>{b.text}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
