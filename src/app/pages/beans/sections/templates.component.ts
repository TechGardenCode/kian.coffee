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
    description: 'Bare substrate. The width-and-rhythm container that every other template extends.',
    bands: [{ height: '0.5rem' }, { height: '2.5rem' }, { height: '0.5rem' }],
  },
  {
    name: 'Page hero',
    selector: 'kc-page-hero',
    description: 'Top of a page. Tall, single-purpose; lede + headline + first action live here.',
    bands: [{ height: '3rem' }, { height: '0.5rem' }],
  },
  {
    name: 'Page section',
    selector: 'kc-page-section',
    description: 'Repeating content block. Optional title + kicker head; rule-line modifier for editorial pages.',
    bands: [{ height: '0.5rem' }, { height: '1.5rem' }, { height: '1.5rem' }],
  },
  {
    name: 'Page band',
    selector: 'kc-page-band',
    description: 'Tinted strip across the page. Plain or metric (3-up grid) variants.',
    bands: [{ height: '1.25rem' }],
  },
  {
    name: 'Page footer CTA',
    selector: 'kc-page-footer-cta',
    description: 'Closing call-to-action. Prose left + arrow links right; bordered top divides from content above.',
    bands: [{ height: '0.5rem' }, { height: '1.5rem' }],
  },
  {
    name: 'Page (marketing)',
    selector: 'kc-page-marketing',
    description: 'Marketing-page modifier. Same primitives, retuned column width and section rhythm.',
    bands: [{ height: '3rem' }, { height: '0.5rem' }, { height: '1.25rem' }, { height: '1rem' }],
  },
  {
    name: 'Page (doc)',
    selector: 'kc-page-doc',
    description: 'Documentation shape. Sticky nav rail + scrolling main, scroll-spy active. This page uses it.',
    bands: [{ height: '2.5rem' }, { height: '0.5rem' }, { height: '1rem' }],
  },
];

@Component({
  selector: 'app-beans-templates',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="mb-6 max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
      Page templates are the substrates the rest of the site composes
      against. Each template owns width, gutter, and section rhythm so
      individual pages don't reinvent layout. Sketches are abstract
      shapes — read them as the visual rhythm, not the literal
      content.
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
          <p class="m-0 font-sans text-[0.8rem] leading-relaxed text-ink-500 dark:text-taupe-dim">{{ t.description }}</p>
        </article>
      }
    </div>
  `,
})
export class BeansTemplatesComponent {
  readonly templates = TEMPLATES;
}
