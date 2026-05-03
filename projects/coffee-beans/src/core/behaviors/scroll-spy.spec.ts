import { createScrollSpy } from './scroll-spy';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

interface FakeObserverState {
  readonly callback: IOCallback;
  readonly observed: Set<HTMLElement>;
}

function installFakeIntersectionObserver(): {
  state: FakeObserverState;
  restore: () => void;
} {
  const state: FakeObserverState = {
    callback: (() => {}) as IOCallback,
    observed: new Set<HTMLElement>(),
  };
  let cb: IOCallback = () => {};
  const original = (globalThis as { IntersectionObserver: typeof IntersectionObserver })
    .IntersectionObserver;

  class FakeIO {
    constructor(callback: IOCallback) {
      cb = callback;
      Object.defineProperty(state, 'callback', { value: callback, writable: false, configurable: true });
    }
    observe(el: Element) { state.observed.add(el as HTMLElement); }
    unobserve(el: Element) { state.observed.delete(el as HTMLElement); }
    disconnect() { state.observed.clear(); }
    takeRecords(): IntersectionObserverEntry[] { return []; }
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
  }

  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIO;
  void cb;
  return {
    state,
    restore: () => {
      (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = original;
    },
  };
}

function entry(el: HTMLElement, isIntersecting: boolean, top: number): IntersectionObserverEntry {
  return {
    target: el,
    isIntersecting,
    intersectionRatio: isIntersecting ? 1 : 0,
    boundingClientRect: { top } as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  } as IntersectionObserverEntry;
}

describe('createScrollSpy', () => {
  let host: HTMLElement;
  let io: ReturnType<typeof installFakeIntersectionObserver>;

  beforeEach(() => {
    io = installFakeIntersectionObserver();
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    document.body.removeChild(host);
    io.restore();
  });

  it('returns null when no tracked element exists', () => {
    const spy = createScrollSpy({ ids: ['missing'] });
    expect(spy.active()).toBeNull();
    spy.destroy();
  });

  it('picks the largest-top intersecting candidate among siblings', () => {
    host.innerHTML = `
      <section id="a"></section>
      <section id="b"></section>
      <section id="c"></section>
    `;
    const spy = createScrollSpy({ ids: ['a', 'b', 'c'] });

    const a = host.querySelector('#a') as HTMLElement;
    const b = host.querySelector('#b') as HTMLElement;
    const c = host.querySelector('#c') as HTMLElement;

    io.state.callback([
      entry(a, true, -200),
      entry(b, true, -50),
      entry(c, true, 100),
    ]);

    expect(spy.active()).toBe('c');
    spy.destroy();
  });

  it('excludes a tracked parent when it contains another tracked element (parent-blip fix)', () => {
    host.innerHTML = `
      <section id="parent">
        <section id="child-1"></section>
        <section id="child-2"></section>
      </section>
    `;
    const spy = createScrollSpy({ ids: ['parent', 'child-1', 'child-2'] });

    const parent = host.querySelector('#parent') as HTMLElement;
    const c1 = host.querySelector('#child-1') as HTMLElement;
    const c2 = host.querySelector('#child-2') as HTMLElement;

    io.state.callback([
      entry(parent, true, -300),
      entry(c1, true, -50),
    ]);
    expect(spy.active()).toBe('child-1');

    // Gap: child-1 scrolls past, child-2 not yet visible, only parent intersects.
    io.state.callback([
      entry(c1, false, 0),
      entry(parent, true, -350),
    ]);
    expect(spy.active())
      .withContext('parent must NOT win the gap between siblings')
      .toBeNull();

    io.state.callback([entry(c2, true, 50)]);
    expect(spy.active()).toBe('child-2');

    spy.destroy();
  });

  it('notifies subscribers on active-id transitions', () => {
    host.innerHTML = `<section id="a"></section><section id="b"></section>`;
    const spy = createScrollSpy({ ids: ['a', 'b'] });
    const seen: Array<string | null> = [];
    spy.subscribe((id) => seen.push(id));

    const a = host.querySelector('#a') as HTMLElement;
    const b = host.querySelector('#b') as HTMLElement;

    io.state.callback([entry(a, true, -50)]);
    io.state.callback([entry(b, true, 80)]);
    io.state.callback([entry(a, false, 0), entry(b, false, 0)]);

    expect(seen).toEqual(['a', 'b', null]);
    spy.destroy();
  });
});
