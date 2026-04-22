import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'kc-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _theme = signal<Theme>(this.readInitial());
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this._theme.set(theme);
    if (!this.isBrowser) return;
    const html = this.document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore — private mode etc.
    }
  }

  private readInitial(): Theme {
    if (!this.isBrowser) return 'dark';
    try {
      const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore
    }
    const prefersLight = this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }
}
