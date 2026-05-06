import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { KcPageMarketing, KcPageHero, KcPageSection } from '@kian.coffee/beans';

import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { BlogApiService } from '../../shared/blog/blog-api.service';
import { SeoService } from '../../shared/seo/seo.service';
import { SITE } from '../../shared/seo/site';
import type { Post } from '../../shared/blog/blog.types';

type PostState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly post: Post }
  | { readonly status: 'not-found' }
  | { readonly status: 'error' };

const INITIAL: PostState = { status: 'loading' };

@Component({
  selector: 'app-blog-post',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    ChipComponent,
    LinkArrowComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
  ],
  template: `
    @switch (state().status) {
      @case ('loading') {
        <kc-page-marketing>
          <kc-page-hero>
            <p class="font-mono text-caption text-ink-500 dark:text-taupe-dim">Loading…</p>
          </kc-page-hero>
        </kc-page-marketing>
      }
      @case ('not-found') {
        <kc-page-marketing>
          <kc-page-hero>
            <h1 class="font-display text-5xl text-ink-900 dark:text-foam">Post not found.</h1>
            <p class="font-sans text-body-md text-ink-700 dark:text-taupe">
              Maybe it was unpublished. Head back to the
              <a routerLink="/blog" class="link-flourish">writing archive</a>.
            </p>
          </kc-page-hero>
        </kc-page-marketing>
      }
      @case ('error') {
        <kc-page-marketing>
          <kc-page-hero>
            <h1 class="font-display text-5xl text-ink-900 dark:text-foam">Couldn't load that post.</h1>
            <p class="font-sans text-body-md text-ink-700 dark:text-taupe">Try again in a moment.</p>
          </kc-page-hero>
        </kc-page-marketing>
      }
      @case ('ready') {
        @let p = post();
        @if (p) {
          <kc-page-marketing>
            <kc-page-hero>
              <a routerLink="/blog" class="label text-ink-700 dark:text-taupe link-flourish">/blog</a>
              <h1
                class="font-display text-5xl md:text-6xl leading-[1.08] tracking-tight text-ink-900 dark:text-foam"
              >
                {{ p.title }}
              </h1>
              <p class="max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
                {{ p.description }}
              </p>
              <div class="label flex flex-wrap items-center gap-3 text-ink-500 dark:text-taupe-dim">
                @if (p.publishedAt; as published) {
                  <time [attr.datetime]="published">{{ published | date: 'longDate' }}</time>
                }
                @if (p.readingMinutes) {
                  <span aria-hidden="true">·</span>
                  <span>{{ p.readingMinutes }} min read</span>
                }
              </div>
              <div class="flex flex-wrap items-center gap-3">
                @for (tag of p.tags; track tag) {
                  <a [routerLink]="['/blog', 'tag', tag]" class="contents">
                    <app-chip>{{ tag }}</app-chip>
                  </a>
                }
              </div>
            </kc-page-hero>

            @if (coverUrl(); as src) {
              <kc-page-section [hasHead]="false">
                <img
                  [src]="src"
                  [alt]="p.title"
                  class="w-full rounded-card border border-crema/70 dark:border-roast-700"
                />
              </kc-page-section>
            }

            <kc-page-section [hasHead]="false">
              <article class="prose-coffee" [innerHTML]="p.bodyHtml"></article>
            </kc-page-section>

            <kc-page-section [hasHead]="false">
              <div class="border-t border-crema/70 pt-8 dark:border-roast-700">
                <app-link-arrow href="/blog">More writing</app-link-arrow>
              </div>
            </kc-page-section>
          </kc-page-marketing>
        }
      }
    }
  `,
})
export class BlogPostPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(BlogApiService);
  private readonly seo = inject(SeoService);

  readonly state = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('slug')),
      switchMap((slug): Observable<PostState> => {
        if (!slug) return of({ status: 'not-found' } satisfies PostState);
        return this.api.bySlug(slug).pipe(
          map((post): PostState => ({ status: 'ready', post })),
          catchError((err: unknown) => {
            const httpStatus = (err as { status?: number } | null)?.status;
            return of<PostState>(
              httpStatus === 404 ? { status: 'not-found' } : { status: 'error' },
            );
          }),
          startWith<PostState>(INITIAL),
        );
      }),
    ),
    { initialValue: INITIAL satisfies PostState },
  );

  readonly post = computed<Post | null>(() => {
    const s = this.state();
    return s.status === 'ready' ? s.post : null;
  });

  readonly coverUrl = computed(() => {
    const s = this.state();
    if (s.status !== 'ready') return null;
    return s.post.coverImageId ? this.api.mediaUrl(s.post.coverImageId) : null;
  });

  private readonly _seoEffect = effect(() => {
    const s = this.state();
    if (s.status !== 'ready') return;
    const post = s.post;
    const url = `${SITE.url}/blog/${post.slug}`;
    const ogImage = post.coverImageId ? this.api.mediaUrl(post.coverImageId) : undefined;
    this.seo.apply({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
      ogType: 'article',
      ogImage,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { '@type': 'Person', name: SITE.owner, url: SITE.url },
        ...(ogImage ? { image: ogImage } : {}),
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: [...post.tags],
      },
    });
  });
}
