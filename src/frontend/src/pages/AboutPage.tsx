import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            About Digi Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering Indian creators and entrepreneurs with premium digital products
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Digi Store was founded with a vision to democratize access to high-quality digital products for creators and entrepreneurs across India. We believe that everyone deserves access to premium tools and resources that can help them succeed in the digital economy.
              </p>
              <p>
                As part of the Digital India initiative, we're committed to supporting the growth of India's digital ecosystem by providing affordable, world-class digital products that empower individuals and businesses to thrive online.
              </p>
              <p>
                Our curated collection includes stunning digital art, insightful e-books, and professional templates - all carefully selected to meet the highest standards of quality and value.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border">
              <img
                src="/assets/generated/brand-story.dim_800x600.jpg"
                alt="About Digi Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border hover:border-primary/40 transition-all duration-300 hover:shadow-vibrant">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Quality First</h3>
                <p className="text-muted-foreground">
                  We curate only the finest digital products that meet our rigorous quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary/40 transition-all duration-300 hover:shadow-vibrant">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Your success is our success. We're dedicated to providing exceptional service and support.
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:border-primary/40 transition-all duration-300 hover:shadow-vibrant">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community</h3>
                <p className="text-muted-foreground">
                  Building a thriving community of creators and entrepreneurs across India.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Digital India Section */}
        <Card className="border bg-accent/30">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground">Supporting Digital India</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                As proud supporters of the Digital India initiative, we're committed to empowering Indian creators and entrepreneurs with the digital tools they need to succeed. Together, we're building a more connected, innovative, and prosperous digital future for India.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
