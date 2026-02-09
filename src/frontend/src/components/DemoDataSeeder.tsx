import { useEffect, useState } from 'react';
import { useAddProduct, useAddCategory, useGetProducts, useGetCategories, useSetHeroBanner, useSetBrandStory } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function DemoDataSeeder() {
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: products = [] } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const addProduct = useAddProduct();
  const addCategory = useAddCategory();
  const setHeroBanner = useSetHeroBanner();
  const setBrandStory = useSetBrandStory();

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);

  const hasData = products.length > 0 || categories.length > 0;

  useEffect(() => {
    if (products.length >= 7 && categories.length >= 4) {
      setSeedingComplete(true);
    }
  }, [products.length, categories.length]);

  const seedDemoData = async () => {
    if (!isAdmin) return;

    setIsSeeding(true);
    try {
      // Add categories first
      const categoriesToAdd = [
        { id: 'digital-art', name: 'Digital Art', description: 'Stunning digital artwork and illustrations' },
        { id: 'e-books', name: 'E-books', description: 'Educational and inspiring digital books' },
        { id: 'templates', name: 'Templates', description: 'Professional templates for various needs' },
        { id: 'kids-worksheets', name: 'Kids Worksheets', description: 'Educational worksheets for children' },
      ];

      for (const category of categoriesToAdd) {
        if (!categories.find(c => c.id === category.id)) {
          await addCategory.mutateAsync(category);
        }
      }

      // Add demo products with INR pricing (80000-800000 paise = ₹800-₹8000)
      const demoProducts = [
        {
          id: 'product-digital-art-abstract',
          name: 'Abstract Digital Art Collection',
          description: 'A stunning collection of abstract digital artworks featuring vibrant colors and modern designs. Perfect for digital displays and creative projects.',
          priceCents: BigInt(399900), // ₹3999
          category: 'digital-art',
          featured: true,
          images: [ExternalBlob.fromURL('/assets/generated/digital-art-abstract.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
        {
          id: 'product-digital-art-landscape',
          name: 'Digital Landscape Masterpiece',
          description: 'Breathtaking digital landscape art that brings nature to your screen. High-resolution artwork suitable for prints and digital use.',
          priceCents: BigInt(479900), // ₹4799
          category: 'digital-art',
          featured: false,
          images: [ExternalBlob.fromURL('/assets/generated/digital-art-landscape.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
        {
          id: 'product-ebook-business-guide',
          name: 'Complete Business Growth Guide',
          description: 'Comprehensive e-book covering essential strategies for scaling your business in India. Includes case studies, actionable tips, and expert insights.',
          priceCents: BigInt(239900), // ₹2399
          category: 'e-books',
          featured: true,
          images: [ExternalBlob.fromURL('/assets/generated/ebook-business-guide.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
        {
          id: 'product-ebook-creative-design',
          name: 'Creative Design Principles',
          description: 'Master the fundamentals of creative design with this in-depth e-book. Learn color theory, composition, and modern design trends.',
          priceCents: BigInt(279900), // ₹2799
          category: 'e-books',
          featured: false,
          images: [ExternalBlob.fromURL('/assets/generated/ebook-creative-design.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
        {
          id: 'product-template-website-modern',
          name: 'Modern Website Template Pack',
          description: 'Professional website templates with clean, modern designs. Fully responsive and easy to customize for any business or portfolio.',
          priceCents: BigInt(639900), // ₹6399
          category: 'templates',
          featured: true,
          images: [ExternalBlob.fromURL('/assets/generated/template-website-modern.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
        {
          id: 'product-template-social-media',
          name: 'Social Media Template Bundle',
          description: 'Complete social media template bundle with designs for Instagram, Facebook, Twitter, and LinkedIn. Save time and maintain brand consistency.',
          priceCents: BigInt(319900), // ₹3199
          category: 'templates',
          featured: false,
          images: [ExternalBlob.fromURL('/assets/generated/template-social-media.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
        {
          id: 'product-kids-worksheets-bundle',
          name: '11000+ Kids Worksheets Bundle',
          description: 'Comprehensive collection of over 11,000 educational worksheets for children covering math, science, language arts, and more. Perfect for parents, teachers, and homeschoolers. Includes printable PDFs organized by grade level and subject.',
          priceCents: BigInt(499900), // ₹4999
          category: 'kids-worksheets',
          featured: true,
          images: [ExternalBlob.fromURL('/assets/generated/ebook-creative-design.dim_400x400.png')],
          createdAt: BigInt(Date.now() * 1000000),
        },
      ];

      for (const product of demoProducts) {
        if (!products.find(p => p.id === product.id)) {
          await addProduct.mutateAsync(product);
        }
      }

      // Set hero banner
      await setHeroBanner.mutateAsync({
        title: 'Welcome to Digi Store',
        subtitle: 'Discover Premium Digital Products for Indian Creators and Entrepreneurs',
        backgroundImage: ExternalBlob.fromURL('/assets/generated/hero-banner-vibrant.dim_1200x600.jpg'),
      });

      // Set brand story
      await setBrandStory.mutateAsync({
        title: 'Our Story',
        content: 'At Digi Store, we believe in empowering Indian creators and entrepreneurs with high-quality digital products. Our curated collection features stunning digital art, insightful e-books, and professional templates designed to elevate your projects.\n\nAs part of the Digital India initiative, we\'re committed to supporting the growth of India\'s digital ecosystem. Every product in our store is carefully selected to ensure it meets our standards of excellence.\n\nWhether you\'re looking to enhance your creative work, learn new skills, or streamline your business processes, we have something special for you. Join thousands of satisfied customers across India who have transformed their digital presence with our premium products.',
        heroImage: ExternalBlob.fromURL('/assets/generated/brand-story-vibrant.dim_800x600.jpg'),
      });

      toast.success('Demo data seeded successfully!');
      setSeedingComplete(true);
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error('Failed to seed demo data. Please try again.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isAdmin) return null;
  if (seedingComplete) return null;

  return (
    <Card className="border-vibrant-magenta/30 bg-gradient-to-br from-vibrant-purple/5 to-vibrant-magenta/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-vibrant-magenta" />
          <CardTitle>Demo Data Setup</CardTitle>
        </div>
        <CardDescription>
          {hasData 
            ? 'Add more demo products and content to showcase the store features'
            : 'Get started quickly by adding demo products, categories, and homepage content'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p className="font-medium">This will add:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>4 product categories (Digital Art, E-books, Templates, Kids Worksheets)</li>
            <li>7 demo products with images and INR pricing (₹2399-₹6399)</li>
            <li>4 featured products for the homepage</li>
            <li>Hero banner and brand story content with Digital India branding</li>
          </ul>
        </div>
        <Button 
          onClick={seedDemoData} 
          disabled={isSeeding}
          className="w-full vibrant-button"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Demo Data...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Seed Demo Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
