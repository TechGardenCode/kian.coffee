import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  KcPageMarketing,
  KcPageHero,
  KcPageSection,
  KcPageBand,
  KcPageFooterCta,
} from '@kian.coffee/beans';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { MotionService } from '../../shared/motion/motion.service';
import { SeoService } from '../../shared/seo/seo.service';
import { personJsonLd } from '../../shared/seo/json-ld';
import { MetricComponent } from '../../shared/ui/metric.component';
import { CaseCardComponent } from '../../shared/ui/case-card.component';
import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RevealDirective,
    MetricComponent,
    CaseCardComponent,
    ChipComponent,
    LinkArrowComponent,
    EyebrowComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
    KcPageBand,
    KcPageFooterCta,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly motion = inject(MotionService);
  private readonly seo = inject(SeoService);

  @ViewChild('hero', { static: true }) hero!: ElementRef<HTMLElement>;

  private rafId = 0;
  private lastMove: { x: number; y: number } | null = null;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Home',
      description:
        'Kian Alikhani — full-stack IC architect at Mastercard. Homelab, side projects, and current work.',
      path: '/',
      ogType: 'profile',
      jsonLd: personJsonLd(),
    });
    if (!this.isBrowser || this.motion.prefersReducedMotion) return;
    this.ngZone.runOutsideAngular(() => {
      const el = this.hero.nativeElement;
      el.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
      el.addEventListener('pointermove', this.onPointerMove, { passive: true });
      el.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    const el = this.hero?.nativeElement;
    if (!el) return;
    el.removeEventListener('pointerenter', this.onPointerEnter);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerleave', this.onPointerLeave);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private readonly onPointerEnter = (ev: PointerEvent): void => {
    if (ev.pointerType === 'touch') return;
    const el = this.hero.nativeElement;
    const rect = el.getBoundingClientRect();
    // Seed the position at the entry point so the fade-in starts where the cursor is.
    this.applyPosition(ev.clientX - rect.left, ev.clientY - rect.top);
    el.setAttribute('data-active', 'true');
  };

  private readonly onPointerMove = (ev: PointerEvent): void => {
    if (ev.pointerType === 'touch') return;
    const el = this.hero.nativeElement;
    const rect = el.getBoundingClientRect();
    this.lastMove = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top,
    };
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(this.flushMove);
  };

  private readonly flushMove = (): void => {
    this.rafId = 0;
    if (!this.lastMove) return;
    this.applyPosition(this.lastMove.x, this.lastMove.y);
  };

  private readonly onPointerLeave = (): void => {
    // Clear the active flag so opacity fades out. Intentionally do NOT reset
    // --mx/--my — the position stays frozen under the fading glow so there's
    // no "snap" at the start of the fade.
    this.hero.nativeElement.removeAttribute('data-active');
  };

  private applyPosition(x: number, y: number): void {
    const el = this.hero.nativeElement;
    el.style.setProperty('--mx', `${x.toFixed(1)}px`);
    el.style.setProperty('--my', `${y.toFixed(1)}px`);
  }
}
