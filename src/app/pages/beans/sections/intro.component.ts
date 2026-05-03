import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-beans-intro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        <strong class="text-ink-900 dark:text-foam">Beans</strong> is the design system that every page on this
        site is built from. It's a two-tier token model — a raw palette of warm
        neutrals and restrained accents underneath, semantic surface tokens on
        top — paired with a small set of components, behaviors, and page
        substrates. The system favors generosity: long line-length, deliberate
        whitespace, and a doc-shape rhythm borrowed from print.
      </p>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        This page is the canonical reference. Everything below is rendered with
        the live tokens, so the swatches you see are the same colors the rest
        of the site is using right now. Switch the page mode (header, top
        right) to see the dark substrate.
      </p>
    </div>
  `,
})
export class BeansIntroComponent {}
