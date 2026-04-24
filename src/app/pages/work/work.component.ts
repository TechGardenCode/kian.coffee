import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { WORK } from '../../content/work';

@Component({
  selector: 'app-work',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RevealDirective, EyebrowComponent, LinkArrowComponent],
  template: `
    <!--
      CONTENT STRATEGY — /work

      Job of this page: let a reader scan *where* Kian has been, *for how long*,
      and *in what role* — then offer a path to deeper proof (projects, writing)
      if they want it. Not the place for per-role marketing copy; projects and
      case studies do that work.

      Future structure:
        1. Hero — TBD. Next pass: either eyebrow + one-line positioning, or no
           hero at all. Don't make promises the list can't back up.
        2. Timeline — factual spine. Range · company · role. No decoration
           until the right decoration is known.
        3. Throughlines (optional) — one section pulling *across* roles rather
           than narrating each one. Hold until the angle is clear.
        4. Education — keep factual.
        5. Outbound — revise tone when the hero is revised.
    -->

    <!--
      HERO — intentionally minimal.
      Next pass: decide between (a) eyebrow + one-line positioning, or
      (b) no hero at all. Don't add copy that the list below can't back up.
    -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-8">
      <app-eyebrow label="/work" index="01" />
    </section>

    <!--
      TIMELINE — date / company / role only, by design.
      Per-role narratives, stats, and domain chips were removed because the
      previous copy wasn't the story we want on the page yet.
      Future: consider a single "throughlines" section pulling *across* roles
      rather than narrating each one individually.
    -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pb-16">
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

    <!--
      OUTBOUND — links stay live regardless of tone.
      Revisit this copy when the hero is rewritten so the two match.
    -->
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
      description: 'Roles and dates — Mastercard, Conseqta Technology, IBM Watson.',
      path: '/work',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
