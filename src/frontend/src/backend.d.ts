import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export interface DigitalDownload {
    contentType: string;
    downloadFile: ExternalBlob;
    fileSizeBytes: bigint;
    downloadLimit?: bigint;
}
export interface Category {
    id: string;
    name: string;
    description: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface BrandStory {
    title: string;
    content: string;
    heroImage?: ExternalBlob;
}
export interface HomepageContent {
    brandStory: BrandStory;
    heroBanner: {
        title: string;
        backgroundImage?: ExternalBlob;
        subtitle: string;
    };
    featuredProducts: Array<Product>;
}
export interface DigitalPurchase {
    purchaseTimestamp: Time;
    user: Principal;
    productId: string;
    downloadCount: bigint;
    allowedDownloads: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Product {
    id: string;
    featured: boolean;
    name: string;
    createdAt: Time;
    description: string;
    category: string;
    digitalDownload?: DigitalDownload;
    priceCents: bigint;
    images: Array<ExternalBlob>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: Category): Promise<void>;
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    getBrandStory(): Promise<BrandStory | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getHeroBanner(): Promise<{
        title: string;
        backgroundImage?: ExternalBlob;
        subtitle: string;
    } | null>;
    getHomepageContent(): Promise<HomepageContent>;
    getProduct(productId: string): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getSiteBranding(): Promise<{
        theme: string;
        name: string;
    }>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserDigitalPurchases(): Promise<Array<DigitalPurchase>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordDigitalPurchase(productId: string, allowedDownloads: bigint): Promise<void>;
    removeDigitalDownload(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setBrandStory(story: BrandStory): Promise<void>;
    setDigitalDownload(productId: string, download: DigitalDownload): Promise<void>;
    setHeroBanner(banner: {
        title: string;
        backgroundImage?: ExternalBlob;
        subtitle: string;
    }): Promise<void>;
    setProductImages(productId: string, images: Array<ExternalBlob>): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCategory(category: Category): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
