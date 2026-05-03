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
import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { PROJECT_GROUPS } from '../../content/projects';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RevealDirective,
    EyebrowComponent,
    ChipComponent,
    LinkArrowComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
    KcPageFooterCta,
  ],
  template: `
    <kc-page-marketing>
      <kc-page-hero>
        <app-eyebrow label="/projects" index="02" />
        <h1
          appReveal
          class="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
        >
          The workshop behind<br />
          <span class="text-accent">the résumé.</span>
        </h1>
        <p appReveal class="max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
          Side projects in three groups. The platform underneath everything.
          The places AI earns a seat at the table. The apps I ship through the
          same pipeline that serves this page.
        </p>
      </kc-page-hero>

      @for (group of groups; track group.heading; let gi = $index) {
        <kc-page-section headRule>
          <span slot="eyebrow" appReveal class="label text-ink-700 dark:text-taupe">
            <span class="tabular">{{ pad(gi + 1) }}</span>
            <span class="mx-2 opacity-50">/</span>
            <span>Group</span>
          </span>
          <h2
            slot="title"
            appReveal
            class="font-display text-3xl md:text-5xl leading-tight tracking-tight text-ink-900 dark:text-foam"
          >
            {{ group.heading }}
          </h2>
          <p slot="kicker" class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe md:text-right md:max-w-sm">
            {{ group.note }}
          </p>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (project of group.projects; track project.title) {
              <article
                appReveal
                class="flex h-full flex-col gap-5 rounded-xl border border-crema/80 bg-cream-100/40 p-6 md:p-8 transition-colors hover:border-ink-700/40 dark:border-roast-700 dark:bg-roast-900/40 dark:hover:border-taupe/60"
              >
                <span class="label-sm text-ink-700 dark:text-taupe">{{ project.eyebrow }}</span>

                <h3 class="font-display text-2xl leading-tight tracking-tight text-ink-900 dark:text-foam">
                  {{ project.title }}
                </h3>

                <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
                  {{ project.summary }}
                </p>

                <div class="flex flex-wrap gap-2 pt-1">
                  @for (chip of project.stack; track chip) {
                    <app-chip>{{ chip }}</app-chip>
                  }
                </div>

                @if (project.links?.length) {
                  <div class="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
                    @for (link of project.links ?? []; track link.href) {
                      <app-link-arrow [href]="link.href" [external]="link.external ?? false">
                        {{ link.label }}
                      </app-link-arrow>
                    }
                  </div>
                }
              </article>
            }
          </div>
        </kc-page-section>
      }

      <kc-page-footer-cta>
        <p slot="prose" appReveal class="max-w-xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Public repos live under
          <a href="https://github.com/TechGardenCode" target="_blank" rel="noopener noreferrer" class="link-flourish">github.com/TechGardenCode</a>.
        </p>
        <ng-container slot="arrows">
          <app-link-arrow href="/lab">Tour the lab</app-link-arrow>
          <a routerLink="/contact" class="link-flourish label text-ink-700 dark:text-taupe">
            or say hi →
          </a>
        </ng-container>
      </kc-page-footer-cta>
    </kc-page-marketing>
  `,
})
export class ProjectsComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly groups = PROJECT_GROUPS;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Projects',
      description:
        'Side projects — self-hosted hybrid cloud, zero-trust home network, AI-first ops, apps shipped from the same lab.',
      path: '/projects',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
