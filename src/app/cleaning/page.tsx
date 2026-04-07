import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './cleaning.module.css';

export const metadata: Metadata = {
  title: 'Cleaning Guide',
  description: 'Download the CushionGuru cleaning guide and learn how to care for your Sunbrella® cushion covers.',
};

export default function CleaningPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.overlay} />
      <div className={`container ${styles.content}`}>
        <h1>Cushion Care &amp; Cleaning</h1>
        <p>Keep your premium cushions looking brand new with our expert cleaning guides</p>
        <div className={styles.buttons}>
          <a href="https://www.sunbrella.com/media/pdf/sunbrella-cleaning-guide-en-us.pdf" target="_blank" download className="btn btn-accent btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Cleaning Guide PDF
          </a>
          <a href="https://www.sunbrella.com/cleaning-guide" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Sunbrella Solution
          </a>
        </div>
        <div className={styles.tips}>
          <div className={styles.tip}><span>🧹</span><strong>Regular Care</strong><p>Brush off dry dirt before it embeds into fabric</p></div>
          <div className={styles.tip}><span>💧</span><strong>Spot Clean</strong><p>Use mild soap and lukewarm water — no bleach needed</p></div>
          <div className={styles.tip}><span>☀️</span><strong>Air Dry</strong><p>Always air dry your cushion covers before storing</p></div>
          <div className={styles.tip}><span>🌿</span><strong>Deep Clean</strong><p>Machine wash on gentle cycle for thorough cleaning</p></div>
        </div>
      </div>
    </div>
  );
}
