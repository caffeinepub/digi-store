import { useParams, Link } from '@tanstack/react-router';
import { useGetProduct, useCreateCheckoutSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Download, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getProductImageUrl } from '../utils/productImage';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const { data: product, isLoading } = useGetProduct(productId);
  const createCheckoutSession = useCreateCheckoutSession();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { identity, login } = useInternetIdentity();

  const handlePurchase = async () => {
    if (!identity) {
      await login();
      return;
    }

    if (!product) return;

    setIsPurchasing(true);
    try {
      const shoppingItems = [
        {
          productName: product.name,
          productDescription: product.description,
          priceInCents: product.priceCents,
          quantity: BigInt(1),
          currency: 'INR',
        },
      ];

      const session = await createCheckoutSession.mutateAsync({
        items: shoppingItems,
        productIds: [product.id],
      });
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error) {
      console.error('Purchase error:', error);
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="h-16 w-16 text-muted-foreground/40 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
          <Link to="/shop">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getProductImageUrl(product.images);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link to="/shop">
          <Button variant="ghost" className="mb-8 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-border/60">
              <div className="aspect-square bg-muted/30">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-accent/30">
                    <Package className="h-24 w-24 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
                {product.digitalDownload && (
                  <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Digital
                  </Badge>
                )}
              </div>
              <p className="text-xl text-muted-foreground">{product.description}</p>
            </div>

            {/* Price & Purchase */}
            <Card className="border-border/60 bg-accent/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    ₹{(Number(product.priceCents) / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">INR</span>
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={isPurchasing || createCheckoutSession.isPending}
                  size="lg"
                  className="w-full premium-button text-lg"
                >
                  {isPurchasing || createCheckoutSession.isPending ? (
                    'Processing...'
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {identity ? 'Purchase Now' : 'Login to Purchase'}
                    </>
                  )}
                </Button>
                {product.digitalDownload && (
                  <p className="text-sm text-muted-foreground text-center">
                    Instant download after purchase
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="border-border/60">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium text-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-foreground">
                      {product.digitalDownload ? 'Digital Download' : 'Digital Product'}
                    </span>
                  </div>
                  {product.digitalDownload && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-medium text-foreground">
                          {(Number(product.digitalDownload.fileSizeBytes) / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium text-foreground">
                          {product.digitalDownload.contentType}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
