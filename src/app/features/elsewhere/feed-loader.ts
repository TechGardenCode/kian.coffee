import { InjectionToken } from '@angular/core';
import type { FeedKind } from '../../content/elsewhere';

/** Same shape the fetcher produces; redeclared here so browser bundle never
 *  drags in the fetcher's Node-only dependencies. */
export interface LoadedElsewhereItem {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceLabel: string;
  readonly kind: FeedKind;
  readonly title: string;
  readonly url: string;
  readonly publishedAt: string | null;
  readonly excerpt: string | null;
}

export interface FeedLoader {
  load(): Promise<LoadedElsewhereItem[]>;
}

/** Default browser-safe implementation. The browser should *never* actually
 *  fetch feeds — server render places everything into TransferState and the
 *  service reads from there on hydration. If this no-op is reached on the
 *  client, something bypassed the TransferState check. */
export class BrowserFeedLoader implements FeedLoader {
  async load(): Promise<LoadedElsewhereItem[]> {
    return [];
  }
}

export const FEED_LOADER = new InjectionToken<FeedLoader>('FEED_LOADER', {
  providedIn: 'root',
  factory: () => new BrowserFeedLoader(),
});
