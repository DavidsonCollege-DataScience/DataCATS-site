// Prefixes an app-relative path with Astro's configured base path (e.g. "/datacats/")
// so links keep working when the site is served from a subpath of the shared
// datasci.davidson.edu Azure Static Web App. Pass paths without a leading slash:
// withBase('about'), withBase('').
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
