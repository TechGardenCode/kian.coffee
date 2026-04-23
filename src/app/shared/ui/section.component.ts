import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../motion/reveal.directive';
import { EyebrowComponent } from './eyebrow.component';

@Component({
  selector: 'app-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, EyebrowComponent],
  template: `
    <section
      [id]="anchor()"
      class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 py-24 md:py-32"
    >
      <div class="mb-12 md:mb-16 flex flex-col gap-4 border-b border-crema/70 pb-6 md:flex-row md:items-end md:justify-between md:gap-8 dark:border-roast-700">
        <div class="flex flex-col gap-3 md:min-w-0 md:flex-1">
          <app-eyebrow [label]="eyebrow()" [index]="index()" />
          <h2
            appReveal
            class="font-display text-3xl md:text-5xl leading-tight tracking-tight text-ink-900 dark:text-foam max-w-3xl"
          >
            {{ title() }}
          </h2>
        </div>
        @if (kicker()) {
          <span class="label text-ink-700 dark:text-taupe md:max-w-[18rem] md:shrink-0 md:text-right">
            {{ kicker() }}
          </span>
        }
      </div>
      <div class="relative">
        <ng-content />
      </div>
    </section>
  `,
})
export class SectionComponent {
  readonly anchor = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly index = input<string | null>(null);
  readonly kicker = input<string | null>(null);
}
