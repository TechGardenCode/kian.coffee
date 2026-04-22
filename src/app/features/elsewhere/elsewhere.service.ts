import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { FeedKind, KIND_META } from '../../content/elsewhere';
import { FEED_LOADER, LoadedElsewhereItem } from './feed-loader';

export interface ElsewhereItem extends LoadedElsewhereItem {}

export interface ElsewhereGroup {
  readonly kind: FeedKind;
  readonly heading: string;
  readonly blurb: string;
  readonly items: readonly ElsewhereItem[];
}

export interface ElsewhereView {
  readonly groups: readonly ElsewhereGroup[];
  readonly totalCount: number;
  readonly generatedAt: string;
}

const STATE_KEY = makeStateKey<ElsewhereView>('elsewhere.view');
const ORDERED_KINDS: readonly FeedKind[] = ['essay', 'talk', 'social', 'code'];

@Injectable({ providedIn: 'root' })
export class ElsewhereService {
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly loader = inject(FEED_LOADER);

  /**
   * Server-side: calls the real loader, groups the items, stashes in
   * TransferState so hydration picks it up without a re-fetch.
   * Browser-side: reads from TransferState only. If TransferState is empty
   * (direct-nav to a never-rendered route, somehow), returns an empty view
   * — the page renders its empty state gracefully.
   */
  async load(): Promise<ElsewhereView> {
    if (isPlatformServer(this.platformId)) {
      const items = await this.loader.load();
      const view = this.group(items);
      this.transferState.set(STATE_KEY, view);
      return view;
    }
    return (
      this.transferState.get(STATE_KEY, null) ?? {
        groups: [],
        totalCount: 0,
        generatedAt: new Date().toISOString(),
      }
    );
  }

  private group(items: readonly ElsewhereItem[]): ElsewhereView {
    const byKind = new Map<FeedKind, ElsewhereItem[]>();
    for (const item of items) {
      const list = byKind.get(item.kind) ?? [];
      list.push(item);
      byKind.set(item.kind, list);
    }
    const groups: ElsewhereGroup[] = ORDERED_KINDS.filter((k) => byKind.has(k)).map((kind) => ({
      kind,
      heading: KIND_META[kind].heading,
      blurb: KIND_META[kind].blurb,
      items: byKind.get(kind) ?? [],
    }));
    return {
      groups,
      totalCount: items.length,
      generatedAt: new Date().toISOString(),
    };
  }
}
