import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import {
  CopyButtonComponent,
  TabRovingDirective,
  TooltipDirective,
  type CopyResult,
} from '@kian.coffee/beans';

@Component({
  selector: 'app-beans-behaviors',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CopyButtonComponent, TabRovingDirective, TooltipDirective],
  template: `
    <p class="mb-6 max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
      Behaviors are the interaction primitives — small directives that
      add framework-agnostic UX patterns on top of plain elements. The
      page itself demos two of them passively: the header's mode
      toggle, and this page's left-rail scroll-spy.
    </p>

    <div class="flex flex-col gap-6">
      <!-- Mode toggle -->
      <article class="flex flex-col gap-1 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Mode toggle</h3>
        <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
          Light / dark switching, persisted to <code class="font-mono text-xs">localStorage</code>.
          The header (top right) is the canonical site instance — flip
          it and watch every specimen on this page swap.
        </p>
      </article>

      <!-- Scroll spy -->
      <article class="flex flex-col gap-1 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Scroll spy</h3>
        <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
          <code class="font-mono text-xs">IntersectionObserver</code>-driven "which section is
          in view." The left nav rail on this page is wired to it —
          scroll up and down and watch the active link follow.
        </p>
      </article>

      <!-- Tab roving -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Tab roving</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Roving tabindex for tablists and toolbars. Tab into the
            group below, then use the arrow keys: focus moves between
            items without leaving the group. <kbd class="rounded border border-ink-900/20 bg-cream-100 px-1 font-mono text-xs dark:border-foam/20 dark:bg-roast-900">Home</kbd> /
            <kbd class="rounded border border-ink-900/20 bg-cream-100 px-1 font-mono text-xs dark:border-foam/20 dark:bg-roast-900">End</kbd> jump to the ends.
          </p>
        </header>
        <div
          kcTabRoving
          role="tablist"
          aria-label="Roast strength"
          class="inline-flex w-fit gap-1 rounded-full border border-ink-900/20 bg-cream-100 p-1 dark:border-foam/20 dark:bg-roast-900"
        >
          <button type="button" role="tab" tabindex="0" class="cursor-pointer rounded-full border-0 bg-accent/10 px-4 py-2 font-sans text-sm font-medium text-accent">Light</button>
          <button type="button" role="tab" tabindex="-1" class="cursor-pointer rounded-full border-0 bg-transparent px-4 py-2 font-sans text-sm font-medium text-ink-700 dark:text-taupe">Medium</button>
          <button type="button" role="tab" tabindex="-1" class="cursor-pointer rounded-full border-0 bg-transparent px-4 py-2 font-sans text-sm font-medium text-ink-700 dark:text-taupe">Dark</button>
        </div>
      </article>

      <!-- Tooltip -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Tooltip</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Hover or focus an element to surface a short label.
            Viewport-aware: the tooltip flips side automatically when
            it would clip the edge.
          </p>
        </header>
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" [kcTooltip]="'Top placement (default)'"
            class="cursor-pointer rounded border border-ink-900/20 bg-cream-100 px-4 py-2 text-ink-900 dark:border-foam/20 dark:bg-roast-900 dark:text-foam">Top</button>
          <button type="button" [kcTooltip]="'Right placement'" kcTooltipSide="right"
            class="cursor-pointer rounded border border-ink-900/20 bg-cream-100 px-4 py-2 text-ink-900 dark:border-foam/20 dark:bg-roast-900 dark:text-foam">Right</button>
          <button type="button" [kcTooltip]="'Bottom placement'" kcTooltipSide="bottom"
            class="cursor-pointer rounded border border-ink-900/20 bg-cream-100 px-4 py-2 text-ink-900 dark:border-foam/20 dark:bg-roast-900 dark:text-foam">Bottom</button>
          <button type="button" [kcTooltip]="'Left placement'" kcTooltipSide="left"
            class="cursor-pointer rounded border border-ink-900/20 bg-cream-100 px-4 py-2 text-ink-900 dark:border-foam/20 dark:bg-roast-900 dark:text-foam">Left</button>
        </div>
      </article>

      <!-- Copy to clipboard -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Copy to clipboard</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Single-button copy with confirmed-state feedback. Falls
            back through <code class="font-mono text-xs">execCommand</code> when the modern
            clipboard API is unavailable.
          </p>
        </header>
        <div class="flex flex-wrap items-center gap-3">
          <code class="rounded bg-cream-200 px-3 py-2 font-mono text-sm text-ink-900 dark:bg-roast-950 dark:text-foam">
            --space-6: 32px
          </code>
          <kc-copy-button text="--space-6: 32px" (copied)="onCopy($event)" />
          @if (lastCopy(); as result) {
            <span class="label text-ink-500 dark:text-taupe-dim">{{ result.ok ? 'Copied via ' + result.method : 'Failed' }}</span>
          }
        </div>
      </article>
    </div>
  `,
})
export class BeansBehaviorsComponent {
  readonly audit = input(false);
  readonly lastCopy = signal<CopyResult | null>(null);

  onCopy(result: CopyResult): void {
    this.lastCopy.set(result);
  }
}
