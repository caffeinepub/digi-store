import { useGetHomepageContent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: content, isLoading } = useGetHomepageContent();

  if (isLoading) {
    return (
      <div className="space-y-16">
        <Skeleton className="h-[600px] w-full" />
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Digi Store</h1>
          <p className="text-muted-foreground">Content is being set up. Please check back soon.</p>
        </div>
      </div>
    );
  }

  const heroBgUrl = content.heroBanner.backgroundImage?.getDirectURL() || '/assets/generated/hero-banner.dim_1200x600.jpg';
  const brandStoryImageUrl = content.brandStory.heroImage?.getDirectURL() || '/assets/generated/brand-story.dim_800x600.jpg';

  return (
    <div className="relative space-y-0">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBgUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Digital Products</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            {content.heroBanner.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {content.heroBanner.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/shop">
              <Button size="lg" className="premium-button text-lg px-8">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {content.featuredProducts.length > 0 && (
        <section className="py-24 bg-accent/20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Featured Products
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover our handpicked selection of premium digital products
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.featuredProducts.map((product) => (
                <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
                  <Card className="group overflow-hidden premium-card h-full bg-card">
                    <div className="aspect-square overflow-hidden bg-muted/30">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].getDirectURL()}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-accent/30">
                          <Sparkles className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{(Number(product.priceCents) / 100).toFixed(2)}
                        </span>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {content.brandStory.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {content.brandStory.content}
              </p>
              <Link to="/about">
                <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-premium border border-border/60">
                <img
                  src={brandStoryImageUrl}
                  alt={content.brandStory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
