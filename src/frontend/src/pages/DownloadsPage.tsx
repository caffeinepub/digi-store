import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserDigitalPurchases, useGetProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Lock, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '../backend';

export default function DownloadsPage() {
  const { identity } = useInternetIdentity();
  const { data: purchases = [], isLoading: purchasesLoading } = useGetUserDigitalPurchases();
  const { data: allProducts = [], isLoading: productsLoading } = useGetProducts();

  if (!identity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-vibrant-magenta/30">
            <CardContent className="p-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-vibrant-magenta/10 border-4 border-vibrant-magenta/20">
                <Lock className="h-12 w-12 text-vibrant-magenta" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-vibrant-magenta via-vibrant-purple to-vibrant-blue bg-clip-text text-transparent">
                  Login Required
                </h1>
                <p className="text-muted-foreground">
                  Please log in to view your digital downloads.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (purchasesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background">
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const purchasedProducts: Product[] = purchases
    .map(purchase => allProducts.find(p => p.id === purchase.productId))
    .filter((p): p is Product => p !== undefined && p.digitalDownload !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-vibrant-magenta via-vibrant-purple to-vibrant-blue bg-clip-text text-transparent mb-2">
              My Downloads
            </h1>
            <p className="text-muted-foreground">
              Access all your purchased digital products
            </p>
          </div>

          {purchasedProducts.length === 0 ? (
            <Card className="border-vibrant-magenta/30">
              <CardContent className="p-12 text-center space-y-4">
                <Download className="h-16 w-16 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">No Downloads Yet</h2>
                  <p className="text-muted-foreground">
                    You haven't purchased any digital products yet. Browse our shop to find amazing digital content!
                  </p>
                </div>
                <Button className="vibrant-button mt-4" onClick={() => window.location.href = '/shop'}>
                  Browse Shop
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchasedProducts.map((product) => {
                const purchase = purchases.find(p => p.productId === product.id);
                return (
                  <Card key={product.id} className="border-vibrant-magenta/20 hover:border-vibrant-magenta/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        {product.images.length > 0 && (
                          <img
                            src={product.images[0].getDirectURL()}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {product.digitalDownload && (
                            <>
                              <p>Size: {(Number(product.digitalDownload.fileSizeBytes) / 1024 / 1024).toFixed(2)} MB</p>
                              <p>Type: {product.digitalDownload.contentType}</p>
                              {purchase && (
                                <p>
                                  Downloads: {Number(purchase.downloadCount)} / {purchase.allowedDownloads ? Number(purchase.allowedDownloads) : '∞'}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        {product.digitalDownload && (
                          <Button
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
