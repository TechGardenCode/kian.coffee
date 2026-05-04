import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../shared/theme/theme.service';
import { MotionService } from '../shared/motion/motion.service';

interface NavItem {
  label: string;
  route: string;
}

/**
 * Commit-point scroll-aware header (Headroom-style). The state flips based on
 * *cumulative* distance from the last committed position — not per-frame
 * scroll deltas, which would make us fight trackpad momentum jitter at 60fps.
 *
 * NEAR_TOP_PX  — always-visible band covering the hero. No hide logic here.
 * HIDE_DISTANCE — continuous scroll-down past the pin point before we hide.
 * SHOW_DISTANCE — continuous scroll-up past the unpin point before we show.
 *                 Deliberately smaller than HIDE_DISTANCE so "reveal" feels
 *                 cheap while "hide" feels intentional.
 * HIDE_FLOOR_Y — absolute minimum scrollY before any hiding is allowed. Stops
 *                the header from disappearing on the very first flick off the
 *                hero even if the pin-distance math would allow it.
 */
const NEAR_TOP_PX = 32;
const HIDE_DISTANCE = 48;
const SHOW_DISTANCE = 8;
const HIDE_FLOOR_Y = 48;

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  // `display: contents` makes the <app-header> host transparent to layout.
  // Without it, the host element's box is only 56px tall and becomes the
  // containing block for the inner `position: sticky` <header>, so the
  // header slides off-screen as soon as the user scrolls past that 56px.
  // With `contents`, the <header> becomes a direct layout child of the
  // <app-root> flex-column wrapper and sticky pins to the viewport correctly.
  host: { class: 'contents' },
  template: `
    <header
      [attr.data-visible]="effectiveVisible()"
      class="sticky top-0 z-40 border-b border-crema/70 bg-cream-50/85 backdrop-blur-md transition-transform duration-500 ease-out data-[visible=false]:-translate-y-full motion-reduce:transition-none dark:border-roast-700 dark:bg-roast-950/85"
    >
      <div class="kc-container kc-container--md flex h-14 items-center justify-between">
        <a
          routerLink="/"
          class="font-display text-base tracking-tight text-ink-900 dark:text-foam"
          aria-label="kian.coffee — home"
        >
          <span class="font-mono text-sm font-medium tracking-tight">kian</span><span class="text-ink-700 dark:text-taupe">.coffee</span>
        </a>

        <nav class="hidden items-center gap-8 md:flex" aria-label="primary">
          @for (item of nav; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="!text-ink-900 dark:!text-foam"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              class="link-flourish label text-ink-700 dark:text-taupe"
            >
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="theme.toggle()"
            class="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-crema/80 text-ink-700 transition-colors hover:border-ink-700/50 dark:border-roast-700 dark:text-taupe dark:hover:border-taupe/70"
            [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <span class="font-mono text-sm" aria-hidden="true">{{ theme.isDark() ? '☾' : '☀' }}</span>
          </button>

          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-crema/80 text-ink-700 md:hidden dark:border-roast-700 dark:text-taupe"
            (click)="toggleMobile()"
            [attr.aria-expanded]="mobileOpen()"
            aria-label="Toggle navigation"
          >
            <span class="font-mono text-sm" aria-hidden="true">{{ mobileOpen() ? '×' : '≡' }}</span>
          </button>
        </div>
      </div>

      @if (mobileOpen()) {
        <nav
          class="border-t border-crema/70 bg-cream-50/95 md:hidden dark:border-roast-700 dark:bg-roast-950/95"
          aria-label="mobile"
        >
          <ul class="flex flex-col">
            @for (item of nav; track item.route) {
              <li>
                <a
                  [routerLink]="item.route"
                  routerLinkActive="!text-ink-900 dark:!text-foam"
                  [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                  (click)="closeMobile()"
                  class="block border-b border-crema/60 px-8 py-4 label text-ink-700 last:border-0 dark:border-roast-700 dark:text-taupe"
                >
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </nav>
      }
    </header>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly theme = inject(ThemeService);
  private readonly ngZone = inject(NgZone);
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly nav: NavItem[] = [
    { label: 'Work', route: '/work' },
    { label: 'Projects', route: '/projects' },
    { label: 'Lab', route: '/lab' },
    { label: 'Uses', route: '/uses' },
    { label: 'Beans', route: '/beans' },
    { label: 'Contact', route: '/contact' },
  ];

  private readonly _mobileOpen = signal(false);
  readonly mobileOpen = this._mobileOpen.asReadonly();

  /** Commit-point visibility. Only set by pin()/unpin() to keep the
   *  threshold math honest. Flipping this outside those methods desyncs
   *  the scrollY anchors and breaks the jitter protection. */
  private readonly _visible = signal(true);
  readonly visible = this._visible.asReadonly();

  /** Effective visibility shown to the template. Forces visible while the
   *  mobile menu is open so the hide transform can't race the menu. */
  readonly effectiveVisible = computed(() => this._visible() || this._mobileOpen());

  /** Anchors for the commit-point algorithm. Updated every time we flip
   *  state — "y the last time we committed to visible" / "…to hidden". */
  private pinnedAt = 0;
  private unpinnedAt = 0;
  private rafId = 0;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    // Reduced-motion readers should never see the header slip away —
    // constant visibility is the safest default.
    if (this.motion.prefersReducedMotion) return;

    this.pinnedAt = window.scrollY;
    this.unpinnedAt = window.scrollY;

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });

    // Route changes (including hash-anchor jumps) should always show the
    // nav — the user has clearly just navigated and wants to orient.
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.forcePin());
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('scroll', this.onScroll);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  toggleMobile(): void {
    this._mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this._mobileOpen.set(false);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closeMobile();
  }

  private readonly onScroll = (): void => {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(this.flushScroll);
  };

  private readonly flushScroll = (): void => {
    this.rafId = 0;
    const y = window.scrollY;

    // Near-top band: always visible. Keep pinnedAt in sync so that when the
    // user eventually scrolls down past NEAR_TOP_PX, the HIDE_DISTANCE
    // countdown starts fresh from here rather than from some stale pin.
    if (y <= NEAR_TOP_PX) {
      this.pin(y);
      return;
    }

    if (this._visible()) {
      // Currently visible: hide only if we've scrolled HIDE_DISTANCE past
      // the last pin AND we're past the absolute HIDE_FLOOR_Y.
      if (y - this.pinnedAt > HIDE_DISTANCE && y > HIDE_FLOOR_Y) {
        this.unpin(y);
      } else if (y < this.pinnedAt) {
        // User reversed before crossing the hide threshold. Re-anchor so
        // the next hide attempt starts measuring from this lower point.
        this.pinnedAt = y;
      }
    } else {
      // Currently hidden: show if the user has scrolled SHOW_DISTANCE up
      // from the unpin point.
      if (this.unpinnedAt - y > SHOW_DISTANCE) {
        this.pin(y);
      } else if (y > this.unpinnedAt) {
        // Still scrolling further down — track the new deeper anchor so
        // any later upward motion is measured from here.
        this.unpinnedAt = y;
      }
    }
  };

  /** Commit to visible. Zone-entry required — signal write drives a change
   *  detection cycle that updates the data-visible attribute. */
  private pin(y: number): void {
    this.pinnedAt = y;
    if (this._visible()) return;
    this.ngZone.run(() => this._visible.set(true));
  }

  /** Commit to hidden. */
  private unpin(y: number): void {
    this.unpinnedAt = y;
    if (!this._visible()) return;
    this.ngZone.run(() => this._visible.set(false));
  }

  /** Hard reset on route change — always re-show and re-anchor at current
   *  scroll (which the router's scroll-position-restoration will have set). */
  private forcePin(): void {
    if (!this.isBrowser) return;
    this.pin(window.scrollY);
  }
}
