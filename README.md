# Data CATS Site

The Davidson College Data CATS consultant roster, filterable directory, and appointment booking site.

## Stack

- **[Astro](https://astro.build)** for static-site generation, content collections for consultant data.
- **[Svelte 5](https://svelte.dev)** islands for interactivity (filtering, booking modal).
- **[Tailwind CSS 4](https://tailwindcss.com)** for styling.
- **Zoom Scheduler** (embedded iframe) for booking appointments — no custom backend required.
- Data lives in the repo as markdown (see below), not a database — the roster is small (8-10 people) and changes rarely, so a git-reviewable content collection is simpler to maintain than a hosted API.

## Project structure

```text
src/
├── content/consultants/*.md   # one file per consultant (frontmatter = structured data, body = bio)
├── content.config.ts          # zod schema for consultant frontmatter, incl. major/minor rules
├── components/                # Svelte islands: ConsultantGrid, ScheduleButton, ScheduleModal
├── layouts/Layout.astro       # shared page shell/nav
├── lib/consultant.ts          # shared helpers (major/minor label formatting)
└── pages/
    ├── index.astro            # consultant grid + filters
    └── consultants/[slug].astro  # consultant detail page + Zoom Scheduler link
```

> A team calendar (`calendar.astro`, plus a `TeamCalendar`/`ConsultantSchedule` Svelte pair backed by FullCalendar) previously lived here. It was removed at the site owner's request in August 2026; `calendar.astro` is preserved, disabled, in `mothballed/` for reference, but the components and availability data it depended on were deleted outright.

## Editing the roster

Add or edit a consultant by adding/editing a file in `src/content/consultants/`. Each file is markdown with frontmatter:

- `majors` (0-2) — declared majors. If empty, use `intendedMajors` instead (for students without a declared major).
- `minor` — optional; only valid when the consultant has exactly **one** declared or intended major.
- `headshot` — path to an image in `src/assets/headshots/` (swap the placeholder SVGs for real photos).
- `zoomSchedulerUrl` — only set for consultants who take bookable appointments; renders a "Schedule an Appointment" button on their profile that opens the Zoom Scheduler.
- The markdown body becomes the consultant's bio on their detail page.

These rules are enforced by the zod schema in `src/content.config.ts` — `npm run build` will fail with a clear error if a consultant file violates them.

## Commands

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`      | Install dependencies                          |
| `npm run dev`       | Start local dev server at `localhost:4321`   |
| `npm run build`     | Build production site to `./dist/`            |
| `npm run preview`   | Preview the production build locally          |

## Deployment

`.github/workflows/publish.yml` builds the site, then publishes `dist/` into the `datacats/` subfolder of [`DavidsonCollege-DataScience/datasci-hub`](https://github.com/DavidsonCollege-DataScience/datasci-hub) on every push to `main`. That hub repo is the only one that deploys to the shared `datasci.davidson.edu` Azure Static Web App — see its README for why (Azure SWA deploys fully replace the app's content, so three repos deploying straight to it would clobber each other) and for the one-time secret setup (`HUB_REPO_PUSH_TOKEN`, a fine-grained PAT scoped to just that repo).

The site is served from `https://datasci.davidson.edu/datacats/` (a subpath, not the domain root), so `astro.config.mjs` sets `site`/`base` accordingly, and internal links use the `withBase()` helper (`src/lib/url.ts`) instead of hardcoded `/`-rooted paths so they resolve correctly under that subpath.
