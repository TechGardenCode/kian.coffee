import { ChangeDetectionStrategy, Component } from '@angular/core';

interface TemplateCard {
  readonly name: string;
  readonly selector: string;
  readonly description: string;
  readonly bands: readonly { height: string }[];
}

const TEMPLATES: readonly TemplateCard[] = [
  {
    name: 'Page',
    selector: 'kc-page',
    description: 'The bare shell. Sets the width and rhythm that everything else extends.',
    bands: [{ height: '0.5rem' }, { height: '2.5rem' }, { height: '0.5rem' }],
  },
  {
    name: 'Page hero',
    selector: 'kc-page-hero',
    description: 'The top of a page. Tall and single-purpose. Lede, headline, and first action go here.',
    bands: [{ height: '3rem' }, { height: '0.5rem' }],
  },
  {
    name: 'Page section',
    selector: 'kc-page-section',
    description: 'Repeating content block. Optional title and kicker. There is a rule-line variant for the editorial pages.',
    bands: [{ height: '0.5rem' }, { height: '1.5rem' }, { height: '1.5rem' }],
  },
  {
    name: 'Page band',
    selector: 'kc-page-band',
    description: 'A tinted strip across the page. Plain, or a 3-up grid for metrics.',
    bands: [{ height: '1.25rem' }],
  },
  {
    name: 'Page footer CTA',
    selector: 'kc-page-footer-cta',
    description: 'The closing call-to-action. Prose on the left, arrow links on the right, with a top border to separate it from whatever is above.',
    bands: [{ height: '0.5rem' }, { height: '1.5rem' }],
  },
  {
    name: 'Page (marketing)',
    selector: 'kc-page-marketing',
    description: 'Marketing variant of Page. Same building blocks, but the column width and section rhythm are tuned for it.',
    bands: [{ height: '3rem' }, { height: '0.5rem' }, { height: '1.25rem' }, { height: '1rem' }],
  },
  {
    name: 'Page (doc)',
    selector: 'kc-page-doc',
    description: 'Documentation shape. Sticky nav on the left, scrolling main on the right, scroll-spy on. This page is using it right now.',
    bands: [{ height: '2.5rem' }, { height: '0.5rem' }, { height: '1rem' }],
  },
];

@Component({
  selector: 'app-beans-templates',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="mb-6 max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
      Page templates are the shells everything else lives inside. Each
      one owns its own width, gutters, and section rhythm so pages
      don't have to reinvent layout. The sketches below are abstract,
      so read them as rhythm, not content.
    </p>

    <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]">
      @for (t of templates; track t.selector) {
        <article class="flex flex-col gap-2 rounded-md border border-ink-900/10 bg-cream-50 p-4 dark:border-foam/10 dark:bg-roast-850">
          <div class="flex aspect-[4/3] flex-col gap-1 rounded bg-cream-200 p-2 dark:bg-roast-950">
            @for (band of t.bands; track $index) {
              <span class="rounded-sm bg-accent/20" [style.height]="band.height"></span>
            }
          </div>
          <h3 class="m-0 font-mono text-xs text-ink-900 dark:text-foam">&lt;{{ t.selector }}&gt;</h3>
          <p class="m-0 font-sans text-body-sm leading-relaxed text-ink-500 dark:text-taupe-dim">{{ t.description }}</p>
        </article>
      }
    </div>
  `,
})
export class BeansTemplatesComponent {
  readonly templates = TEMPLATES;
}
