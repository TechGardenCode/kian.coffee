import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  input,
  signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";
import { createScrollSpy, type ScrollSpyHandle } from "../../core/behaviors/scroll-spy";

export interface KcPageAnchorNavSection {
  readonly id: string;
  readonly label: string;
  readonly depth?: 1 | 2;
}

/**
 * Right-rail in-page anchor navigation. Owns its own scroll-spy and
 * presentation. Designed to be slotted into a page substrate that
 * positions it (KcPageMarketing reads this via contentChild and adds
 * .kc-page--has-anchor-nav, switching to a 2-column grid at >= 1024px).
 *
 *   <kc-page-marketing>
 *     <kc-page-anchor-nav slot="anchor-nav" [sections]="sections" />
 *     <kc-page-hero> ... </kc-page-hero>
 *     <kc-page-section anchor="..."> ... </kc-page-section>
 *     ...
 *   </kc-page-marketing>
 *
 * Visibility is responsive: hidden < 1024px, 10rem at 1024-1279px,
 * 16rem at >= 1280px (rail width is set by the substrate).
 */
@Component({
  selector: "kc-page-anchor-nav",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "kcPageAnchorNav",
  imports: [RouterLink],
  template: `
    <nav class="kc-page__anchor-nav-inner" aria-label="Section navigation">
      @if (heading(); as h) {
        <p class="kc-page__anchor-nav-heading">{{ h }}</p>
      }
      <ol class="kc-page__anchor-nav-list">
        @for (s of sections(); track s.id) {
          <li
            class="kc-page__anchor-nav-item"
            [class.kc-page__anchor-nav-item--nested]="s.depth === 2"
          >
            <a
              [routerLink]="[]"
              [fragment]="s.id"
              class="kc-page__anchor-nav-link"
              [class.kc-page__anchor-nav-link--active]="activeId() === s.id"
            >{{ s.label }}</a>
          </li>
        }
      </ol>
    </nav>
  `,
  host: {
    class: "kc-page__anchor-nav",
  },
})
export class KcPageAnchorNav implements AfterViewInit {
  readonly sections = input.required<readonly KcPageAnchorNavSection[]>();
  readonly heading = input<string | null>(null);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _activeId = signal<string | null>(null);
  readonly activeId = this._activeId.asReadonly();

  private spy: ScrollSpyHandle | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const ids = this.sections().map((s) => s.id);
    if (ids.length === 0) return;

    this.spy = createScrollSpy({ ids });
    const unsubscribe = this.spy.subscribe((id) => this._activeId.set(id));

    this.destroyRef.onDestroy(() => {
      unsubscribe();
      this.spy?.destroy();
    });
  }
}
