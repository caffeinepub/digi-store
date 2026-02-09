import { useGetProducts, useGetCategories } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Package } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductImageUrl } from '../utils/productImage';

export default function ShopPage() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-accent/20 border-b border-border/60">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Shop Digital Products
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our curated collection of premium digital products
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border/60"
            />
          </div>

          {/* Category Filters */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                size="sm"
                className={selectedCategory === null ? 'premium-button' : ''}
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className={selectedCategory === category.id ? 'premium-button' : ''}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const imageUrl = getProductImageUrl(product.images);
                return (
                  <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
                    <Card className="group overflow-hidden premium-card h-full bg-card">
                      <div className="aspect-square overflow-hidden bg-muted/30 relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-accent/30">
                            <Package className="h-16 w-16 text-muted-foreground/40" />
                          </div>
                        )}
                        {product.digitalDownload && (
                          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                            Digital
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>
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
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Sparkles className="h-16 w-16 text-muted-foreground/40 mx-auto" />
              <h3 className="text-2xl font-semibold text-foreground">No products found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory
                  ? 'Try adjusting your search or filters'
                  : 'Products will appear here once added'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
