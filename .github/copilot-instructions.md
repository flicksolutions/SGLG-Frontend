# Copilot Instructions for SGLG-Frontend

## Build & Dev Commands

- **Package manager**: pnpm (v10)
- **Dev server**: `pnpm dev`
- **Build**: `pnpm build` (static site via `@sveltejs/adapter-static`)
- **Lint**: `pnpm lint` (Prettier + ESLint)
- **Format**: `pnpm format`
- **No test suite** exists in this project.

The build requires a `PUBLIC_API` environment variable pointing to the Directus instance. For CI, Node gets `--max_old_space_size=9000` due to the prerender workload.

## Architecture

This is a **SvelteKit static site** that consumes content from a **Directus CMS** backend. Pages are prerendered and deployed to GitHub Pages.

### Data Flow

1. **`src/lib/functions.js`** sets up the Directus client via `createDirectus(PUBLIC_API).with(rest())` and exports shared data-fetching helpers (`getItems`, `hydrateTranslations`, `replaceTranslations`).
2. **`+layout.server.js`** (root) fetches the page menu structure and background image URLs — available to all routes.
3. **`+page.server.js`** files in each route fetch route-specific data from Directus collections (`entities`, `pages`, `homepage`, `Highlights`, `directories`, `current_newsletter`, `disturber`).
4. Translation fields are merged into the main item objects server-side using `hydrateTranslations()` and `replaceTranslations()` before reaching components.

### i18n (Paraglide)

- **4 locales**: `de` (base), `en`, `fr`, `it`
- Translation strings live in `messages/{locale}.json`
- Paraglide auto-generates `$lib/paraglide/` — do not edit files there manually.
- In components, use `import { m } from '$lib/paraglide/messages'` and call message functions: `m.highlights_title_short()`, `m.directories({ count: 1 })`.
- URL localization is handled by `hooks.js` (reroute) and `hooks.server.js` (middleware). Use `linkHandler()` from `$lib/functions.js` when building internal links.

### Routing

- `/` — Homepage with news items and a featured "disturber" sticker
- `/[slug]` — Dynamic CMS pages with accordion blocks, image grids, member lists
- `/highlights` — Masonry image gallery
- `/directories` — Searchable/filterable entity table with MiniSearch full-text search
- `/directories/detail/[id]` — Single entity detail page
- `/asset/[path]` — Server route that proxies Directus file assets

### Search (Directories)

`/directories` uses **MiniSearch** for client-side full-text search across `title`, `person`, `event_place`, `publications_series`, `isbn`, and `content`. Documents are indexed async on mount. Results are combined with category/date/internal filters and paginated.

## Key Conventions

### Styling

- **SCSS with global theme**: `svelte.config.js` prepends `@use 'theme.scss' as *;` into every component's `<style lang="scss">` block. All theme variables (`$dark-green`, `$sglg-orange`, `$text-font`, `$title-font`, etc.) and mixins (`max-width()`, `gutters()`, `text-columns()`) are available without imports.
- **Breakpoints**: `$small: 600px`, `$medium: 800px`, `$large: 1200px`
- **Global utility classes** are defined in `src/lib/style/global.scss` (`.content-layout`, `.accordion-item`, `.button`, `.spacer`, `.internal`).

### Components

- Components live in `src/lib/components/` and use scoped SCSS.
- The codebase is **migrating from Svelte 4 to Svelte 5** patterns. Newer components use `$props()`, `$state()`, `$derived`, `$effect`; older ones still use `export let` and event dispatchers. When writing new code, use **Svelte 5 runes**.
- SVG icons are imported as raw strings (`?raw` suffix) and rendered with `{@html}`. Icon constants are centralized in `src/lib/constants.js`.

### Directus Conventions

- The `ASSET_URL` constant (`'/asset/'`) from `src/lib/constants.js` is used to build image/file URLs that route through the `/asset/[path]` proxy.
- `createLabel(item)` in `src/lib/functions.js` generates display labels based on item type (event, publication, review, CFP) — use it rather than formatting labels inline.

### Deployment

- Static build deploys to **GitHub Pages** via `.github/workflows/deploy.yml`
- Triggers on push to `master` or `upgrade-sveltekit`, plus `repository_dispatch` from Directus webhooks (content changes trigger rebuilds).
- Deployment status is reported back to Directus via a webhook callback.
