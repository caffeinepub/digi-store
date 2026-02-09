import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Download, Loader2 } from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useRecordDigitalPurchase, useGetUserDigitalPurchases, useGetProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Product } from '../backend';

export default function PaymentSuccessPage() {
  const search = useSearch({ from: '/payment-success' });
  const { identity } = useInternetIdentity();
  const [isProcessing, setIsProcessing] = useState(true);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  
  const recordPurchase = useRecordDigitalPurchase();
  const { data: userPurchases, refetch: refetchPurchases } = useGetUserDigitalPurchases();
  const { data: allProducts = [] } = useGetProducts();

  useEffect(() => {
    const processPurchase = async () => {
      if (!identity) {
        setIsProcessing(false);
        return;
      }

      const sessionId = (search as any)?.session_id;
      const productsParam = (search as any)?.products;

      if (!sessionId || !productsParam) {
        setIsProcessing(false);
        return;
      }

      try {
        const productIds = productsParam.split(',');
        
        // Record purchases for digital products
        for (const productId of productIds) {
          const product = allProducts.find(p => p.id === productId);
          if (product?.digitalDownload) {
            await recordPurchase.mutateAsync({
              productId,
              allowedDownloads: BigInt(10), // Default 10 downloads
            });
          }
        }

        // Refetch purchases and get product details
        await refetchPurchases();
        const purchased = allProducts.filter(p => productIds.includes(p.id) && p.digitalDownload);
        setPurchasedProducts(purchased);
        
        if (purchased.length > 0) {
          toast.success('Your digital products are ready for download!');
        }
      } catch (error) {
        console.error('Error processing purchase:', error);
        toast.error('There was an issue processing your purchase. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [identity, search, allProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border bg-accent/20">
          <CardContent className="p-12 text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Payment Successful!
              </h1>
              <p className="text-xl text-muted-foreground">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            {isProcessing ? (
              <div className="bg-background/50 rounded-lg p-6 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Processing your purchase...</p>
              </div>
            ) : purchasedProducts.length > 0 ? (
              <div className="bg-background/50 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Your Digital Downloads
                </h2>
                <div className="space-y-3">
                  {purchasedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="text-left">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.digitalDownload && (
                            <>Size: {(Number(product.digitalDownload.fileSizeBytes) / 1024 / 1024).toFixed(2)} MB</>
                          )}
                        </p>
                      </div>
                      {product.digitalDownload && (
                        <Button
                          size="sm"
                          className="vibrant-button"
                          onClick={() => {
                            const url = product.digitalDownload!.downloadFile.getDirectURL();
                            window.open(url, '_blank');
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-background/50 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">What's Next?</h2>
                <p className="text-muted-foreground">
                  You'll receive a confirmation email shortly with your order details.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/downloads">
                <Button size="lg" className="vibrant-button">
                  <Download className="mr-2 h-5 w-5" />
                  View All Downloads
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
