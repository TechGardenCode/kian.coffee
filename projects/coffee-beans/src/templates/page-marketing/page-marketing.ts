import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Marketing/home page wrapper. Pre-applies `.kc-page--marketing` so the
 * substrate tokens retune to the wider column and section rhythm.
 *
 * Bare-HTML equivalent:
 *   <div class="kc-page kc-page--marketing"> ... </div>
 *
 * Compose with <kc-page-hero>, <kc-page-band>, <kc-page-section>, and
 * <kc-page-footer-cta> as children.
 */
@Component({
  selector: "kc-page-marketing",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: "kc-page kc-page--marketing",
  },
})
export class KcPageMarketing {}
