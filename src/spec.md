# Specification

## Summary
**Goal:** Create a writing portfolio website where visitors can browse and read categorized writings, while the owner (admin) can securely manage content via an authenticated dashboard.

**Planned changes:**
- Implement a single Motoko backend actor with stable data models and CRUD methods for categories and writing entries, including publish/unpublish behavior and public-only access to published content.
- Add Internet Identity admin authentication on the frontend and enforce admin-only access for all backend mutating methods.
- Build public pages: homepage with intro + category list, category listing pages showing published entries with previews, and writing detail pages with readable typography.
- Build an admin dashboard with guarded routes for managing categories and writings (create/edit/delete, assign category, publish/unpublish, preview).
- Add React Query-based data fetching/caching across public and admin views with loading/error states and mutation refresh behavior.
- Apply a consistent, typography-first literary theme (calm palette; not primarily blue/purple) across the site.
- Add basic SEO-friendly metadata (page titles) and semantic structure, with human-readable routing via slugs or clear ID-to-URL mapping.
- Generate and include simple branding images as static frontend assets and display them in the header/landing area.

**User-visible outcome:** Visitors can browse categories and read published works without signing in; the admin can sign in with Internet Identity to create, edit, organize, and publish/unpublish writings through a dashboard, with updates reflected across the site.
