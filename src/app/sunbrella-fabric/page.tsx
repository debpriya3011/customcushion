import React from 'react';
import Image from 'next/image';
import EditableMedia from '@/components/EditableMedia/EditableMedia';
import styles from './Sunbrella.module.css';

export const metadata = {
  title: 'Sunbrella Fabrics | CushionGuru',
  description: 'Learn why CushionGuru partners with Sunbrella to bring you the best in performance, durability, and style.',
};

export default function SunbrellaPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          {/* The user can change this to be dynamic via admin later */}
          <EditableMedia
            mediaKey="sunbrella-hero"
            style={{ width: '100%', height: '100%' }}
            priority
            defaultComponent={
              <Image
                src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/sunbrella-hero.jpg"
                alt="Sunbrella Hero"
                fill
                style={{ objectFit: 'cover' }}
                priority
                unoptimized
              />
            }
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.slideText1}>CUSTOM + DESIGN + PERFORMANCE</h1>
          <h1 className={styles.slideText2}>CUSTOM YOUR SPACE NOW.....</h1>
          <h1 className={styles.slideText3}>DESIGN + PERFORMANCE = SUNBRELLA</h1>
        </div>
      </section>

      <div className={styles.container}>
        {/* Intro Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Colab with Sunbrella</h2>
          <p className={styles.sectionText}>
            Sunbrella® is a global leader in high-performance fabrics, trusted in homes, luxury hospitality, marine, and outdoor environments worldwide. Designed for everyday living, Sunbrella fabrics combine comfort, durability, and timeless style—while maintaining vibrant colors year after year. They’re easy to clean, built to handle spills, sunlight, and weather, and engineered to perform beautifully over time.
          </p>
        </section>

        {/* Color to the Core */}
        <section className={styles.grid}>
          <div className={styles.gridImage}>
            <EditableMedia
              mediaKey="sunbrella-color-core"
              className={styles.heroImage}
              defaultComponent={
                <Image
                  src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/color-core.jpg"
                  alt="Color to the Core Technology"
                  fill
                  className={styles.heroImage}
                  unoptimized
                />
              }
            />
          </div>
          <div className={styles.gridContent}>
            <h2 className={styles.gridTitle}>Color to the Core™ Technology</h2>
            <p className={styles.gridText}>
              Every Sunbrella® fabric is made using Color to the Core™ technology. Unlike surface-dyed fabrics, Sunbrella fibers are fully infused with color before they are spun into yarn. These yarns are then woven into a durable, high-performance fabric.
            </p>
            <p className={styles.gridText}><strong>What does that mean for you?</strong></p>
            <ul className={styles.list}>
              <li><span>✔</span> Long-lasting color that won’t fade</li>
              <li><span>✔</span> Exceptional resistance to sun, rain, and daily use</li>
              <li><span>✔</span> Fabrics that maintain their performance even after repeated cleaning</li>
            </ul>
            <p className={styles.gridText} style={{ marginTop: '1rem' }}>
              This advanced process ensures Sunbrella® fabrics deliver unmatched durability, comfort, and color integrity—indoors or outdoors, season after season.
            </p>
          </div>
        </section>

        {/* Elegance Section */}
        <section className={styles.grid}>
          <div className={styles.gridContent}>
            <h2 className={styles.gridTitle}>Elegance, Durability, and Comfort for Every Space You Live In</h2>
            <p className={styles.gridText}>
              At Cushion Guru, we proudly craft custom cushions using Sunbrella® fabrics, known worldwide for their exceptional durability and long-lasting beauty. Made from high-performance solution-dyed acrylic fibers, Sunbrella® fabrics are designed to deliver comfort without compromising on strength.
            </p>
            <p className={styles.gridText}>
              Built to handle demanding environments, Sunbrella® fabrics resist fading from intense sunlight, stand up to moisture, and help prevent mold and mildew—making them ideal for both indoor and outdoor living.
            </p>
            <p className={styles.gridText}>
              Explore our full range of Sunbrella® fabric collections and customize cushions that perfectly match your space, style, and lifestyle.
            </p>
          </div>
          <div className={styles.gridImage}>
            <EditableMedia
              mediaKey="sunbrella-elegance"
              className={styles.heroImage}
              defaultComponent={
                <Image
                  src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/elegance.jpg"
                  alt="Elegance and Comfort"
                  fill
                  className={styles.heroImage}
                  unoptimized
                />
              }
            />
          </div>
        </section>

        <div className={styles.sectionTitle} style={{ marginTop: '4rem' }}>The Sunbrella Fabric Difference</div>
        <p className={styles.sectionText} style={{ marginBottom: '3rem' }}>
          Custom indoor cushions for bay window seating
        </p>

        {/* Comfort Section */}
        <section className={styles.grid}>
          <div className={styles.gridImage}>
            <EditableMedia
              mediaKey="sunbrella-comfort"
              className={styles.heroImage}
              defaultComponent={
                <Image
                  src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/comfort.jpg"
                  alt="Comfort and Softness"
                  fill
                  className={styles.heroImage}
                  unoptimized
                />
              }
            />
          </div>
          <div className={styles.gridContent}>
            <h2 className={styles.gridTitle}>Comfort & Softness</h2>
            <p className={styles.gridText}>
              With Sunbrella performance fabrics, exceptional comfort, and unmatched durability go hand in hand. Our complete performance makes Sunbrella fabrics tough enough for the outdoors, and soft and cozy for indoors. Sunbrella performance fabrics include many different weaves and surface textures, still meeting the overall intention: long-lasting softness and comfort. Our yarns have softness and durability woven into each fiber, which makes Sunbrella performance fabrics perfect for creating comfortable spaces.
            </p>
            <div className={styles.iconsGrid} style={{ marginTop: '2rem' }}>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Comfort" alt="Comfort" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Comfort</span>
              </div>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Soft+Touch" alt="Soft Touch" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Soft Touch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cleanability Section */}
        <section className={styles.grid}>
          <div className={styles.gridContent}>
            <h2 className={styles.gridTitle}>Cleanability</h2>
            <p className={styles.gridText}>
              Sunbrella performance fabrics are easy to clean while maintaining the strength and integrity of the fabric. We call it worry-free livability. Many performance fabrics are simply regular fabrics with a protective surface finish. Complete performance does not rely on a finish which can wear off. Sunbrella engineers performance into the core of each fiber, including stain-resistant technology. Visit our ‘How to Clean’ page to learn more.
            </p>
            <div className={styles.iconsGrid} style={{ marginTop: '2rem' }}>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Easy+Clean" alt="Easy to Clean" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Easy to Clean</span>
              </div>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Stain+Resist" alt="Stain & Water Resistant" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Stain & Water Resistant</span>
              </div>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Bleach" alt="Bleach Cleanable" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Bleach Cleanable</span>
              </div>
            </div>
          </div>
          <div className={styles.gridImage}>
            <EditableMedia
              mediaKey="sunbrella-cleanability"
              className={styles.heroImage}
              defaultComponent={
                <Image
                  src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/cleanability.jpg"
                  alt="Cleanability"
                  fill
                  className={styles.heroImage}
                  unoptimized
                />
              }
            />
          </div>
        </section>

        <p className={styles.sectionText} style={{ margin: '2rem auto' }}>
          Replacement outdoor cushions for a garden sectional sofa
        </p>

        {/* Color Stability Section */}
        <section className={styles.grid}>
          <div className={styles.gridImage}>
            <EditableMedia
              mediaKey="sunbrella-color-stability"
              className={styles.heroImage}
              defaultComponent={
                <Image
                  src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/color-stability.jpg"
                  alt="Color Stability"
                  fill
                  className={styles.heroImage}
                  unoptimized
                />
              }
            />
          </div>
          <div className={styles.gridContent}>
            <h2 className={styles.gridTitle}>Color Stability</h2>
            <p className={styles.gridText}>
              Sunbrella performance fabrics are made of 100% solution-dyed acrylic. Our fibers are saturated with color and UV-stabilized pigments before they’re spun into yarn–meaning the pigment goes all the way through the fibers and the color stays true over time. This unique process makes Sunbrella performance fabrics inherently fade resistant, UV protective and durable to the core; maintaining color and quality through cleaning, wear or exposure to outdoor elements.
            </p>
            <div className={styles.iconsGrid} style={{ marginTop: '2rem' }}>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Fade+Resist" alt="Fade Resistant" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Fade Resistant</span>
              </div>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=UV+Protect" alt="UV Protection" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>UV Protection</span>
              </div>
            </div>
          </div>
        </section>

        {/* Strength Section */}
        <section className={styles.grid}>
          <div className={styles.gridContent}>
            <h2 className={styles.gridTitle}>Strength That Lasts</h2>
            <p className={styles.gridText}>
              Sunbrella performance fabrics are engineered to last. Our fibers are mold and mildew resistant, stain and water resistant, and designed to stand all the tests of time. Regardless if you need fabric to stay strong in your living room, on your patio, or on your boat through the sun, rain, and storms, you can rest easy knowing Sunbrella fabrics have strength that lasts.
            </p>
            <div className={styles.iconsGrid} style={{ marginTop: '2rem' }}>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Abrasion" alt="Abrasion Resistant" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Abrasion Resistant</span>
              </div>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Mold+Resist" alt="Mold & Mildew Resistant" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Mold & Mildew Resistant</span>
              </div>
              <div className={styles.iconCard}>
                <div className={styles.iconImageWrapper}>
                  <Image src="https://via.placeholder.com/80?text=Weather" alt="Weather Resistant" fill className={styles.heroImage} unoptimized />
                </div>
                <span className={styles.iconText}>Weather Resistant</span>
              </div>
            </div>
          </div>
          <div className={styles.gridImage}>
            <EditableMedia
              mediaKey="sunbrella-strength"
              className={styles.heroImage}
              defaultComponent={
                <Image
                  src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/samples/strength.jpg"
                  alt="Strength That Lasts"
                  fill
                  className={styles.heroImage}
                  unoptimized
                />
              }
            />
          </div>
        </section>

        {/* Certified Fabrics */}
        <section className={styles.certifiedSection}>
          <h2 className={styles.sectionTitle}>Certified fabrics</h2>
          <p className={styles.sectionText}>
            Sunbrella fabrics offer the most comprehensive warranty on the market. They cover 5 to 10 years of use for total peace of mind. This guarantee is testament to the exceptional quality and durability of our textiles. In addition to their robustness, Sunbrella fabrics comply with rigorous standards. The upholstery fabrics are OEKO-TEX® STANDARD 100 certified, guaranteeing that they contain no harmful substances, and meet REACH criteria, ensuring their compliance with European regulations. What’s more, GreenGuard Gold certification for all Sunbrella fabrics ensures that they contribute to healthier indoor environments with low chemical emissions. With Sunbrella, you benefit from fabrics that not only perform well, but also respect your health and the environment.
          </p>
        </section>

        {/* Footer Icon Grid Sections */}
        <section className={styles.iconsSection}>
          <h3 className={styles.iconsTitle}>Features & Benefits</h3>
          <div className={styles.iconsGrid}>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper}>
                <Image src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/sunbrellapageicons/durable-100x100.webp" alt="Long Lasting" fill className={styles.heroImage} unoptimized />
              </div>
              <span className={styles.iconText}>Long Lasting</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper}>
                <Image src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/sunbrellapageicons/weather-resistant-100x100.webp" alt="Weather Resistant" fill className={styles.heroImage} unoptimized />
              </div>
              <span className={styles.iconText}>Weather Resistant</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper}>
                <Image src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/sunbrellapageicons/fade-proof_1_-100x100.webp" alt="Fade Resistant" fill className={styles.heroImage} unoptimized />
              </div>
              <span className={styles.iconText}>Fade Resistant</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper}>
                <Image src="https://customcushion-upload-bucket-123.s3.us-east-1.amazonaws.com/sunbrellapageicons/easy-clean-100x100.webp" alt="Easy to Clean & Stain Resistant" fill className={styles.heroImage} unoptimized />
              </div>
              <span className={styles.iconText}>Easy to Clean & Stain Resistant</span>
            </div>
          </div>
        </section>

        <section className={styles.iconsSection}>
          <h3 className={styles.iconsTitle}>Sustainability</h3>
          <div className={styles.iconsGrid} style={{ maxWidth: '1200px' }}>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Recycle" alt="Recycle My Sunbrella" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Recycle My Sunbrella</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Material" alt="Recycled Material Use" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Recycled Material Use</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Zero+Waste" alt="Zero Waste" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Maintaining Zero Waste to Landfill Best Practices</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Energy" alt="Renewable Energy" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Renewable Energy</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Carbon" alt="Carbon Footprint" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Carbon Footprint</span>
            </div>
          </div>
        </section>

        <section className={styles.iconsSection}>
          <h3 className={styles.iconsTitle}>Claims</h3>
          <div className={styles.iconsGrid} style={{ maxWidth: '1000px' }}>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Skin+Cancer" alt="Skin Cancer Foundation" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=%231+Trusted" alt="#1 Most Trusted" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Lead+Free" alt="Lead Free" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Non+PFAS" alt="Non PFAS" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.iconsSection}>
          <h3 className={styles.iconsTitle}>Certifications</h3>
          <div className={styles.iconsGrid} style={{ maxWidth: '1000px' }}>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Oeko-Tex" alt="Oeko-Tex" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=Greenguard" alt="Greenguard" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=ISO" alt="ISO" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=W.A.I.T" alt="W.A.I.T" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.iconsSection} style={{ paddingBottom: '4rem' }}>
          <h3 className={styles.iconsTitle}>Warranties</h3>
          <div className={styles.iconsGrid} style={{ maxWidth: '1000px' }}>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=5+Year" alt="5 Year" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=10+Year" alt="10 Year" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=5+Year+Acrylic" alt="5 Year Recycled Acrylic" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Recycled Acrylic</span>
            </div>
            <div className={styles.iconCard}>
              <div className={styles.iconImageWrapper} style={{ width: '120px', height: '120px' }}>
                <Image src="https://via.placeholder.com/120?text=3+Year+Poly" alt="3 Year Recycled Polyester" fill className={styles.heroImage} unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <span className={styles.iconText}>Recycled Polyester</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
