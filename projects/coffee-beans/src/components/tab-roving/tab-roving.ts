import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from "@angular/core";
import {
  createRovingTabindex,
  type RovingHandle,
  type RovingOrientation,
} from "../../core/behaviors/tab-roving";

@Directive({
  selector: "[kcTabRoving]",
  standalone: true,
})
export class TabRovingDirective implements AfterViewInit {
  readonly orientation = input<RovingOrientation>("horizontal");
  readonly wrap = input<boolean>(true);
  readonly selector = input<string | undefined>(undefined);

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private handle: RovingHandle | null = null;

  ngAfterViewInit(): void {
    this.handle = createRovingTabindex(this.host.nativeElement, {
      orientation: this.orientation(),
      wrap: this.wrap(),
      selector: this.selector(),
    });
    this.destroyRef.onDestroy(() => {
      this.handle?.destroy();
      this.handle = null;
    });
  }
}
