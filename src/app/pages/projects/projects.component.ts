import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [RouterLink, RevealDirective, EyebrowComponent, ChipComponent, LinkArrowComponent],
  template: `
    <!-- HERO -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-8">
      <app-eyebrow label="/projects" index="02" />
      <h1
        appReveal
        class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
      >
        The workshop behind<br />
        <span class="text-accent">the résumé.</span>
      </h1>
      <p appReveal class="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        Side projects in three groups. The platform underneath everything.
        The places AI earns a seat at the table. The apps I ship through the
        same pipeline that serves this page.
      </p>
    </section>

    <!-- GROUPS -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pb-16">
      @for (group of groups; track group.heading; let gi = $index) {
        <div class="border-t border-crema/70 py-16 dark:border-roast-700">
          <!-- Group header -->
          <div
            appReveal
            class="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8"
          >
            <div class="flex flex-col gap-3 max-w-2xl">
              <span class="label text-ink-700 dark:text-taupe">
                <span class="tabular">{{ pad(gi + 1) }}</span>
                <span class="mx-2 opacity-50">/</span>
                <span>Group</span>
              </span>
              <h2 class="font-display text-3xl md:text-5xl leading-tight tracking-tight text-ink-900 dark:text-foam">
                {{ group.heading }}
              </h2>
            </div>
            <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe md:text-right md:max-w-sm">
              {{ group.note }}
            </p>
          </div>

          <!-- Project cards -->
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
        </div>
      }
    </section>

    <!-- OUTBOUND -->
    <section class="relative z-10">
      <div class="mx-auto w-full max-w-6xl px-6 md:px-10 pb-28 md:pb-36">
        <div
          appReveal
          class="flex flex-col gap-4 border-t border-crema/70 pt-12 dark:border-roast-700 md:flex-row md:items-end md:justify-between"
        >
          <p class="max-w-xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            Public repos live under
            <a href="https://github.com/TechGardenCode" target="_blank" rel="noopener noreferrer" class="link-flourish">github.com/TechGardenCode</a>.
          </p>
          <div class="flex flex-col items-start gap-3 md:items-end">
            <app-link-arrow href="/lab">Tour the lab</app-link-arrow>
            <a routerLink="/contact" class="link-flourish label text-ink-700 dark:text-taupe">
              or say hi →
            </a>
          </div>
        </div>
      </div>
    </section>
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
