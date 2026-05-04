import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-beans-intro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        <strong class="text-ink-900 dark:text-foam">Beans</strong> is the design system this site runs on. Two
        layers: a raw palette of warm neutrals and a single accent underneath,
        semantic tokens on top. Plus a small set of components, behaviors, and
        page shells.
      </p>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Leans toward print. Long lines, lots of whitespace, headings that
        breathe.
      </p>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        This page is the reference. Every swatch and sample below is the live
        token, so what you see is what the site is using right now. Mode
        toggle's in the header for the dark version.
      </p>
    </div>
  `,
})
export class BeansIntroComponent {}
