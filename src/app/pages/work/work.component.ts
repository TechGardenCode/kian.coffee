import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { WORK } from '../../content/work';

@Component({
  selector: 'app-work',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RevealDirective, EyebrowComponent, ChipComponent, LinkArrowComponent],
  template: `
    <!-- HERO -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-8">
      <app-eyebrow label="/work" index="01" />
      <h1
        appReveal
        class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
      >
        Four chapters, not a<br />
        <span class="text-accent">bullet list.</span>
      </h1>
      <p appReveal class="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        I think about my career in eras, not job titles. Each one had a
        different kind of hard problem at the center of it. The stacks change.
        The habit of building things that have to hold up doesn't.
      </p>
    </section>

    <!-- TIMELINE -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pb-16">
      @for (role of roles; track role.range; let i = $index) {
        <article
          appReveal
          class="grid gap-8 border-t border-crema/70 py-16 md:grid-cols-[1fr_2.2fr] md:gap-16 dark:border-roast-700"
        >
          <!-- Left column — metadata -->
          <div class="flex flex-col gap-3">
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

            <!-- Anchor stat — the number the reader should walk away with. -->
            @if (role.stat; as stat) {
              <div class="mt-4 flex flex-col gap-1.5 border-l-2 border-crema/70 pl-4 dark:border-roast-700">
                <span class="font-display text-3xl text-accent">{{ stat.value }}</span>
                <span class="font-sans text-[13px] leading-relaxed text-ink-700 dark:text-taupe max-w-[18rem]">
                  {{ stat.label }}
                </span>
              </div>
            }
          </div>

          <!-- Right column — narrative -->
          <div class="flex flex-col gap-6">
            <h2 class="font-display text-3xl md:text-4xl leading-tight tracking-tight text-ink-900 dark:text-foam">
              {{ role.chapter }}
            </h2>

            <p class="font-sans text-[17px] leading-[1.65] text-ink-700 dark:text-taupe max-w-prose">
              {{ role.narrative }}
            </p>

            <div class="flex flex-wrap gap-2 pt-2">
              @for (tag of role.domains; track tag) {
                <app-chip>{{ tag }}</app-chip>
              }
            </div>
          </div>
        </article>
      }
    </section>

    <!-- EDUCATION (brief) -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pb-20">
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
            <div class="font-sans text-[14px] text-ink-700 dark:text-taupe">
              B.S. Computer Science · 2018
            </div>
          </div>
          <div>
            <div class="font-display text-xl text-ink-900 dark:text-foam">
              Thomas Jefferson High School for Science and Technology
            </div>
            <div class="font-sans text-[14px] text-ink-700 dark:text-taupe">
              2015
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- OUTBOUND -->
    <section class="relative z-10">
      <div class="mx-auto w-full max-w-6xl px-6 md:px-10 pb-28 md:pb-36">
        <div
          appReveal
          class="flex flex-col gap-4 border-t border-crema/70 pt-12 dark:border-roast-700 md:flex-row md:items-end md:justify-between"
        >
          <p class="max-w-xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            What I build on the clock is only half of it. The side projects
            are where I get to try things without a review board.
          </p>
          <div class="flex flex-col items-start gap-3 md:items-end">
            <app-link-arrow href="/projects">See projects</app-link-arrow>
            <a routerLink="/contact" class="link-flourish label text-ink-700 dark:text-taupe">
              or say hi →
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WorkComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly roles = WORK;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Work',
      description:
        'Career arc — four roles across Mastercard, Conseqta, and IBM Watson. Data platforms, design systems, AI foundations.',
      path: '/work',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
