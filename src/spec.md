# Specification

## Summary
**Goal:** Add a custom storefront thumbnail image for the seeded/demo INR ₹199.00 product and ensure it displays across Shop and Product Detail pages.

**Planned changes:**
- Add a new 400x400 square product thumbnail image at `frontend/public/assets/generated/kids-worksheets-199.dim_400x400.png`.
- Update the Demo Data Seeder so the ₹199.00 product references the new image using `ExternalBlob.fromURL('/assets/generated/kids-worksheets-199.dim_400x400.png')` in its `images` array.

**User-visible outcome:** After seeding demo data, the ₹199.00 product shows the new kid-friendly worksheets thumbnail as its primary image in the Shop and Product Detail pages (no placeholder image).
