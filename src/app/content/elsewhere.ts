/**
 * /elsewhere configuration — typed list of RSS/Atom feeds to aggregate.
 *
 * Day-one scope: external writing only (per Stage 4 decisions). Adding a new
 * feed = append an entry here. Build redeploys the site; at runtime the SSR
 * server fetches each feed inside a TTL cache. A failing feed logs a warning
 * and returns no items — other feeds still render.
 *
 * Sources are grouped so the page can render editorial sections (e.g. "Essays",
 * "Talks") rather than a flat reverse-chron stream.
 */

export type FeedKind =
  | 'essay' // long-form on Medium / Substack / Dev.to / personal blog
  | 'talk' // conference / podcast / video
  | 'social' // LinkedIn / X / thread
  | 'code'; // GitHub release / notable repo

export interface FeedSource {
  /** Stable identifier — used in URLs, logs, and cache keys. */
  readonly id: string;
  /** Human-readable source name: "Medium", "Substack", "Dev.to". */
  readonly label: string;
  readonly kind: FeedKind;
  /** RSS / Atom feed URL. */
  readonly url: string;
}

export const ELSEWHERE_FEEDS: readonly FeedSource[] = [
  // Seed placeholder — replace with real feeds when we have them.
  // Example once live:
  // { id: 'medium', label: 'Medium', kind: 'essay', url: 'https://medium.com/feed/@kian' },
  // { id: 'devto',  label: 'Dev.to',  kind: 'essay', url: 'https://dev.to/feed/techgardencode' },
];

export interface KindMeta {
  readonly heading: string;
  readonly blurb: string;
}

/** Display metadata per kind — the `/elsewhere` page groups items under these. */
export const KIND_META: Readonly<Record<FeedKind, KindMeta>> = {
  essay: {
    heading: 'Essays & long-form',
    blurb: 'Extended thinking that outgrew a tweet.',
  },
  talk: {
    heading: 'Talks, podcasts, videos',
    blurb: 'When the medium wanted to be audio or video.',
  },
  social: {
    heading: 'Threads & short-form',
    blurb: 'The stuff that worked better compressed.',
  },
  code: {
    heading: 'Code, shipped',
    blurb: 'Releases and repos I want to call out.',
  },
};
