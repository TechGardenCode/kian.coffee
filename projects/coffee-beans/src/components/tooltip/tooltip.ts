import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from "@angular/core";
import {
  positionTooltip,
  type TooltipSide,
} from "../../core/behaviors/tooltip-position";

@Directive({
  selector: "[kcTooltip]",
  standalone: true,
})
export class TooltipDirective {
  readonly kcTooltip = input.required<string>();
  readonly kcTooltipSide = input<TooltipSide>("top");

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private el: HTMLDivElement | null = null;
  private rafId: number | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.hide());
  }

  @HostListener("mouseenter") onEnter(): void { this.show(); }
  @HostListener("focusin") onFocus(): void { this.show(); }
  @HostListener("mouseleave") onLeave(): void { this.hide(); }
  @HostListener("focusout") onBlur(): void { this.hide(); }

  @HostListener("window:scroll")
  @HostListener("window:resize")
  onReposition(): void {
    if (this.el) this.scheduleReposition();
  }

  private show(): void {
    if (this.el || typeof document === "undefined") return;
    const tip = document.createElement("div");
    tip.className = `kc-tooltip kc-tooltip--${this.kcTooltipSide()}`;
    tip.setAttribute("role", "tooltip");
    tip.textContent = this.kcTooltip();
    document.body.appendChild(tip);
    this.el = tip;
    this.scheduleReposition();
    requestAnimationFrame(() => {
      if (this.el) this.el.classList.add("kc-tooltip--open");
    });
  }

  private hide(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (!this.el) return;
    this.el.remove();
    this.el = null;
  }

  private scheduleReposition(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.applyPosition();
    });
  }

  private applyPosition(): void {
    if (!this.el) return;
    const result = positionTooltip({
      anchor: this.host.nativeElement,
      tooltip: this.el,
      side: this.kcTooltipSide(),
    });
    this.el.className = `kc-tooltip kc-tooltip--${result.side} kc-tooltip--open`;
    this.el.style.left = `${result.x}px`;
    this.el.style.top = `${result.y}px`;
  }
}
