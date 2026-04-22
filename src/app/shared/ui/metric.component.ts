import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-metric',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-1.5">
      <span class="font-display text-5xl md:text-6xl leading-none tabular text-ink-900 dark:text-foam">
        {{ value() }}
      </span>
      <span class="label text-ink-700 dark:text-taupe max-w-[14rem]">
        {{ label() }}
      </span>
    </div>
  `,
})
export class MetricComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
}
