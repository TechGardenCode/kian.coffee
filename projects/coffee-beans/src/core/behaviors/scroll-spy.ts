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

  const excluded = findParentsOfTracked(elements);

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
      const next = pickActive(visible, opts.ids, excluded);
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
 * Tracked parents (ids whose DOM element contains another tracked
 * element) are excluded — they're treated as grouping labels, not
 * active candidates. This avoids the "parent blip" where a parent
 * intersects briefly between sibling children, since in the
 * remaining-candidates set the parent simply isn't in play.
 *
 * Among non-parent candidates, picks the LARGEST top (least-negative,
 * closest to / most recently crossed the active band from below) to
 * give responsive sibling-to-sibling switching as you scroll.
 */
function pickActive(
  visible: Map<string, number>,
  order: readonly string[],
  excluded: ReadonlySet<string>,
): string | null {
  if (visible.size === 0) return null;
  let best: { id: string; top: number } | null = null;
  for (const id of order) {
    if (excluded.has(id)) continue;
    const top = visible.get(id);
    if (top === undefined) continue;
    if (best === null || top > best.top) best = { id, top };
  }
  return best?.id ?? null;
}

/** Build the set of tracked ids whose DOM element contains at least
 *  one OTHER tracked element. These ids are grouping parents and are
 *  excluded from active-candidate selection. */
function findParentsOfTracked(elements: readonly HTMLElement[]): ReadonlySet<string> {
  const parents = new Set<string>();
  for (let i = 0; i < elements.length; i++) {
    const a = elements[i];
    for (let j = 0; j < elements.length; j++) {
      if (i === j) continue;
      if (a.contains(elements[j])) {
        parents.add(a.id);
        break;
      }
    }
  }
  return parents;
}

function inertHandle(): ScrollSpyHandle {
  return {
    active: () => null,
    subscribe: () => () => {},
    destroy: () => {},
  };
}
