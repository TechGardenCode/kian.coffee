import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center font-mono text-xs font-medium px-3 py-1.5 rounded-full border border-crema/80 text-ink-700 dark:border-roast-700 dark:text-taupe"
    >
      <ng-content />
    </span>
  `,
})
export class ChipComponent {}
