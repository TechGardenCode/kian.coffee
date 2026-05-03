import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
} from "@angular/core";
import {
  createScrollSpy,
  type ScrollSpyHandle,
} from "../../core/behaviors/scroll-spy";

@Directive({
  selector: "[kcScrollSpy]",
  standalone: true,
})
export class ScrollSpyDirective implements OnInit {
  readonly kcScrollSpy = input.required<readonly string[]>();
  readonly activeClass = input<string>("kc-active");
  readonly rootMargin = input<string | undefined>(undefined);

  readonly activeIdChange = output<string | null>();

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private handle: ScrollSpyHandle | null = null;

  ngOnInit(): void {
    this.handle = createScrollSpy({
      ids: this.kcScrollSpy(),
      rootMargin: this.rootMargin(),
    });
    const unsubscribe = this.handle.subscribe((id) => {
      this.applyActiveClass(id);
      this.activeIdChange.emit(id);
    });
    this.applyActiveClass(this.handle.active());

    this.destroyRef.onDestroy(() => {
      unsubscribe();
      this.handle?.destroy();
      this.handle = null;
    });
  }

  private applyActiveClass(activeId: string | null): void {
    const cls = this.activeClass();
    const root = this.host.nativeElement;
    const links = root.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    links.forEach((a) => {
      const id = a.getAttribute("href")?.slice(1) ?? "";
      a.classList.toggle(cls, id === activeId);
    });
  }
}
