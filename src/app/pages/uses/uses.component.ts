import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { USES } from '../../content/uses';

@Component({
  selector: 'app-uses',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, EyebrowComponent, LinkArrowComponent],
  template: `
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-12">
      <app-eyebrow label="/uses" index="04" />
      <h1
        appReveal
        class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
      >
        The stuff I actually<br />
        <span class="text-accent">reach for.</span>
      </h1>
      <p appReveal class="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        Editor, desk, rack, terminal, espresso bar. Nothing aspirational on
        this page. Just what's in daily rotation. Updated when something
        changes, which is rarer than you'd think.
      </p>
    </section>

    <!-- GROUPS -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pb-24">
      @for (group of groups; track group.heading; let i = $index) {
        <div appReveal class="grid gap-8 border-t border-crema/70 py-12 md:grid-cols-[1fr_2fr] md:gap-16 dark:border-roast-700">
          <div class="flex flex-col gap-2">
            <span class="label text-ink-700 dark:text-taupe">
              <span class="tabular">{{ pad(i + 1) }}</span>
              <span class="mx-2 opacity-50">/</span>
              <span>{{ group.heading }}</span>
            </span>
            <p class="font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe max-w-sm">
              {{ group.note }}
            </p>
          </div>

          <ul class="flex flex-col">
            @for (item of group.items; track item.name) {
              <li class="flex flex-col gap-1.5 border-b border-crema/50 py-4 first:pt-0 last:border-0 md:flex-row md:items-baseline md:gap-6 dark:border-roast-800">
                <span class="font-display text-lg text-ink-900 dark:text-foam md:min-w-[14rem]">{{ item.name }}</span>
                <span class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">{{ item.detail }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </section>

    <section class="relative z-10">
      <div class="mx-auto w-full max-w-6xl px-6 md:px-10 pb-28 md:pb-36">
        <div appReveal class="flex flex-col gap-4 border-t border-crema/70 pt-12 dark:border-roast-700 md:flex-row md:items-end md:justify-between">
          <p class="max-w-xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            The rack gets its own page. Diagrams, host roster, and the
            GitOps flow that keeps it running.
          </p>
          <app-link-arrow href="/lab">Go to /lab</app-link-arrow>
        </div>
      </div>
    </section>
  `,
})
export class UsesComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly groups = USES;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Uses',
      description:
        'What I actually use — editor, hardware, homelab rack, terminal tools, and coffee setup.',
      path: '/uses',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
