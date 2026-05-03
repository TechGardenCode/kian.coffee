import {
  ChangeDetectionStrategy,
  DestroyRef,
  Directive,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import {
  applyMode,
  initMode,
  type Mode,
  readMode,
  subscribeMode,
} from "../../core/behaviors/mode-toggle";

@Directive({
  selector: "[kcModeToggle]",
  standalone: true,
  host: {
    "[attr.aria-pressed]": "isActive()",
    "[attr.type]": "'button'",
  },
})
export class ModeToggleDirective implements OnInit {
  readonly kcModeToggle = input.required<Mode>();

  protected readonly current = signal<Mode>("dark");
  protected readonly isActive = () => this.current() === this.kcModeToggle();

  private readonly destroyRef = inject(DestroyRef);

  @HostListener("click")
  onClick(): void {
    applyMode(this.kcModeToggle());
  }

  ngOnInit(): void {
    this.current.set(initMode());
    const unsubscribe = subscribeMode((m) => this.current.set(m));
    this.destroyRef.onDestroy(unsubscribe);
    // Keep in sync in case another instance applied a mode before us.
    this.current.set(readMode());
  }
}
