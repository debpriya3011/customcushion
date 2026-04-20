import React from 'react';
import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';
import styles from './ShopPage.module.css';
import EditableMedia from '@/components/EditableMedia/EditableMedia';

interface Section {
  title: string;
  text: string;
  img: string;
  reverse?: boolean;
}

interface ShopPageProps {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  sections: Section[];
  tagline: string;
  customizeType: string;
}

export default function ShopPage({ badge, heroTitle, heroSubtitle, introText, sections, tagline, customizeType }: ShopPageProps) {
  return (
    <>
      {/* Hero video */}
      <section className={styles.heroVideo}>
        <EditableMedia
          mediaKey={`shop_${customizeType}_hero`}
          type="video"
          className={styles.heroMedia}
          style={{ borderRadius: 0 }}
          defaultComponent={
            <div className="video-placeholder-inner">
              <div className="video-placeholder-play">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
            </div>
          }
        />
        <div className={styles.heroOverlay}>
          <div className="container">
            <span className={styles.badge}>{badge}</span>
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
            {customizeType && (
              <Link href={`/customize?type=${customizeType}`} className="btn btn-accent" style={{ marginTop: '1rem', border: '2px solid black' }}>
                Customize Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className={`section-padding-sm ${styles.intro}`}>
        <div className="container-narrow text-center">
          <p className={styles.introText}>{introText}</p>
        </div>
      </section>

      {/* Feature sections */}
      {sections.map((section, i) => (
        <section key={i} className={`section-padding-sm ${i % 2 === 0 ? styles.sectionLight : styles.sectionWhite}`}>
          <div className="container">
            <div className={`${styles.featureGrid} ${section.reverse ? styles.reverse : ''}`}>
              <div className={styles.featureText}>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </div>
              <EditableMedia
                mediaKey={`shop_${customizeType}_section_${i}`}
                type="image"
                className={`img-placeholder ${styles.featureImg}`}
                defaultComponent={
                  <span className={styles.imgCaption}>{section.img}</span>
                }
              />
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container text-center">
          <div className={styles.tagline}>{tagline}</div>
          <Link href={`/customize?type=${customizeType}`} className="btn btn-accent btn-lg" style={{ border: '2px solid black' }}>
            Customize Your Cushion
          </Link>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
