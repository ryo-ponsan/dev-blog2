# CLAUDE.md - AI Assistant Guide for dev-blog2

## Project Overview

This is a personal blog built with **Next.js 13 (Pages Router)**, **Tailwind CSS**, and **Contentlayer**. The theme is based on Tailwind Nextjs Starter Blog (Pliny) with custom modifications.

- **Live Site**: https://dev-blog-gypsyr.vercel.app/
- **Language**: Japanese (primary), with Japanese locale settings
- **Node Version**: 22.x (see `.nvmrc`)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 13.1.6 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.x |
| Content | Contentlayer (MDX) |
| UI Library | Pliny 0.0.10 |
| Comments | Giscus (GitHub Discussions) |
| Newsletter | Buttondown |
| Deployment | Vercel |

## Directory Structure

```
/
├── pages/              # Next.js pages (routing)
│   ├── index.tsx       # Home page (latest posts)
│   ├── blog/           # Blog routes
│   │   ├── index.tsx   # Blog listing
│   │   ├── [..slug].tsx # Individual post pages
│   │   └── page/[page].tsx # Paginated blog
│   ├── tags.tsx        # Tag listing
│   ├── tags/[tag].tsx  # Posts by tag
│   ├── about.tsx       # About page
│   ├── projects.tsx    # Projects page
│   └── api/            # API routes
├── components/         # React components
│   ├── MDXComponents.tsx # MDX component mappings
│   ├── SEO.tsx         # SEO meta components
│   ├── social-icons/   # SVG social icons
│   └── ...             # UI components (Header, Footer, Tag, etc.)
├── layouts/            # Post/page layouts
│   ├── PostLayout.tsx  # Default blog post layout
│   ├── PostSimple.tsx  # Simple post layout
│   ├── ListLayout.tsx  # Blog list layout
│   └── AuthorLayout.tsx # Author page layout
├── data/               # Content and configuration
│   ├── blog/           # Blog posts (MDX) - PRIMARY CONTENT LOCATION
│   ├── old/            # Archived posts (also processed)
│   ├── authors/        # Author profiles (MDX)
│   ├── siteMetadata.js # Site configuration
│   ├── headerNavLinks.ts # Navigation links
│   └── projectsData.ts # Projects data
├── public/             # Static assets
│   └── static/images/  # Images referenced in posts
├── css/                # Stylesheets
│   ├── tailwind.css    # Tailwind base
│   └── prism.css       # Code syntax highlighting
├── scripts/            # Build scripts
│   ├── postbuild.mjs   # Runs after build
│   ├── rss.mjs         # RSS feed generation
│   ├── sitemap.mjs     # Sitemap generation
│   └── search.mjs      # Search index generation
└── .contentlayer/      # Generated content (gitignored)
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `contentlayer.config.ts` | Contentlayer schema for Blog and Authors |
| `data/siteMetadata.js` | Site title, URL, social links, comments, analytics |
| `next.config.js` | Next.js config with Contentlayer, security headers |
| `tailwind.config.js` | Tailwind theme, typography, dark mode |
| `tsconfig.json` | TypeScript config with path aliases |
| `.eslintrc.js` | ESLint rules (TypeScript, React, a11y) |

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npm run start

# Production build (includes postbuild scripts)
npm run build

# Start production server
npm run serve

# Lint and fix
npm run lint

# Analyze bundle
npm run analyze
```

## Content Management

### Adding a New Blog Post

1. Create a new `.mdx` file in `data/blog/` with naming pattern `post_YYMMDD.mdx` or descriptive name
2. Include required frontmatter:

```mdx
---
title: 'Post Title'
date: '2026-01-24'
tags: ['tag1', 'tag2']
draft: false
summary: 'Brief description for listing and SEO'
authors: ['default']
---

Post content in MDX format...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `tags` | No | Array of tag strings |
| `draft` | No | Set `true` to hide from production |
| `summary` | No | Short description for listings |
| `authors` | No | Array of author slugs (default: `['default']`) |
| `images` | No | Array of image paths for SEO |
| `layout` | No | Custom layout (default: `PostLayout`) |
| `lastmod` | No | Last modified date |
| `canonicalUrl` | No | Canonical URL if cross-posted |

### Adding an Author

Create an MDX file in `data/authors/` (e.g., `myname.mdx`):

```mdx
---
name: 'Author Name'
avatar: '/static/images/avatar.jpg'
occupation: 'Developer'
company: 'Company Name'
email: 'email@example.com'
twitter: 'https://twitter.com/handle'
github: 'https://github.com/handle'
---

