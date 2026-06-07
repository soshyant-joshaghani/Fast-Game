/** Pure helper — safe to import from Vitest without SvelteKit env. */
export function normalizeApiBaseUrl(value: string | undefined, fallback = '/api/v1'): string {
  return (value ?? fallback).replace(/\/$/, '');
}
