import type { Metadata } from 'next';
import ShopPage from '@/components/ShopPage/ShopPage';

export const metadata: Metadata = {
  title: 'Custom Indoor Cushions',
  description: 'Luxury custom indoor cushions made with Sunbrella® upholstery fabrics. Sofas, benches, window seats and more.',
};

export default function IndoorPage() {
  return (
    <ShopPage
      badge="Indoor Collection"
      heroTitle="Refined Comfort, Tailored for Indoor Living"
      heroSubtitle="Crafted by Cushion Guru using Sunbrella® performance upholstery fabrics"
      introText="Cushion Guru designs and crafts custom indoor cushions that elevate everyday living. From sofas, benches, and window seats to headboards and built-in seating, each cushion is precisely tailored to your space, comfort preference, and aesthetic."
      sections={[
        { title: 'Indoor Living, Crafted by Cushion Guru', text: 'At Cushion Guru, we create custom indoor cushions and upholstery designed for everyday living. Crafted with care and precision, our sofa replacement cushions are made to withstand years of gatherings, family meals, and meaningful moments at home.', img: 'Luxury custom indoor cushions for living room sofa' },
        { title: 'Worry-Free Performance, Powered by Sunbrella®', text: 'Cushion Guru uses Sunbrella® upholstery fabrics to deliver custom indoor cushions that provide comfort without compromise. These performance fabrics are soft, stylish, and highly durable—resisting stains, fading, and daily wear.', img: 'Sofa replacement cushions made with Sunbrella fabric', reverse: true },
        { title: 'Designed for Comfort, Built for Real Life', text: 'Indoor spaces should feel inviting and effortless. Our custom indoor cushions are designed to balance plush comfort with long-lasting performance, making them ideal for high-traffic areas and everyday use.', img: 'Custom indoor cushions for bay window seating' },
        { title: 'A Healthier Choice for Your Home', text: 'Sunbrella® upholstery fabrics are independently tested under STANDARD 100 by OEKO-TEX® and GREENGUARD® certified for low chemical emissions—helping support healthier indoor air quality for you and your family.', img: 'Custom indoor bench cushions for kitchen breakfast nook', reverse: true },
      ]}
      tagline="Custom-Tailored · Soft, Luxurious Comfort · Worry-Free Performance · Easy to Live With"
      customizeType="indoor"
    />
  );
}
