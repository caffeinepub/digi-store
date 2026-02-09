# Specification

## Summary
**Goal:** Support digital products by attaching downloadable files to products, tracking post-purchase entitlements, and letting customers access their purchased downloads.

**Planned changes:**
- Extend the backend Product model with optional digital-product metadata and an optional downloadable file reference, without changing behavior for non-digital products.
- Add admin-only backend APIs to attach/update/remove a product’s digital download file using existing blob storage, separate from product images.
- Add backend entitlement tracking for digital products, including user-only APIs to confirm a successful purchase via Stripe sessionId and to list the caller’s entitled digital downloads.
- Update the Admin UI product form to mark products as digital, upload a digital download file separately from images, and display validation/errors in English.
- Update the customer flow to confirm entitlements on the Payment Success page (using checkout success URL context), display available downloads, and add a dedicated Downloads page reachable via the existing “View Downloads” button.

**User-visible outcome:** Admins can create/manage digital products with downloadable files, and customers who successfully complete checkout (and are logged in) can view and download their entitled digital purchases from the Payment Success and Downloads pages.
