import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Premium Horse Saddles`,
  description: SITE_CONFIG.seo.description,
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    url: SITE_CONFIG.url,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <BlogPreviewSection />
    </>
  );
}
