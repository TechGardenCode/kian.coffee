/* =====================================================================
   tab-roving — roving-tabindex keyboard manager for a list of focusable
   elements. WAI-ARIA APG tabs pattern: focus follows arrow keys; activation
   on focus is left to the consumer. Framework-agnostic; no @angular imports.

   Side effects:
   - Mutates `tabindex` on every matched child of the container.
   - Adds keydown + focusin listeners on the container.
   - Caller MUST call destroy() to remove listeners and restore tabindex.
   ===================================================================== */

export type RovingOrientation = 'horizontal' | 'vertical';

export interface RovingOptions {
  readonly selector?: string;
  readonly orientation?: RovingOrientation;
  readonly wrap?: boolean;
}

export interface RovingHandle {
  readonly activeIndex: () => number;
  focusIndex(i: number): void;
  refresh(): void;
  destroy(): void;
}

const DEFAULT_SELECTOR = '[role="tab"]';

export function createRovingTabindex(
  container: HTMLElement,
  opts: RovingOptions = {},
): RovingHandle {
  const selector = opts.selector ?? DEFAULT_SELECTOR;
  const orientation: RovingOrientation = opts.orientation ?? 'horizontal';
  const wrap = opts.wrap ?? true;

  let items: HTMLElement[] = [];
  let active = 0;

  function scan() {
    items = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;
    const found = items.findIndex((el) => el.tabIndex === 0);
    active = found >= 0 ? found : 0;
    applyTabindex();
  }

  function applyTabindex() {
    items.forEach((el, i) => {
      el.tabIndex = i === active ? 0 : -1;
    });
  }

  function focusAt(i: number) {
    if (items.length === 0) return;
    let next = i;
    if (wrap) {
      next = (i + items.length) % items.length;
    } else {
      next = Math.max(0, Math.min(items.length - 1, i));
    }
    active = next;
    applyTabindex();
    items[active]?.focus();
  }

  function onKeydown(ev: KeyboardEvent) {
    if (items.length === 0) return;
    const target = ev.target as HTMLElement;
    const idx = items.indexOf(target);
    if (idx < 0) return;

    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    switch (ev.key) {
      case nextKey:
        ev.preventDefault();
        focusAt(idx + 1);
        break;
      case prevKey:
        ev.preventDefault();
        focusAt(idx - 1);
        break;
      case 'Home':
        ev.preventDefault();
        focusAt(0);
        break;
      case 'End':
        ev.preventDefault();
        focusAt(items.length - 1);
        break;
    }
  }

  function onFocusin(ev: FocusEvent) {
    const idx = items.indexOf(ev.target as HTMLElement);
    if (idx >= 0 && idx !== active) {
      active = idx;
      applyTabindex();
    }
  }

  scan();
  container.addEventListener('keydown', onKeydown);
  container.addEventListener('focusin', onFocusin);

  return {
    activeIndex: () => active,
    focusIndex: focusAt,
    refresh: scan,
    destroy() {
      container.removeEventListener('keydown', onKeydown);
      container.removeEventListener('focusin', onFocusin);
      for (const el of items) el.removeAttribute('tabindex');
    },
  };
}
