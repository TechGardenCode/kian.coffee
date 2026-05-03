/* =====================================================================
   scroll-spy — IntersectionObserver-based "which section is in view"
   tracker. Framework-agnostic; no @angular imports.

   Side effects:
   - createScrollSpy() opens an IntersectionObserver. Caller MUST call
     handle.destroy() to release it.
   - Subscriber callbacks fire on the next animation frame after the
     observed elements update.
   ===================================================================== */

export interface ScrollSpyOptions {
  readonly ids: readonly string[];
  /** IntersectionObserver root margin. Default biases active region to
   *  the upper-middle of the viewport. */
  readonly rootMargin?: string;
  readonly threshold?: number | readonly number[];
  readonly root?: Element | null;
}

export interface ScrollSpyHandle {
  readonly active: () => string | null;
  subscribe(cb: (id: string | null) => void): () => void;
  destroy(): void;
}

const DEFAULT_ROOT_MARGIN = '-40% 0px -55% 0px';

export function createScrollSpy(opts: ScrollSpyOptions): ScrollSpyHandle {
  if (typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return inertHandle();
  }

  const elements = opts.ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (elements.length === 0) return inertHandle();

  const visible = new Map<string, number>();
  let activeId: string | null = null;
  const listeners = new Set<(id: string | null) => void>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) {
          visible.set(id, entry.boundingClientRect.top);
        } else {
          visible.delete(id);
        }
      }
      const next = pickActive(visible, opts.ids);
      if (next !== activeId) {
        activeId = next;
        for (const cb of listeners) cb(activeId);
      }
    },
    {
      rootMargin: opts.rootMargin ?? DEFAULT_ROOT_MARGIN,
      threshold: (opts.threshold ?? 0) as number | number[],
      root: opts.root ?? null,
    },
  );

  for (const el of elements) observer.observe(el);

  return {
    active: () => activeId,
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    destroy() {
      observer.disconnect();
      listeners.clear();
      visible.clear();
    },
  };
}

/**
 * Pick the most-specific intersecting section.
 *
 * When a child section is nested inside a parent section that's also
 * tracked, both will report as intersecting at the same time — the
 * parent's box spans the entire viewport while the child's box sits
 * inside it. The parent's `top` is much more negative (it started
 * scrolling above viewport long before the child did), so picking the
 * smallest top would always favor the parent and the child would
 * never light up.
 *
 * Picking the LARGEST top (least-negative, closest to / most recently
 * crossed the active band from below) selects the inner-most section
 * naturally. For sibling-only layouts this also gives more responsive
 * switching: as you scroll into the next section, its top crosses the
 * band sooner than the previous section's top exits.
 */
function pickActive(visible: Map<string, number>, order: readonly string[]): string | null {
  if (visible.size === 0) return null;
  let best: { id: string; top: number } | null = null;
  for (const id of order) {
    const top = visible.get(id);
    if (top === undefined) continue;
    if (best === null || top > best.top) best = { id, top };
  }
  return best?.id ?? null;
}

function inertHandle(): ScrollSpyHandle {
  return {
    active: () => null,
    subscribe: () => () => {},
    destroy: () => {},
  };
}
