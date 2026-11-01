# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Live, fully static SvelteKit site backed by Directus CMS. The published site has no runtime dependency on Directus: all content and files are copied into `build/` at build time.

**The Directus backend runs on Koyeb and spins up on request.** `pnpm dev` and `pnpm build` both need it, because every `+page.server.js` fetches from Directus (`PUBLIC_API`, set in the gitignored `.env` locally and as a repo variable in CI). `pnpm lint` and `pnpm format` do not. The first request after an idle period hits a cold start, so it can be slow or fail.

**Pushing to `master` or `upgrade-sveltekit` triggers a production deploy**, and a cold start that outlasts the retries could break the live site rather than fail the build:

- `prerender.handleHttpError` is `'warn'`, and the root layout turns any Directus failure into a 403, so failed pages may not fail the build.
- `fetchWithRetry` only retries HTTP 502/503 (about 14s in total) and does not retry network errors.

Check the build log for prerender warnings after a deploy.

## Commands

Uses pnpm 10 (CI runs Node 24).

```sh
pnpm dev       # dev server (needs Directus)
pnpm build     # prerender everything to build/ (needs Directus)
pnpm preview   # serve the build
pnpm lint      # prettier --check + eslint
pnpm format    # prettier --write
```

There is no test suite. CI sets `NODE_OPTIONS=--max_old_space_size=9000` for the build; set it locally if prerendering runs out of memory.

## Architecture

### Build-time data flow

`adapter-static` with `prerender = true` set in the root layout, so every route is prerendered. All Directus access belongs in `+page.server.js`, `+layout.server.js` or `+server.js`. Browsers never talk to Directus, so a client-side fetch to it would fail on the live site.

`src/lib/functions.js` holds the Directus client and shared helpers. Root `+layout.server.js` supplies the menu and background image URLs to all routes. `/directories/detail/[id]` gets its IDs from `entries()`; other pages are found by the prerender crawler following links, so a page with no inbound link is not generated.

Anything computed in a loader is frozen at build time, including the "random" background (`randomIndex`), which is chosen per page per build.

The site only sees new CMS content after a rebuild. Directus triggers one through `repository_dispatch` (`deploy`), and `deploy.yml` reports the result back to a Directus flow.

### Assets

Files are served through `/asset/[path]`, which proxies Directus during prerender and writes the result into `build/asset/`. Static files cannot have query strings, so transform params are encoded into the path after `==`:

```js
`${ASSET_URL}${id}==width=430&format=webp`; // → {PUBLIC_API}/assets/{id}?width=430&format=webp
```

- Always use `ASSET_URL` and the `==` form, never a Directus URL or a `?` query string.
- Each distinct param combination becomes its own prerendered file.
- An asset is only generated if the crawler or a loader's `fetch` reaches its URL, so URLs built purely in the browser will 404.
- The route does not check the upstream status, so a failed fetch can be saved as the asset's content.

### i18n

Paraglide with locales `de` (base), `en`, `fr`, `it`. UI strings live in `messages/{locale}.json`; `src/lib/paraglide/` is generated and gitignored. Locale resolution runs through `hooks.js` (reroute) and `hooks.server.js` (middleware). Build internal links with `linkHandler()`, because the localized pages are discovered through those links.

CMS content has two layers: German is on the item itself, other languages are in a `translations` relation.

- `hydrateTranslations(fields, deep, locale)` adds the translated fields and locale filter to a query. It mutates `fields`.
- `replaceTranslations(res, locale)` merges them back over the item, keeping the German value where a translation is empty.

Use this pair in new loaders. `getItems` and `checkLocale` in `functions.js` are currently unused. Some CMS values are also message keys (`m[l.memberlists_id.title]()`, `m[item.event_type]`), so new values need entries in all four message files.

### Directories search

`/directories` ships all entities in its page data and does search, filtering and pagination client-side with MiniSearch. The index is built on mount and preserved through a SvelteKit snapshot. Filters are also driven by URL params (`cat[]`, `news`), which are read client-side only since prerendered pages have no query string.

## Conventions

- `svelte.config.js` prepends `@use 'theme.scss' as *;` to every `<style lang="scss">` block, so theme variables and mixins from `src/lib/style/theme.scss` need no import. Global utility classes are in `src/lib/style/global.scss`.
- Use Svelte 5 runes in new code. Some components still use legacy syntax (`export let`, `on:click`, `createEventDispatcher`), for example `Lightbox.svelte`.
- SVG icons are imported with `?raw`, collected in `src/lib/constants.js` as `SVGS`, and rendered with `{@html}`.
- Use `createLabel(item)` for entity display labels instead of formatting them inline.
- `paths.base` is `''`, and the `BASE_PATH` set in `deploy.yml` is ignored. `ASSET_URL` is root-absolute, so the site assumes it is served from the domain root.

## Svelte tooling

Per `AGENTS.md`, use the Svelte MCP server: `list-sections` then `get-documentation` for Svelte/SvelteKit questions, and run `svelte-autofixer` on Svelte code until it reports no issues.
