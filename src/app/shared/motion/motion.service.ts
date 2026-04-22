import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

type RevealCallback = () => void;

@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private observer: IntersectionObserver | null = null;
  private readonly callbacks = new WeakMap<Element, RevealCallback>();

  readonly prefersReducedMotion = this.isBrowser
    ? this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false
    : false;

  observe(el: Element, onReveal: RevealCallback): void {
    if (!this.isBrowser) {
      onReveal();
      return;
    }
    if (this.prefersReducedMotion) {
      onReveal();
      return;
    }
    this.callbacks.set(el, onReveal);
    this.getObserver().observe(el);
  }

  unobserve(el: Element): void {
    if (!this.isBrowser || !this.observer) return;
    this.observer.unobserve(el);
    this.callbacks.delete(el);
  }

  private getObserver(): IntersectionObserver {
    if (this.observer) return this.observer;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cb = this.callbacks.get(entry.target);
          if (cb) cb();
          this.observer?.unobserve(entry.target);
          this.callbacks.delete(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' }
    );
    return this.observer;
  }
}
