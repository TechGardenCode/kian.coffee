import Parser from 'rss-parser';
import type { FeedKind, FeedSource } from '../../content/elsewhere';

export interface ElsewhereItem {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceLabel: string;
  readonly kind: FeedKind;
  readonly title: string;
  readonly url: string;
  readonly publishedAt: string | null;
  readonly excerpt: string | null;
}

const PER_SOURCE_TIMEOUT_MS = 5_000;
const MAX_ITEMS_PER_SOURCE = 8;

const parser = new Parser({
  timeout: PER_SOURCE_TIMEOUT_MS,
  headers: {
    'User-Agent': 'kian.coffee feed aggregator (+https://kian.coffee/elsewhere)',
  },
});

/**
 * Fetch one source. Returns an empty array on any failure — timeout, parse
 * error, 404 — so a broken feed never takes down the page. Errors are logged
 * at warn level for operator visibility.
 */
async function fetchOne(source: FeedSource): Promise<ElsewhereItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = (feed.items ?? []).slice(0, MAX_ITEMS_PER_SOURCE);
    return items
      .map((raw, idx): ElsewhereItem | null => {
        const url = raw.link?.trim();
        const title = raw.title?.trim();
        if (!url || !title) return null;
        return {
          id: `${source.id}:${raw.guid ?? raw.isoDate ?? `${idx}:${url}`}`,
          sourceId: source.id,
          sourceLabel: source.label,
          kind: source.kind,
          title,
          url,
          publishedAt: raw.isoDate ?? raw.pubDate ?? null,
          excerpt: excerptFrom(raw),
        };
      })
      .filter((item): item is ElsewhereItem => item !== null);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[elsewhere] feed "${source.id}" failed: ${reason}`);
    return [];
  }
}

function excerptFrom(raw: Parser.Item): string | null {
  const candidate = raw.contentSnippet ?? raw.summary ?? raw.content ?? '';
  if (!candidate) return null;
  const cleaned = candidate.replace(/\s+/g, ' ').trim();
  if (cleaned.length === 0) return null;
  if (cleaned.length <= 180) return cleaned;
  return cleaned.slice(0, 177).trimEnd() + '…';
}

/**
 * Fetch every configured feed in parallel. Results are sorted newest-first.
 * Individual feed failures are swallowed by `fetchOne` — a feed-level error
 * must never block the page render.
 */
export async function fetchAllFeeds(sources: readonly FeedSource[]): Promise<ElsewhereItem[]> {
  if (sources.length === 0) return [];
  const all = await Promise.all(sources.map(fetchOne));
  const items = all.flat();
  items.sort((a, b) => {
    const at = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bt - at;
  });
  return items;
}
