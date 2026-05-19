# AGENTS.md — HIMA Website

> Project-specific rules for AI agents working on this codebase.
> Read this **before** writing any code or making changes.

---

## 1. Project Overview

**HIMA** is a student organization (Himpunan Mahasiswa) website built on **Next.js 16 (App Router + Turbopack)**.

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 — App Router, Turbopack, Server Components |
| Language | TypeScript (strict) |
| Styling | Vanilla CSS — single `src/app/globals.css` (no Tailwind) |
| Database | Neon (PostgreSQL) via **Drizzle ORM** |
| Auth | Better Auth (session-based, email+password) |
| Storage | Vercel Blob (cover images) |
| Deployment | Vercel |

---

## 2. This is NOT the Next.js you know

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

**Critical Next.js 16 rules for this project:**

- **`"use client"` is the exception, not the rule.** Default to Server Components. Only add `"use client"` when you need event handlers, `useState`, `useEffect`, or browser APIs.
- **Event handlers (`onClick`, `onMouseEnter`, etc.) in Server Components will throw a runtime error.** Extract interactive parts into a separate `"use client"` component.
- **Server Actions** (`"use server"`) are in `src/actions/`. Never put mutation logic directly in page or component files.
- **`import Form from "next/form"`** for all GET-based search/filter forms (not standard HTML `<form>`).

---

## 3. Route Structure

```
src/app/
├── (public)/          ← Public-facing pages (no auth required)
│   ├── page.tsx       ← Homepage (hero, about, news grid, CTA)
│   ├── layout.tsx     ← Public layout with Navbar + Footer
│   └── news/
│       ├── page.tsx   ← News listing with pagination
│       └── [slug]/
│           └── page.tsx ← Article detail page
│
├── (admin)/           ← Protected admin area
│   └── admin/
│       ├── page.tsx           ← Admin dashboard
│       ├── articles/          ← Article CRUD
│       └── categories/        ← Category management
│
├── (auth)/            ← Login page only
│   └── login/
│
├── api/               ← API routes (Better Auth handler)
├── globals.css        ← THE single CSS file. All styles live here.
└── layout.tsx         ← Root layout (minimal, no providers)
```

**Admin access:** Navigate directly to `/admin` — there is NO link in the navbar by design (security through obscurity + proxy protection).

> ⚠️ **Next.js 16 convention:** Auth protection is in `src/proxy.ts` (NOT `middleware.ts`).
> The exported function is named `proxy`, not `middleware`. The `config.matcher` array is unchanged.

---

## 4. Database Schema

Managed by **Drizzle ORM** (`src/db/schema.ts`). Tables:

| Table | Purpose |
|---|---|
| `users` | Admin users (Better Auth) |
| `sessions` | Auth sessions |
| `accounts` | OAuth accounts (Better Auth) |
| `verifications` | Email verification tokens |
| `categories` | Article categories (name, slug) |
| `articles` | News articles (title, slug, excerpt, content, coverImage, published, views) |

**Key relations:**
- `articles` → `users` (author, cascade delete)
- `articles` → `categories` (nullable, set null on delete)

**Never** alter schema directly via SQL. Use Drizzle migrations or `db push`.

---

## 5. Server Actions (`src/actions/`)

| File | Exports | Notes |
|---|---|---|
| `articles.ts` | `getPublishedArticles`, `getArticleBySlug`, `createArticle`, `updateArticle`, `deleteArticle` | `getArticleBySlug` is wrapped in `cache()` to deduplicate DB calls |
| `categories.ts` | `getCategories`, `createCategory`, `updateCategory`, `deleteCategory` | Error types use `unknown` — no `any` |
| `upload.ts` | `uploadImage`, `deleteImage` | Both require auth via `requireAuth()` — never remove this guard |

**Rule:** All mutation actions must call `requireAuth()` at the top before any logic.

---

## 6. Authentication

- Auth is handled by **Better Auth** (`src/lib/auth.ts` or similar).
- Middleware (`src/middleware.ts`) protects all `/admin/*` routes. If a user hits `/admin` without a valid session they are redirected to `/login`.
- The login page is at `/login` (inside `(auth)` route group).
- **Never expose admin links in the public Navbar.**

---

## 7. Design System

Everything lives in `src/app/globals.css`. **There is no Tailwind.**

