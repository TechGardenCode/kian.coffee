import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  createSliderBubble,
  type SliderBubbleHandle,
} from "../../core/behaviors/slider-bubble";

@Component({
  selector: "kc-slider",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="kc-slider-wrap"
      [class.kc-slider-wrap--bubble]="showBubble()"
    >
      <input
        #native
        class="kc-slider"
        type="range"
        [attr.id]="id()"
        [attr.name]="name()"
        [attr.min]="min()"
        [attr.max]="max()"
        [attr.step]="step()"
        [attr.aria-valuetext]="valueText()"
        [disabled]="isDisabled()"
        [value]="value()"
        (input)="onSliderInput($event)"
        (blur)="onTouched()"
      />
      @if (showBubble()) {
        <output #bubble class="kc-slider__bubble" aria-hidden="true">
          {{ bubbleText() }}
        </output>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly disabled = input(false);
  readonly showBubble = input(false);
  /** Optional formatter that maps the current numeric value to an
   *  aria-valuetext string (e.g., currency, units). */
  readonly format = input<((v: number) => string) | undefined>(undefined);

  protected readonly cvaDisabled = signal(false);
  protected readonly value = signal<number>(0);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );

  protected readonly valueText = computed(() => {
    const fmt = this.format();
    return fmt ? fmt(this.value()) : null;
  });

  protected readonly bubbleText = computed(() => {
    const fmt = this.format();
    return fmt ? fmt(this.value()) : String(this.value());
  });

  private readonly nativeRef = viewChild<ElementRef<HTMLInputElement>>("native");
  private readonly bubbleRef = viewChild<ElementRef<HTMLElement>>("bubble");
  private readonly destroyRef = inject(DestroyRef);
  private bubbleHandle: SliderBubbleHandle | null = null;

  private onChange: (v: number) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    // Manage bubble lifecycle whenever showBubble or view refs change.
    effect(() => {
      const wantBubble = this.showBubble();
      const input = this.nativeRef()?.nativeElement;
      const bubble = this.bubbleRef()?.nativeElement;
      if (!wantBubble || !input || !bubble) {
        this.bubbleHandle?.destroy();
        this.bubbleHandle = null;
        return;
      }
      if (this.bubbleHandle) return;
      this.bubbleHandle = createSliderBubble({
        input,
        bubble,
        format: this.format(),
      });
    });

    // Refresh bubble whenever value changes via writeValue / input.
    effect(() => {
      this.value();
      this.bubbleHandle?.update();
    });

    this.destroyRef.onDestroy(() => {
      this.bubbleHandle?.destroy();
      this.bubbleHandle = null;
    });
  }

  protected onSliderInput(ev: Event) {
    const v = Number((ev.target as HTMLInputElement).value);
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: number | null): void {
    this.value.set(typeof v === "number" ? v : 0);
  }
  registerOnChange(fn: (v: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(state: boolean): void {
    this.cvaDisabled.set(state);
  }
}
