import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-eyebrow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="label text-ink-700 dark:text-taupe">
      @if (index(); as i) {
        <span class="tabular">{{ i }}</span>
        <span class="mx-2 opacity-50">/</span>
      }
      <span>{{ label() }}</span>
    </span>
  `,
})
export class EyebrowComponent {
  readonly label = input.required<string>();
  readonly index = input<string | null>(null);
}
