# Specification

## Summary
**Goal:** Make the Admin “Add New Product” flow work end-to-end so newly created products reliably appear across Admin, Shop, and Product Detail pages without manual refresh or reseeding.

**Planned changes:**
- Fix the Admin → Products → Add New Product submission flow so product creation succeeds reliably and shows an English success toast.
- Ensure the Admin “Existing Products” list updates automatically after creation (React Query invalidation/refetch) without a full page reload.
- Ensure the Shop product grid updates to include newly created products and they behave like existing products for search/filter.
- Ensure Product Detail can load a newly created product (no erroneous “Product not found” fallback).
- Ensure uploaded product images render correctly on Admin cards, Shop cards, and Product Detail; keep placeholder behavior stable when no image is uploaded.

**User-visible outcome:** An admin can add a new product and see it appear shortly in the Admin list, in the Shop grid, and on its Product Detail page (with correct image/placeholder behavior), without refreshing the app.
