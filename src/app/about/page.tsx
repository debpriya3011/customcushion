import type { Metadata } from 'next';
import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';
import styles from './about.module.css';
import EditableMedia from '@/components/EditableMedia/EditableMedia';
import AboutNewsletterForm from './AboutNewsletterForm';

export const metadata: Metadata = {
  title: 'About CushionGuru',
  description: 'Learn about CushionGuru LLC, the New York leader in custom comfort cushions powered by Sunbrella® fabrics.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <span className="badge">Our Story</span>
              <h1>About CushionGuru</h1>
              <p>Cushion Guru LLC: The New York Leader in Custom Comfort</p>
            </div>
            <EditableMedia 
              mediaKey="about_hero" 
              type="image" 
              className={`img-placeholder ${styles.heroImg}`} 
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`section-padding ${styles.section}`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>🎯</div>
              <h2>Our Mission</h2>
              <p>At Cushion Guru LLC, a New York-based company, we are passionate about delivering uniquely crafted comfort and style. We achieve this through customized cushion solutions that enhance every seating experience, transforming your vision into a reality.</p>
            </div>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>🔭</div>
              <h2>Our Vision</h2>
              <p>We strive to be the industry leader in cushion innovation. We are recognized for our unwavering commitment to quality and personalized service that caters to the specific needs and visions of our clients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* UVP section */}
      <section className={`section-padding ${styles.uvpSection}`}>
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">What Sets Us Apart</span>
            <h2>Our Unique Value Proposition</h2>
            <div className="divider" />
          </div>

          <div className={styles.uvpList}>
            {[
              { icon: '🎨', title: 'Customized Comfort', text: 'We understand that one size does not fit all. That\'s why we prioritize customization, offering a vast selection of fabrics, shapes, sizes, and fills to design the perfect cushion for any space.' },
              { icon: '🏆', title: 'Expertise and Experience', text: 'With years of experience in the industry, our team possesses a profound understanding of fabrics, design, and cushion management, delivering innovative solutions for all your cushion requirements.' },
              { icon: '⚡', title: 'Efficient Teamwork', text: 'Our dedicated team collaborates seamlessly to shorten delivery times without compromising on quality. Through effective communication and streamlined processes, we ensure faster delivery than industry standards.' },
              { icon: '📦', title: 'Bulk Personalization', text: 'We excel at handling large-scale personalized orders. Whether you need to outfit an entire marina or furnish multiple locations, we manage bulk orders with the same meticulous attention to detail.' },
            ].map((item, i) => (
              <div key={i} className={styles.uvpItem}>
                <span className={styles.uvpIcon}>{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className={`section-padding-sm ${styles.videoSection}`}>
        <div className="container">
          <EditableMedia
            mediaKey="about_video"
            type="video"
            className="video-placeholder"
            style={{ maxWidth: '860px', margin: '0 auto' }}
            defaultComponent={
              <div className="video-placeholder-inner">
                <div className="video-placeholder-play">
                  <svg viewBox="0 0 24 24" fill="white" width="32" height="32"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <span>Our Story Video</span>
              </div>
            }
          />
        </div>
      </section>

      {/* Sunbrella cert */}
      <section className={`section-padding ${styles.certSection}`}>
        <div className="container">
          <div className={styles.certGrid}>
            <div className={styles.certText}>
              <span className="badge badge-accent">Certified Partner</span>
              <h2>Sunbrella Certification</h2>
              <p>We are proud to use Sunbrella fabrics, renowned for their durability, fade resistance, and easy maintenance. This certification signifies that our products offer long-term performance and exceptional durability, perfect for any environment.</p>
              <div className={styles.certBadges}>
                <div className={styles.certBadge}><span>💧</span> Water Resistant</div>
                <div className={styles.certBadge}><span>☀️</span> Fade Resistant</div>
                <div className={styles.certBadge}><span>🌿</span> Eco Certified</div>
              </div>
            </div>
            <EditableMedia 
              mediaKey="about_cert_first" 
              type="image" 
              className={`img-placeholder ${styles.certImg}`} 
            />
          </div>
        </div>
      </section>

      {/* Care section */}
      <section className={`section-padding ${styles.careSection}`}>
        <div className="container">
          <div className={styles.certGrid}>
            <EditableMedia 
              mediaKey="about_care_img" 
              type="image" 
              className={`img-placeholder ${styles.certImg}`} 
            />
            <div>
              <h2>Care &amp; Protection</h2>
              <p>We want you and your customers to have the best experience possible with our fabrics. CushionGuru is here for you, delivering customer service and peace of mind long after the sale.</p>
              <p style={{ marginTop: '1rem' }}>Most fabrics have been tested to achieve key safety certifications, like <strong>GREENGUARD Gold</strong> and <strong>OEKO-TEX®</strong>, to ensure our fabrics are not made with harmful substances.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.subSection}>
        <div className="container text-center">
          <h2>Subscribe for New Products</h2>
          <p>Join our mailing list!</p>
          <AboutNewsletterForm />
        </div>
      </section>
    </>
  );
}
