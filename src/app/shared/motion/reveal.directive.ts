import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { MotionService } from './motion.service';

@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[attr.data-reveal]': '""',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly motion = inject(MotionService);

  ngOnInit(): void {
    const el = this.host.nativeElement;
    this.motion.observe(el, () => el.classList.add('is-visible'));
  }

  ngOnDestroy(): void {
    this.motion.unobserve(this.host.nativeElement);
  }
}
