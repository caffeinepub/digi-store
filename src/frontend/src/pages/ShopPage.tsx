import { useGetProducts, useGetCategories } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';

export default function ShopPage() {
  const { data: products = [], isLoading: productsLoading } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-vibrant-magenta via-vibrant-purple to-vibrant-blue bg-clip-text text-transparent">
            Digital Products
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium digital products for Indian creators
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-vibrant-purple/10 border border-vibrant-magenta/20">
              <Sparkles className="h-12 w-12 text-vibrant-magenta/40" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">No Products Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No products match your search criteria. Try adjusting your filters.'
                  : 'Our collection is being curated. Check back soon for amazing digital products!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} to="/product/$productId" params={{ productId: product.id }}>
                <Card className="group overflow-hidden border-vibrant-magenta/20 hover:border-vibrant-magenta/40 transition-all duration-300 hover:shadow-vibrant h-full">
                  <div className="aspect-square overflow-hidden bg-vibrant-purple/5">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].getDirectURL()}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vibrant-purple/20 to-vibrant-magenta/20">
                        <Sparkles className="h-16 w-16 text-vibrant-magenta/40" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold group-hover:text-vibrant-magenta transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.featured && (
                        <Sparkles className="h-4 w-4 text-vibrant-magenta flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-vibrant-magenta">
                        ₹{(Number(product.priceCents) / 100).toFixed(2)}
                      </span>
                      <Button variant="outline" size="sm" className="group-hover:bg-vibrant-magenta group-hover:text-white group-hover:border-vibrant-magenta transition-colors">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
