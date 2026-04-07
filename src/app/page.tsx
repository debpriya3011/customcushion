import type { Metadata } from 'next';
import HeroSlider from '@/components/HeroSlider/HeroSlider';
import FeatureBanner from '@/components/home/FeatureBanner';
import DesignPerformance from '@/components/home/DesignPerformance';
import WhyUpgrade from '@/components/home/WhyUpgrade';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import DiscoverBanner from '@/components/home/DiscoverBanner';
import CustomizeSection from '@/components/home/CustomizeSection';
import ShopByCategory from '@/components/home/ShopByCategory';
import Testimonials from '@/components/home/Testimonials';
import VideoGallery from '@/components/home/VideoGallery';
import InspireBanner from '@/components/home/InspireBanner';
import PremiumSection from '@/components/home/PremiumSection';
import ReadyBanner from '@/components/home/ReadyBanner';
import Newsletter from '@/components/home/Newsletter';

export const metadata: Metadata = {
  title: 'CushionGuru – Custom Cushions, Factory Direct',
  description: 'Premium custom cushions crafted for indoor, outdoor, RV, boat, and pet use. Factory-direct with Sunbrella® fabrics. Free worldwide shipping.',
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeatureBanner />
      <DesignPerformance />
      <WhyUpgrade />
      <MarqueeStrip />
      <DiscoverBanner />
      <CustomizeSection />
      <ShopByCategory />
      <Testimonials />
      <VideoGallery />
      <InspireBanner />
      <PremiumSection />
      <ReadyBanner />
      <Newsletter />
    </>
  );
}
