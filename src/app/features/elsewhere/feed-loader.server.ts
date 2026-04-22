import { Injectable } from '@angular/core';
import { ELSEWHERE_FEEDS } from '../../content/elsewhere';
import type { FeedLoader, LoadedElsewhereItem } from './feed-loader';
import { fetchAllFeeds } from './feed-fetcher';

/** Server-only feed loader. Imported from `app.config.server.ts`, never
 *  from anything the browser bundle touches. Pulls rss-parser + Node
 *  built-ins — those stay on the server side. */
@Injectable()
export class ServerFeedLoader implements FeedLoader {
  async load(): Promise<LoadedElsewhereItem[]> {
    return await fetchAllFeeds(ELSEWHERE_FEEDS);
  }
}
