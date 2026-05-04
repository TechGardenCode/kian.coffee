import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
} from "@angular/core";
import { KcPageAnchorNav } from "../page-anchor-nav";

/**
 * Marketing/home page wrapper. Pre-applies `.kc-page--marketing` so the
 * substrate tokens retune to the wider column and section rhythm.
 *
 * If a `<kc-page-anchor-nav slot="anchor-nav">` is projected, the host
 * also gets `.kc-page--has-anchor-nav` and switches to a 2-column grid
 * at >= 1024px (10rem rail at 1024-1279, 16rem at >= 1280; rail hidden
 * below). See styles/page-marketing.css.
 *
 * Bare-HTML equivalents:
 *   <div class="kc-page kc-page--marketing"> ... </div>
 *   <div class="kc-page kc-page--marketing kc-page--has-anchor-nav">
 *     <nav class="kc-page__anchor-nav"> ... </nav>
 *     ... hero / sections ...
 *   </div>
 */
@Component({
  selector: "kc-page-marketing",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="kc-page-anchor-nav" />
    <ng-content />
  `,
  host: {
    class: "kc-page kc-page--marketing",
    "[class.kc-page--has-anchor-nav]": "hasAnchorNav()",
  },
})
export class KcPageMarketing {
  private readonly anchorNav = contentChild(KcPageAnchorNav);
  protected readonly hasAnchorNav = computed(() => this.anchorNav() !== undefined);
}