Author bio in MDX...
```

## Code Conventions

### TypeScript/React

- Use TypeScript for all `.tsx` files
- Path aliases available: `@/components/*`, `@/data/*`, `@/layouts/*`, `@/lib/*`, `@/css/*`
- Import contentlayer types: `import { Blog, Authors } from 'contentlayer/generated'`
- Use `pliny` utilities for content operations:
  - `sortedBlogPost()` - Sort posts by date
  - `allCoreContent()` - Extract core content for listings
  - `coreContent()` - Extract single post core content

### Styling

- Use Tailwind CSS classes (dark mode via `dark:` prefix)
- Dark mode is class-based (`darkMode: 'class'`)
- Primary color: `sky` (via Tailwind colors)
- Typography plugin for prose styling (`prose dark:prose-dark`)
- Custom styles in `tailwind.config.js` typography section

### MDX Features

- **Code highlighting**: Prism via `rehype-prism-plus`
- **Math**: KaTeX via `rehype-katex` (`$inline$` or `$$block$$`)
- **GFM**: Tables, strikethrough, autolinks via `remark-gfm`
- **Auto-linking headings**: `rehype-autolink-headings`
- **TOC**: Use `<TOCInline toc={props.toc} />` in MDX
- **Images**: Use `<Image>` component or standard markdown

### Components Available in MDX

Defined in `components/MDXComponents.tsx`:
- `Image` - Next.js optimized image
- `TOCInline` - Table of contents
- `a` (CustomLink) - Internal/external link handling
- `pre` (Pre) - Code block with copy button
- `BlogNewsletterForm` - Newsletter signup form

## Important Notes

### Content Location
- **Always place blog posts in `data/blog/`** - The `blog/` folder in root is NOT processed
- Contentlayer processes files from `data/` directory only
- Pattern for blog: `{blog,old}/**/*.mdx`
- Pattern for authors: `authors/**/*.mdx`

### Image Paths
- Place images in `public/static/images/`
- Reference with leading slash: `/static/images/example.png`

### Environment Variables
For local development, create `.env.local` from `.env.example`:
- Giscus comments: `NEXT_PUBLIC_GISCUS_*` variables
- Newsletter: `BUTTONDOWN_API_KEY`

### Pre-commit Hooks
Husky runs lint-staged on commit:
- ESLint fix for `.js`, `.jsx`, `.ts`, `.tsx`
- Prettier format for code and content files

### Security Headers
Configured in `next.config.js`:
- CSP includes Giscus domain
- X-Frame-Options: DENY
- Strict HSTS

## Common Tasks

### Change Site Metadata
Edit `data/siteMetadata.js`:
- `title`, `author`, `description`
- `siteUrl` for production URL
- `comments.giscusConfig` for comment settings
- `analytics` for tracking providers

### Add Navigation Link
Edit `data/headerNavLinks.ts`:
```ts
const headerNavLinks = [
  { href: '/blog', title: 'Blog' },
  { href: '/new-page', title: 'New Page' },
]
```

### Change Theme Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: colors.sky,  // Change to colors.blue, etc.
  gray: colors.neutral,
}
```

### Switch to Light Mode Default
In `data/siteMetadata.js`:
```js
theme: 'light', // 'system', 'dark', or 'light'
```

## Build & Deploy

### Local Build
```bash
npm run build
# Generates:
# - .next/ (Next.js build)
# - .contentlayer/ (Generated content)
# - public/feed.xml (RSS)
# - public/sitemap.xml (Sitemap)
# - public/search.json (Search index, if enabled)
```

### Vercel Deployment
- Push to main branch triggers deploy
- Set environment variables in Vercel dashboard
- Node.js 22.x runtime (specified in `package.json` engines)

## Troubleshooting

### Contentlayer Issues
- Run `rm -rf .contentlayer` and rebuild
- Check MDX frontmatter syntax (YAML format)
- Ensure dates are valid ISO format

### Build Failures
- Check for TypeScript errors: `npx tsc --noEmit`
- Check ESLint: `npm run lint`
- Verify all imports resolve correctly

### Missing Posts
- Confirm file is in `data/blog/` (not root `blog/`)
- Check `draft: false` in frontmatter
- Verify date format is valid
