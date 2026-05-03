import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  KcPageMarketing,
  KcPageHero,
  KcPageSection,
  KcPageFooterCta,
} from '@kian.coffee/beans';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { WORK } from '../../content/work';

@Component({
  selector: 'app-work',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RevealDirective,
    EyebrowComponent,
    LinkArrowComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
    KcPageFooterCta,
  ],
  template: `
    <kc-page-marketing>
      <kc-page-hero style="--kc-page-hero-pb: 0">
        <app-eyebrow label="/work" index="01" />
      </kc-page-hero>

      <kc-page-section [hasHead]="false" style="padding-block: 0 var(--space-8)">
        @for (role of roles; track role.range; let i = $index) {
          <article
            appReveal
            class="flex flex-col gap-2 border-t border-crema/70 py-10 dark:border-roast-700"
          >
            <span class="label text-ink-700 dark:text-taupe">
              <span class="tabular">{{ pad(i + 1) }}</span>
              <span class="mx-2 opacity-50">/</span>
              <span>{{ role.range }}</span>
            </span>
            <div class="font-display text-2xl leading-snug text-ink-900 dark:text-foam">
              {{ role.company }}
            </div>
            <div class="label-sm text-ink-500 dark:text-taupe-dim">
              {{ role.title }}
            </div>
          </article>
        }
      </kc-page-section>

      <kc-page-section [hasHead]="false" style="padding-block: 0 var(--space-8)">
        <div
          appReveal
          class="grid gap-8 border-t border-crema/70 pt-12 md:grid-cols-[1fr_2.2fr] md:gap-16 dark:border-roast-700"
        >
          <div class="flex flex-col gap-2">
            <span class="label text-ink-700 dark:text-taupe">
              <span class="tabular">00</span>
              <span class="mx-2 opacity-50">/</span>
              <span>School</span>
            </span>
            <span class="label-sm text-ink-500 dark:text-taupe-dim">Before it started</span>
          </div>
          <div class="flex flex-col gap-3">
            <div>
              <div class="font-display text-xl text-ink-900 dark:text-foam">
                Case Western Reserve University
              </div>
              <div class="font-sans text-body-sm text-ink-700 dark:text-taupe">
                B.S. Computer Science · Dec 2018
              </div>
            </div>
            <div>
              <div class="font-display text-xl text-ink-900 dark:text-foam">
                Thomas Jefferson High School for Science and Technology
              </div>
              <div class="font-sans text-body-sm text-ink-700 dark:text-taupe">
                2015
              </div>
            </div>
          </div>
        </div>
      </kc-page-section>

      <kc-page-footer-cta>
        <p slot="prose" appReveal class="max-w-xl font-sans text-body-md leading-relaxed text-ink-700 dark:text-taupe">
          What I build on the clock is only half of it. The side projects
          are where I get to try things without a review board.
        </p>
        <ng-container slot="arrows">
          <app-link-arrow href="/projects">See projects</app-link-arrow>
          <a routerLink="/contact" class="link-flourish label text-ink-700 dark:text-taupe">
            or say hi →
          </a>
        </ng-container>
      </kc-page-footer-cta>
    </kc-page-marketing>
  `,
})
export class WorkComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly roles = WORK;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Work',
      description: 'Roles and dates — Mastercard, Conseqta Technology, IBM Watson.',
      path: '/work',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
