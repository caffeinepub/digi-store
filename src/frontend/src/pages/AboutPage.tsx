import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-vibrant-magenta via-vibrant-purple to-vibrant-blue bg-clip-text text-transparent">
            About Digi Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering Indian creators and entrepreneurs with premium digital products
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-vibrant-magenta to-vibrant-purple bg-clip-text text-transparent">
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
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-vibrant border border-vibrant-magenta/20">
              <img
                src="/assets/generated/brand-story-vibrant.dim_800x600.jpg"
                alt="About Digi Store"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-vibrant-magenta to-vibrant-blue rounded-full blur-3xl opacity-30" />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-vibrant-magenta via-vibrant-purple to-vibrant-blue bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-vibrant-magenta/20 hover:border-vibrant-magenta/40 transition-all duration-300 hover:shadow-vibrant">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vibrant-magenta/10 border border-vibrant-magenta/20">
                  <Target className="h-8 w-8 text-vibrant-magenta" />
                </div>
                <h3 className="text-xl font-semibold">Quality First</h3>
                <p className="text-muted-foreground">
                  Every product in our store is carefully curated to ensure it meets our high standards of excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-vibrant-purple/20 hover:border-vibrant-purple/40 transition-all duration-300 hover:shadow-vibrant">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vibrant-purple/10 border border-vibrant-purple/20">
                  <Heart className="h-8 w-8 text-vibrant-purple" />
                </div>
                <h3 className="text-xl font-semibold">Customer Focused</h3>
                <p className="text-muted-foreground">
                  Your success is our success. We're dedicated to providing products that truly make a difference.
                </p>
              </CardContent>
            </Card>

            <Card className="border-vibrant-blue/20 hover:border-vibrant-blue/40 transition-all duration-300 hover:shadow-vibrant">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vibrant-blue/10 border border-vibrant-blue/20">
                  <Users className="h-8 w-8 text-vibrant-blue" />
                </div>
                <h3 className="text-xl font-semibold">Community Driven</h3>
                <p className="text-muted-foreground">
                  We're building a community of creators and entrepreneurs who support and inspire each other.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Digital India Section */}
        <Card className="border-vibrant-magenta/30 bg-gradient-to-br from-vibrant-purple/5 to-vibrant-magenta/5">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vibrant-magenta/10 border border-vibrant-magenta/20">
              <Sparkles className="h-10 w-10 text-vibrant-magenta" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-vibrant-magenta to-vibrant-purple bg-clip-text text-transparent">
              Supporting Digital India
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              As proud supporters of the Digital India initiative, we're committed to empowering Indian creators and entrepreneurs with the tools they need to succeed in the digital economy. Together, we're building a more connected, innovative, and prosperous India.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
