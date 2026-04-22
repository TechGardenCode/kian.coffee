import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../shared/theme/theme.service';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-40 border-b border-crema/70 bg-cream-50/85 backdrop-blur-md dark:border-roast-700 dark:bg-roast-950/85"
    >
      <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 md:px-10">
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
                  class="block border-b border-crema/60 px-6 py-4 label text-ink-700 last:border-0 dark:border-roast-700 dark:text-taupe"
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
export class HeaderComponent {
  readonly theme = inject(ThemeService);

  readonly nav: NavItem[] = [
    { label: 'Work', route: '/work' },
    { label: 'Projects', route: '/projects' },
    { label: 'Lab', route: '/lab' },
    { label: 'Elsewhere', route: '/elsewhere' },
    { label: 'Uses', route: '/uses' },
    { label: 'Contact', route: '/contact' },
  ];

  private readonly _mobileOpen = signal(false);
  readonly mobileOpen = this._mobileOpen.asReadonly();

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
}