### Brand Palette — Arctic & Warm Sand
| Token | Value | Use |
|---|---|---|
| `--color-primary` | `oklch(0.62 0.12 220)` | Arctic Blue — CTAs, links, accents |
| `--color-accent` | `oklch(0.72 0.12 60)` | Warm Sand — secondary highlights |
| `--color-bg` | `#f4f6f8` | Page background |
| `--color-bg-warm` | `#faf8f5` | Warm section backgrounds |
| `--color-text` | `#0d1821` | Body text |

### Typography
- **Font:** Inter (Google Fonts) + JetBrains Mono (code)
- **Scale:** Perfect Fourth (1.333) — `--text-xs` → `--text-4xl`

### Spacing
- **8pt grid** — all spacing uses `--space-*` tokens (1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)

### Key CSS Classes
| Class | Purpose |
|---|---|
| `.hero-reveal`, `.hero-reveal-{1-4}` | Staggered page-load animations (hero section) |
| `.scroll-reveal`, `.scroll-reveal-{2-4}` | CSS Scroll-Driven Animation reveals (other sections) |
| `.news-editorial` | Homepage news layout grid (1.6fr / 1fr) |
| `.news-feature` | Large left feature card |
| `.news-sidebar`, `.news-sidebar-item` | Right compact sidebar entries |
| `.section`, `.container` | Standard layout wrappers |
| `.btn`, `.btn-primary`, `.btn-secondary` | CTA buttons |
| `.badge`, `.badge-primary` | Category / label chips |
| `.card`, `.card-image`, `.card-body` | Generic card (used on news listing page) |

### Purple Ban 🚫
**Never use purple, violet, or indigo** in any design decisions. This is a hard project rule.

---

## 8. Component Rules

### `HeroCanvas.tsx` — `"use client"`
- Interactive particle constellation canvas animation on the homepage hero.
- Renders `<canvas>` and manages `requestAnimationFrame`.
- **Do not add business logic here.** Keep it purely visual.

### `src/components/layout/`
- `Navbar.tsx` — public nav. No admin link. "About" link goes to `/#about` (anchor).
- Contains both Desktop and Mobile nav variants.

### `src/components/ui/`
- Shared UI primitives (buttons, badges, etc.)

---

## 9. Styling Rules (CRITICAL)

1. **All styles go in `globals.css`.** Do not use inline `style={{}}` for things that should be reusable — create a CSS class.
2. **Use CSS variables**, not hard-coded values. `var(--color-primary)` not `#5290d8`.
3. **`oklch()` color space** is used throughout for perceptual uniformity — maintain this.
4. **Hover/focus transitions** must animate only `transform` and `opacity` (or `box-shadow`) for GPU performance. Never animate `width`, `height`, or `background-color` on hot paths.
5. **`prefers-reduced-motion`** block at the bottom of globals.css disables all animations globally. Never override it.
6. **Scroll-Driven Animations** (`animation-timeline: view()`) are used for section reveals. There is a `@supports not` fallback for Safari < 17.4.

---

## 10. Common Pitfalls

| Mistake | Correct Approach |
|---|---|
| Adding `onClick` to a Server Component | Extract to a `"use client"` component |
| Importing `VisionMissionCards` (deleted) | That component was removed — About section is plain Server HTML |
| Calling `getArticleBySlug` more than once per request | It's wrapped in `cache()` — safe to call multiple times |
| Using `any` type in catch blocks | Use `unknown` and narrow with `instanceof Error` |
| Skipping `requireAuth()` in a mutation action | All mutations must check auth first |
| Adding Tailwind classes | Project uses vanilla CSS — add classes to `globals.css` |
| Hardcoding colors | Always use `--color-*` CSS custom properties |
| Putting interactive UI in `page.tsx` (Server Component) | Extract to a `"use client"` child component |

---

## 11. Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth signing secret |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `ADMIN_PASSWORD` | (Legacy) Initial admin seed password |

All variables must be set in `.env.local` for local dev and in Vercel dashboard for production.

---

## 12. Development Commands

```powershell
npm run dev        # Start dev server (Turbopack) at localhost:3000
npm run build      # Production build
npx tsc --noEmit  # Type-check without building
```

Admin panel: `http://localhost:3000/admin` (direct URL — not linked in navbar)
