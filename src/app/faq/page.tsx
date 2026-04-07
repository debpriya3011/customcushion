import type { Metadata } from 'next';
import styles from './faq.module.css';
import FAQAccordion from './FAQAccordion';
import Newsletter from '@/components/home/Newsletter';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about CushionGuru custom cushions, Sunbrella fabrics, shipping, and more.',
};

export default function FAQPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our custom cushions</p>
        </div>
      </section>
      <section className={`section-padding ${styles.section}`}>
        <div className="container-narrow">
          <FAQAccordion />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
