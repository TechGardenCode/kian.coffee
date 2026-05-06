import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { KcPageMarketing, KcPageHero, KcPageSection } from '@kian.coffee/beans';

import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { BlogApiService } from '../../shared/blog/blog-api.service';
import { SeoService } from '../../shared/seo/seo.service';
import { SITE } from '../../shared/seo/site';
import { BlogPostCardComponent } from './blog-post-card.component';
import type { PostSummary } from '../../shared/blog/blog.types';

interface IndexState {
  readonly posts: readonly PostSummary[];
  readonly status: 'loading' | 'ready' | 'error';
}

const INITIAL: IndexState = { posts: [], status: 'loading' };

@Component({
  selector: 'app-blog-index',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RevealDirective,
    EyebrowComponent,
    BlogPostCardComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
  ],
  template: `
    <kc-page-marketing>
      <kc-page-hero>
        <app-eyebrow [label]="eyebrow()" />
        <h1
          appReveal
          class="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
        >
          {{ headline() }}
        </h1>
        <p appReveal class="max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
          {{ leade() }}
        </p>
      </kc-page-hero>

      <kc-page-section [hasHead]="false">
        @switch (state().status) {
          @case ('loading') {
            <p class="font-mono text-caption text-ink-500 dark:text-taupe-dim">Loading…</p>
          }
          @case ('error') {
            <p class="font-mono text-caption text-ink-500 dark:text-taupe-dim">
              Couldn't reach the writing archive. Try again in a moment.
            </p>
          }
          @case ('ready') {
            @if (state().posts.length === 0) {
              <p class="font-sans text-body-md text-ink-700 dark:text-taupe">
                Nothing here yet. Check back soon.
              </p>
            } @else {
              <div class="grid gap-12 md:grid-cols-2">
                @for (post of state().posts; track post.id) {
                  <div appReveal>
                    <app-blog-post-card [post]="post" />
                  </div>
                }
              </div>
            }
          }
        }
      </kc-page-section>
    </kc-page-marketing>
  `,
})
export class BlogIndexPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(BlogApiService);
  private readonly seo = inject(SeoService);

  readonly tag = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('tag') ?? null)),
    { initialValue: null },
  );

  readonly state = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('tag') ?? undefined),
      switchMap((tag): Observable<IndexState> =>
        this.api.list({ tag, page: 0, size: 24 }).pipe(
          map((r): IndexState => ({ posts: r.content, status: 'ready' })),
          catchError(() => of<IndexState>({ posts: [], status: 'error' })),
          startWith<IndexState>(INITIAL),
        ),
      ),
    ),
    { initialValue: INITIAL satisfies IndexState },
  );

  readonly eyebrow = computed(() => (this.tag() ? `/blog/tag/${this.tag()}` : '/blog'));
  readonly headline = computed(() => (this.tag() ? `Tagged ${this.tag()}.` : 'Writing.'));
  readonly leade = computed(() =>
    this.tag()
      ? `Posts tagged ${this.tag()}.`
      : 'Notes from the homelab, the rack, the build pipeline, and whatever I happen to be reading. No newsletter — RSS works.',
  );

  private readonly _seoEffect = effect(() => {
    const tag = this.tag();
    const title = tag ? `Tagged ${tag} — Writing` : 'Writing';
    const path = tag ? `/blog/tag/${tag}` : '/blog';
    const description = tag
      ? `Posts tagged ${tag} on kian.coffee.`
      : 'Writing from Kian Alikhani — homelab, infra, tools, taste.';
    this.seo.apply({
      title,
      description,
      path,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `Writing — ${SITE.name}`,
        url: `${SITE.url}/blog`,
        author: { '@type': 'Person', name: SITE.owner, url: SITE.url },
      },
    });
  });
}
