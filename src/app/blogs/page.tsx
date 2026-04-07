import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './blogs.module.css';

export const metadata: Metadata = {
  title: 'Blog | CushionGuru',
  description: 'Read the latest articles from CushionGuru on custom cushions, Sunbrella fabrics, home décor, and care tips.',
};

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const blogs = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <>
      <section className={styles.hero}>
        <div className="container text-center">
          <span className="badge">Knowledge Hub</span>
          <h1>CushionGuru Blog</h1>
          <p>Expert tips, design inspiration, and care guides for your custom cushions</p>
        </div>
      </section>

      <section className={`section-padding ${styles.section}`}>
        <div className="container">
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No blog posts published yet. Check back soon!</div>
          ) : (
            <div className={styles.grid}>
              {blogs.map((post: any, i: number) => (
                <article key={post.slug} className={`${styles.card} ${i === 0 ? styles.featured : ''}`}>
                  <div className={`img-placeholder ${styles.cardImg}`} style={post.imageUrl ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 } : {}}>
                    {!post.imageUrl && <span className={styles.cardImgLabel}>📷 No Image</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.category}>Blog Post</span>
                      <span className={styles.date}>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className={styles.cardTitle}><Link href={`/blogs/${post.slug}`}>{post.title}</Link></h2>
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                    <Link href={`/blogs/${post.slug}`} className={styles.readMore}>
                      Read More
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

