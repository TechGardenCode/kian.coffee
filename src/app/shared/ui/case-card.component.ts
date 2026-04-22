import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChipComponent } from './chip.component';
import { LinkArrowComponent } from './link-arrow.component';

export interface CaseCardLink {
  label: string;
  href: string;
  external?: boolean;
}

@Component({
  selector: 'app-case-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipComponent, LinkArrowComponent],
  template: `
    <article
      class="group relative flex h-full flex-col gap-5 rounded-xl border border-crema/80 bg-cream-100/60 p-6 md:p-8 transition-colors hover:border-ink-700/40 dark:border-roast-700 dark:bg-roast-900/60 dark:hover:border-taupe/60"
    >
      <div class="flex items-center gap-3">
        <span class="label-sm text-ink-700 dark:text-taupe">
          {{ eyebrow() }}
        </span>
        @if (number()) {
          <span class="label-sm tabular text-ink-500 dark:text-taupe-dim">— {{ number() }}</span>
        }
      </div>

      <h3 class="font-display text-2xl md:text-3xl leading-tight tracking-tight text-ink-900 dark:text-foam">
        {{ title() }}
      </h3>

      <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe max-w-prose">
        {{ summary() }}
      </p>

      @if (metrics()?.length) {
        <div class="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          @for (m of metrics(); track m.label) {
            <div class="flex items-baseline gap-1.5">
              <span class="font-display text-xl tabular text-ink-900 dark:text-foam">{{ m.value }}</span>
              <span class="label-sm text-ink-700 dark:text-taupe">{{ m.label }}</span>
            </div>
          }
        </div>
      }

      @if (stack()?.length) {
        <div class="flex flex-wrap gap-2 pt-1">
          @for (chip of stack(); track chip) {
            <app-chip>{{ chip }}</app-chip>
          }
        </div>
      }

      @if (links()?.length) {
        <div class="flex flex-wrap gap-x-6 gap-y-2 pt-2 mt-auto">
          @for (link of links(); track link.href) {
            <app-link-arrow [href]="link.href" [external]="link.external ?? false">
              {{ link.label }}
            </app-link-arrow>
          }
        </div>
      }
    </article>
  `,
})
export class CaseCardComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly summary = input.required<string>();
  readonly number = input<string | null>(null);
  readonly metrics = input<{ value: string; label: string }[] | null>(null);
  readonly stack = input<string[] | null>(null);
  readonly links = input<CaseCardLink[] | null>(null);
}
