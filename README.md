# Data CATS Site

The Davidson College Data CATS consultant roster, filterable directory, team calendar, and appointment booking site.

## Stack

- **[Astro](https://astro.build)** for static-site generation, content collections for consultant data.
- **[Svelte 5](https://svelte.dev)** islands for interactivity (filtering, calendar, booking modal).
- **[Tailwind CSS 4](https://tailwindcss.com)** for styling.
- **[FullCalendar](https://fullcalendar.io)** for the weekly/monthly team and per-consultant calendars.
- **Zoom Scheduler** (embedded iframe) for booking appointments — no custom backend required.
- Data lives in the repo as markdown + JSON (see below), not a database — the roster is small (8-10 people) and changes rarely, so a git-reviewable content collection is simpler to maintain than a hosted API.

## Project structure

```text
src/
├── content/consultants/*.md   # one file per consultant (frontmatter = structured data, body = bio)
├── content.config.ts          # zod schema for consultant frontmatter, incl. major/minor rules
├── data/availability.json     # sample office-hours / appointment blocks per consultant
├── data/recurringAvailability.json  # weekly recurring bookable slots (term-bound start/end)
├── components/                # Svelte islands: ConsultantGrid, TeamCalendar, ScheduleModal, ConsultantSchedule
├── layouts/Layout.astro       # shared page shell/nav
├── lib/consultant.ts          # shared helpers (major/minor label formatting)
└── pages/
    ├── index.astro            # consultant grid + filters
    ├── calendar.astro         # team calendar + filters
    └── consultants/[slug].astro  # consultant detail page + booking calendar
```

## Editing the roster

Add or edit a consultant by adding/editing a file in `src/content/consultants/`. Each file is markdown with frontmatter:

- `majors` (0-2) — declared majors. If empty, use `intendedMajors` instead (for students without a declared major).
- `minor` — optional; only valid when the consultant has exactly **one** declared or intended major.
- `headshot` — path to an image in `src/assets/headshots/` (swap the placeholder SVGs for real photos).
- `zoomSchedulerUrl` — only set for consultants who take bookable appointments.
- The markdown body becomes the consultant's bio on their detail page.

These rules are enforced by the zod schema in `src/content.config.ts` — `npm run build` will fail with a clear error if a consultant file violates them.

Availability (office hours / appointment blocks) is sample data in `src/data/availability.json`, keyed by consultant slug (the markdown filename). Replace this with real availability data, or wire it up to a live calendar feed, when that's ready.

Weekly recurring availability (e.g. standing office hours for a consultant or faculty member) lives in `src/data/recurringAvailability.json` as recurring rules (`daysOfWeek`/`startTime`/`endTime`/`startRecur`/`endRecur`), one entry per person per contiguous weekly time block. `startRecur` and `endRecur` are **required** — hours won't show before `startRecur` or after `endRecur`, so update or add an entry each term rather than leaving one open-ended. Unlike `availability.json`, these are bookable directly (they render and behave the same as any other open slot) and support `"mode": "either"` for a slot offered as in-person or virtual, interchangeably.

Standing team drop-in hours (independent of any one consultant) live in `src/data/standingOfficeHours.json` as recurring rules (`daysOfWeek`/`startTime`/`endTime`/`startRecur`/`endRecur`), one entry per contiguous time block per term. **Add a new entry each term** — the dates are firm start/end bounds, so hours won't show before `startRecur` or after `endRecur`. These render as a translucent, non-clickable background band on every calendar (team and individual), distinct from real bookable appointments, so they never look like a specific consultant's shift.

Academic breaks (Fall Break, Thanksgiving, Spring Break, etc.) live in `src/data/academicBreaks.json` as a flat list of `{label, start, end}` date ranges (both inclusive). **Update this each year** from the [registrar's academic calendar](https://www.davidson.edu/offices-and-services/registrar/academic-calendars). Everyone's recurring availability and the standing drop-in hours automatically go dark during these ranges — `src/lib/academicBreaks.js` splits each recurring rule's active date range around them at render time, so you never have to hand-edit anyone's individual `startRecur`/`endRecur` to account for a break.

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
