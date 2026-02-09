import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Sparkles, ShoppingCart, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoppingItem } from '../backend';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: product, isLoading } = useGetProduct(productId);
  const createCheckoutSession = useCreateCheckoutSession();

  const handlePurchase = async () => {
    if (!identity) {
      toast.error('Please log in to purchase products');
      return;
    }

    if (!product) return;

    try {
      const shoppingItem: ShoppingItem = {
        productName: product.name,
        productDescription: product.description,
        priceInCents: product.priceCents,
        quantity: BigInt(1),
        currency: 'inr',
      };

      const session = await createCheckoutSession.mutateAsync({
        items: [shoppingItem],
        productIds: [product.id],
      });
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      
      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/shop' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/shop' })}
          className="mb-8 hover:text-vibrant-magenta"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-vibrant-magenta/20">
              <div className="aspect-square bg-vibrant-purple/5 relative">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].getDirectURL()}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vibrant-purple/20 to-vibrant-magenta/20">
                    <Sparkles className="h-24 w-24 text-vibrant-magenta/40" />
                  </div>
                )}
                {product.digitalDownload && (
                  <div className="absolute top-4 right-4 bg-vibrant-magenta text-white px-3 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg">
                    <Download className="h-4 w-4" />
                    Digital Product
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-vibrant-magenta via-vibrant-purple to-vibrant-blue bg-clip-text text-transparent">
                  {product.name}
                </h1>
                {product.featured && (
                  <Badge className="bg-vibrant-magenta text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-vibrant-magenta">
                  ₹{(Number(product.priceCents) / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">INR</span>
              </div>
            </div>

            <Card className="border-vibrant-magenta/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-vibrant-magenta/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category:</dt>
                    <dd className="font-medium capitalize">{product.category.replace('-', ' ')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type:</dt>
                    <dd className="font-medium">{product.digitalDownload ? 'Digital Download' : 'Physical Product'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Product ID:</dt>
                    <dd className="font-mono text-sm">{product.id}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {product.digitalDownload && (
              <Card className="border-vibrant-magenta/20 bg-vibrant-magenta/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-vibrant-magenta flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Instant Digital Download</h3>
                      <p className="text-sm text-muted-foreground">
                        After purchase, you'll get immediate access to download this digital product.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              size="lg"
              className="w-full vibrant-button text-lg"
              onClick={handlePurchase}
              disabled={createCheckoutSession.isPending}
            >
              {createCheckoutSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Now
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Secure payment powered by Stripe. All transactions are encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
