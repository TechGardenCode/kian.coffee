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
import { createScrollSpy, type ScrollSpyHandle } from "../../core/behaviors/scroll-spy";

export interface KcPageDocSection {
  readonly id: string;
  readonly label: string;
  readonly depth?: 1 | 2;
}

/**
 * Doc-shape page template. Two-column on lg+: nav rail (left, projected
 * via [slot=nav]) + scrolling content main (right). Stacks on small.
 *
 * Composition:
 *   <kc-page-doc [sections]="sections" #doc="kcPageDoc">
 *     <aside slot="nav" class="lg:sticky lg:top-12">
 *       @for (s of sections; track s.id) {
 *         <a [routerLink]="[]" [fragment]="s.id"
 *            [class.active]="doc.activeId() === s.id">{{ s.label }}</a>
 *       }
 *     </aside>
 *     <kc-page-section anchor="intro">...</kc-page-section>
 *     ...
 *   </kc-page-doc>
 *
 * The lib provides: grid layout + scroll-spy + the `activeId` signal.
 * The consumer owns nav presentation (heading, list shape, link styling,
 * any toolbar). This keeps the lib free of opinionated nav chrome and
 * lets each consumer style with their own utility framework.
 */
@Component({
  selector: "kc-page-doc",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "kcPageDoc",
  template: `
    <ng-content select="[slot=nav]" />
    <main class="kc-page__doc-main">
      <ng-content />
    </main>
  `,
  host: {
    class: "kc-page kc-page--doc",
  },
})
export class KcPageDoc implements AfterViewInit {
  readonly sections = input.required<readonly KcPageDocSection[]>();

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
