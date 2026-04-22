import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-arrow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (external()) {
      <a
        [href]="href()"
        target="_blank"
        rel="noopener noreferrer"
        class="link-flourish group inline-flex items-center gap-2 font-sans text-sm text-ink-900 dark:text-foam"
      >
        <ng-content />
        <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
      </a>
    } @else {
      <a
        [routerLink]="href()"
        class="link-flourish group inline-flex items-center gap-2 font-sans text-sm text-ink-900 dark:text-foam"
      >
        <ng-content />
        <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </a>
    }
  `,
})
export class LinkArrowComponent {
  readonly href = input.required<string>();
  readonly external = input<boolean>(false);
}
