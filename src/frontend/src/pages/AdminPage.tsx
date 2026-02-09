import { useIsCallerAdmin, useSetHeroBanner, useSetBrandStory, useAddProduct, useGetProducts, useGetCategories, useAddCategory } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Sparkles, Image as ImageIcon, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';
import DemoDataSeeder from '../components/DemoDataSeeder';
import ProductDigitalDownloadDialog from '../components/admin/ProductDigitalDownloadDialog';
import type { Product } from '../backend';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products = [] } = useGetProducts();
  const { data: categories = [] } = useGetCategories();

  const setHeroBanner = useSetHeroBanner();
  const setBrandStory = useSetBrandStory();
  const addProduct = useAddProduct();
  const addCategory = useAddCategory();

  // Hero Banner State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  // Brand Story State
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyImageFile, setStoryImageFile] = useState<File | null>(null);

  // Product State
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productFeatured, setProductFeatured] = useState(false);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  // Category State
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Digital Download Dialog State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [digitalDownloadDialogOpen, setDigitalDownloadDialogOpen] = useState(false);

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-muted-foreground">Please log in to access the admin panel.</p>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  const handleFileToBlob = async (file: File): Promise<ExternalBlob> => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return ExternalBlob.fromBytes(uint8Array);
  };

  const handleSaveHeroBanner = async () => {
    if (!heroTitle || !heroSubtitle) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let backgroundImage: ExternalBlob | undefined;
      if (heroImageFile) {
        backgroundImage = await handleFileToBlob(heroImageFile);
      }

      await setHeroBanner.mutateAsync({
        title: heroTitle,
        subtitle: heroSubtitle,
        backgroundImage,
      });

      toast.success('Hero banner saved successfully!');
      setHeroTitle('');
      setHeroSubtitle('');
      setHeroImageFile(null);
    } catch (error) {
      toast.error('Failed to save hero banner');
      console.error(error);
    }
  };

  const handleSaveBrandStory = async () => {
    if (!storyTitle || !storyContent) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let heroImage: ExternalBlob | undefined;
      if (storyImageFile) {
        heroImage = await handleFileToBlob(storyImageFile);
      }

      await setBrandStory.mutateAsync({
        title: storyTitle,
        content: storyContent,
        heroImage,
      });

      toast.success('Brand story saved successfully!');
      setStoryTitle('');
      setStoryContent('');
      setStoryImageFile(null);
    } catch (error) {
      toast.error('Failed to save brand story');
      console.error(error);
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !productDescription || !productPrice || !productCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const images: ExternalBlob[] = [];
      if (productImageFile) {
        images.push(await handleFileToBlob(productImageFile));
      }

      await addProduct.mutateAsync({
        id: `product-${Date.now()}`,
        name: productName,
        description: productDescription,
        priceCents: BigInt(Math.round(parseFloat(productPrice) * 100)),
        category: productCategory,
        featured: productFeatured,
        images,
        createdAt: BigInt(Date.now() * 1000000),
      });

      toast.success('Product added successfully!');
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductCategory('');
      setProductFeatured(false);
      setProductImageFile(null);
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await addCategory.mutateAsync({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        description: categoryDescription,
      });

      toast.success('Category added successfully!');
      setCategoryName('');
      setCategoryDescription('');
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  const handleManageDigitalDownload = (product: Product) => {
    setSelectedProduct(product);
    setDigitalDownloadDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-luxury-purple/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-luxury-gold" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-gold via-luxury-purple to-luxury-gold bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        {/* Demo Data Seeder */}
        <div className="mb-8">
          <DemoDataSeeder />
        </div>

        <Tabs defaultValue="homepage" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Homepage Content */}
          <TabsContent value="homepage" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Hero Banner</CardTitle>
                <CardDescription>Set the main hero banner for the homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Enter hero title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Enter hero subtitle"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-image">Background Image (Optional)</Label>
                  <Input
                    id="hero-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={handleSaveHeroBanner} disabled={setHeroBanner.isPending} className="luxury-button">
                  {setHeroBanner.isPending ? 'Saving...' : 'Save Hero Banner'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Story</CardTitle>
                <CardDescription>Tell your brand's story</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story-title">Title</Label>
                  <Input
                    id="story-title"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Enter story title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story-content">Content</Label>
                  <Textarea
                    id="story-content"
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    placeholder="Enter your brand story"
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story-image">Image (Optional)</Label>
                  <Input
                    id="story-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStoryImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={handleSaveBrandStory} disabled={setBrandStory.isPending} className="luxury-button">
                  {setBrandStory.isPending ? 'Saving...' : 'Save Brand Story'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product for your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price (INR)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select value={productCategory} onValueChange={setProductCategory}>
                      <SelectTrigger id="product-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-featured"
                    checked={productFeatured}
                    onCheckedChange={setProductFeatured}
                  />
                  <Label htmlFor="product-featured">Featured Product</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-image">Product Image</Label>
                  <Input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={handleAddProduct} disabled={addProduct.isPending} className="luxury-button">
                  {addProduct.isPending ? 'Adding...' : 'Add Product'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Products</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-muted relative">
                        {product.images.length > 0 ? (
                          <img
                            src={product.images[0].getDirectURL()}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        {product.digitalDownload && (
                          <div className="absolute top-2 right-2 bg-vibrant-magenta text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            Digital
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₹{(Number(product.priceCents) / 100).toFixed(2)}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleManageDigitalDownload(product)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {product.digitalDownload ? 'Edit' : 'Add'} Digital Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {products.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No products yet. Add your first product above!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create a new product category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Textarea
                    id="category-description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddCategory} disabled={addCategory.isPending} className="luxury-button">
                  {addCategory.isPending ? 'Adding...' : 'Add Category'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
                <CardDescription>Manage your product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {categories.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No categories yet. Add your first category above!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Digital Download Dialog */}
      {selectedProduct && (
        <ProductDigitalDownloadDialog
          product={selectedProduct}
          open={digitalDownloadDialogOpen}
          onOpenChange={setDigitalDownloadDialogOpen}
        />
      )}
    </div>
  );
}
