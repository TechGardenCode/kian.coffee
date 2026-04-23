import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { ElsewhereService, ElsewhereView } from '../../features/elsewhere/elsewhere.service';

@Component({
  selector: 'app-elsewhere',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, RevealDirective, EyebrowComponent, ChipComponent, LinkArrowComponent],
  template: `
    <!-- HERO -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-8">
      <app-eyebrow label="/elsewhere" index="06" />
      <h1
        appReveal
        class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
      >
        Where the writing<br />
        <span class="text-accent">actually lives.</span>
      </h1>
      <p appReveal class="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        I don't write a lot. When I do, it usually ends up somewhere else
        first. A gist, a PR, a conference talk, a long Slack thread. This
        page collects those link-outs so they don't get buried.
      </p>
    </section>

    <!-- META STRIP — freshness + count -->
    <section class="relative z-10 border-y border-crema/70 bg-cream-100/40 dark:border-roast-700 dark:bg-roast-900/40">
      <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-6">
        <div class="label text-ink-700 dark:text-taupe">
          <span class="tabular">{{ view().totalCount }}</span>
          <span class="mx-2 opacity-50">·</span>
          <span>tracked across {{ view().groups.length || 0 }} source {{ view().groups.length === 1 ? 'type' : 'types' }}</span>
        </div>
        <div class="label-sm text-ink-500 dark:text-taupe-dim">
          last refreshed {{ view().generatedAt | date: 'short' }}
        </div>
      </div>
    </section>

    @if (view().groups.length === 0) {
      <!-- Empty state — shown when no feeds are configured yet or all feeds failed. -->
      <section class="relative z-10 mx-auto w-full max-w-4xl px-6 md:px-10 py-24">
        <div appReveal class="rounded-xl border border-crema/80 bg-cream-100/40 p-10 md:p-14 dark:border-roast-700 dark:bg-roast-900/40">
          <span class="label text-ink-700 dark:text-taupe">Nothing here yet</span>
          <h2 class="mt-4 font-display text-3xl md:text-4xl leading-tight text-ink-900 dark:text-foam">
            Nothing's caught up to this feed yet.
          </h2>
          <p class="mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            Either the feeds haven't been wired up or the last refresh came
            back empty. For now, most of the interesting stuff lives in
            commits. GitHub's a decent proxy.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <app-link-arrow href="https://github.com/TechGardenCode" [external]="true">
              github.com/TechGardenCode
            </app-link-arrow>
            <a
              routerLink="/contact"
              class="link-flourish label text-ink-700 dark:text-taupe"
            >
              or just say hi →
            </a>
          </div>
        </div>
      </section>
    } @else {
      <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pb-12">
        @for (group of view().groups; track group.kind; let gi = $index) {
          <div class="border-t border-crema/70 py-14 dark:border-roast-700">
            <div
              appReveal
              class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8"
            >
              <div class="flex flex-col gap-3 max-w-2xl">
                <span class="label text-ink-700 dark:text-taupe">
                  <span class="tabular">{{ pad(gi + 1) }}</span>
                  <span class="mx-2 opacity-50">/</span>
                  <span>{{ group.heading }}</span>
                </span>
              </div>
              <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe md:text-right md:max-w-sm">
                {{ group.blurb }}
              </p>
            </div>

            <ul class="flex flex-col">
              @for (item of group.items; track item.id) {
                <li
                  appReveal
                  class="border-t border-crema/50 py-6 first:pt-4 first:border-0 dark:border-roast-800"
                >
                  <a
                    [href]="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col gap-3"
                  >
                    <div class="flex flex-wrap items-center gap-3">
                      <app-chip>{{ item.sourceLabel }}</app-chip>
                      @if (item.publishedAt) {
                        <span class="label-sm tabular text-ink-500 dark:text-taupe-dim">
                          {{ item.publishedAt | date: 'mediumDate' }}
                        </span>
                      }
                    </div>
                    <h3 class="font-display text-2xl md:text-3xl leading-tight tracking-tight text-ink-900 transition-colors group-hover:text-accent dark:text-foam">
                      <span class="link-flourish">{{ item.title }}</span>
                      <span class="ml-2 text-ink-500 transition-transform group-hover:translate-x-0.5 dark:text-taupe-dim" aria-hidden="true">↗</span>
                    </h3>
                    @if (item.excerpt) {
                      <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe max-w-prose">
                        {{ item.excerpt }}
                      </p>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </section>
    }

    <!-- OUTBOUND -->
    <section class="relative z-10">
      <div class="mx-auto w-full max-w-6xl px-6 md:px-10 pb-28 md:pb-36">
        <div
          appReveal
          class="flex flex-col gap-4 border-t border-crema/70 pt-12 dark:border-roast-700 md:flex-row md:items-end md:justify-between"
        >
          <p class="max-w-xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            See something worth a follow-up? I read everything that lands in
            my inbox.
          </p>
          <div class="flex flex-col items-start gap-3 md:items-end">
            <app-link-arrow href="/contact">Say hi</app-link-arrow>
            <a routerLink="/now" class="link-flourish label text-ink-700 dark:text-taupe">
              or see what I'm up to now →
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ElsewhereComponent implements OnInit {
  private readonly service = inject(ElsewhereService);
  private readonly seo = inject(SeoService);
  private readonly _view = signal<ElsewhereView>({ groups: [], totalCount: 0, generatedAt: new Date().toISOString() });
  readonly view = this._view.asReadonly();

  constructor() {
    // Route resolver would also work, but since the service already routes
    // server vs browser correctly via TransferState, loading from the
    // component keeps the route config simple.
    void this.service.load().then((view) => this._view.set(view));
  }

  ngOnInit(): void {
    this.seo.apply({
      title: 'Elsewhere',
      description:
        'Where I actually publish — essays, talks, threads. Aggregated from external feeds, refreshed server-side.',
      path: '/elsewhere',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
