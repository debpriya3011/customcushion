import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}) as any;
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@cushionguru.com';
  const adminPwd = process.env.ADMIN_PASSWORD ?? 'Admin@123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPwd, 12);
    await prisma.user.create({
      data: { name: 'CushionGuru Admin', email: adminEmail, password: hashed, role: 'ADMIN' },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Seed blog posts
  const blogs = [
    { slug: 'outdoor-cushion-care-tips', title: 'Top 10 Outdoor Cushion Care Tips for Longevity', excerpt: 'Learn how to extend the life of your outdoor cushion covers with these expert care tips.', content: 'Full article content here...', imageUrl: null },
    { slug: 'sunbrella-fabric-guide', title: 'The Complete Guide to Sunbrella® Fabrics', excerpt: 'Discover why Sunbrella® fabrics are the gold standard for performance textiles.', content: 'Full article content here...', imageUrl: null },
    { slug: 'custom-rv-cushions-guide', title: 'How to Choose Perfect RV Cushions for Your Adventure', excerpt: 'Your RV deserves cushions as adventurous as you are.', content: 'Full article content here...', imageUrl: null },
  ];

  for (const blog of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }
  console.log('✅ Blog posts seeded');

  console.log('🎉 Seeding complete!');
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
