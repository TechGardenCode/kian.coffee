import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EyebrowComponent } from '../shared/ui/eyebrow.component';
import { LinkArrowComponent } from '../shared/ui/link-arrow.component';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, EyebrowComponent, LinkArrowComponent],
  template: `
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 py-32 md:py-44">
      <app-eyebrow [label]="eyebrow()" [index]="index()" />
      <h1 class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam">
        {{ title() }}
      </h1>
      <p class="mt-8 max-w-xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        {{ blurb() }}
      </p>
      <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <app-link-arrow href="/">Back to home</app-link-arrow>
        <a
          routerLink="/contact"
          class="link-flourish label text-ink-700 dark:text-taupe"
        >
          or say hi →
        </a>
      </div>
    </section>
  `,
})
export class PlaceholderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly blurb = input.required<string>();
  readonly index = input<string | null>(null);
}
