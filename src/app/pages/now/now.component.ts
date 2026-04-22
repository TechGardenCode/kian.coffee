import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { NOW_FOCUS, NOW_LEADE, NOW_LOCATION, NOW_UPDATED_ISO } from '../../content/now';

@Component({
  selector: 'app-now',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, EyebrowComponent, LinkArrowComponent, DatePipe],
  template: `
    <section class="relative z-10 mx-auto w-full max-w-4xl px-6 md:px-10 pt-20 md:pt-28 pb-24">
      <app-eyebrow label="/now" index="05" />

      <div class="mt-6 flex items-baseline justify-between gap-6 flex-wrap">
        <h1
          appReveal
          class="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
        >
          [/NOW HEADLINE]<br />
          <span class="text-accent">[emphasis phrase].</span>
        </h1>
        <span class="label text-ink-700 dark:text-taupe md:text-right">
          updated {{ updated | date: 'longDate' }}
          <br />
          <span class="text-ink-500 dark:text-taupe-dim">from {{ location }}</span>
        </span>
      </div>

      <p appReveal class="mt-10 max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        {{ leade }}
      </p>

      <div class="mt-16 flex flex-col gap-10">
        @for (item of focus; track item.heading; let i = $index) {
          <article appReveal class="grid gap-4 border-t border-crema/70 pt-8 md:grid-cols-[1fr_3fr] md:gap-12 dark:border-roast-700">
            <div class="flex items-baseline gap-3">
              <span class="font-mono text-[11px] tabular text-ink-500 dark:text-taupe-dim">{{ pad(i + 1) }}</span>
              <h2 class="font-display text-2xl text-ink-900 dark:text-foam">{{ item.heading }}</h2>
            </div>
            <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
              {{ item.body }}
            </p>
          </article>
        }
      </div>

      <div appReveal class="mt-20 flex flex-col gap-4 border-t border-crema/70 pt-12 dark:border-roast-700 md:flex-row md:items-end md:justify-between">
        <p class="max-w-xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Inspired by <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" class="link-flourish">Derek Sivers' /now movement</a>.
          If you have one too, send it over — I'll read it.
        </p>
        <app-link-arrow href="/contact">Say hi</app-link-arrow>
      </div>
    </section>
  `,
})
export class NowComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly focus = NOW_FOCUS;
  readonly leade = NOW_LEADE;
  readonly location = NOW_LOCATION;
  readonly updated = NOW_UPDATED_ISO;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Now',
      description: `What I'm focused on right now. Updated ${NOW_UPDATED_ISO}.`,
      path: '/now',
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
