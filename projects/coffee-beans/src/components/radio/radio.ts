import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

let nextGroupId = 0;

@Component({
  selector: "kc-radio-group",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="layoutClass()"
      role="radiogroup"
      [attr.aria-invalid]="invalid() ? 'true' : null"
    >
      @for (opt of options(); track opt.value) {
        <label class="kc-radio">
          <input
            type="radio"
            [attr.name]="resolvedName()"
            [value]="opt.value"
            [checked]="opt.value === value()"
            [disabled]="isDisabled() || !!opt.disabled"
            (change)="onRadioChange(opt.value)"
            (blur)="onTouched()"
          />
          <span class="dot"></span>
          <span>{{ opt.label }}</span>
        </label>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly name = input<string | undefined>(undefined);
  readonly options = input.required<readonly RadioOption[]>();
  readonly orientation = input<"vertical" | "horizontal">("vertical");
  readonly invalid = input(false);
  readonly disabled = input(false);

  private readonly autoName = `kc-radio-group-${++nextGroupId}`;

  protected readonly cvaDisabled = signal(false);
  protected readonly value = signal<string | null>(null);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );
  protected readonly resolvedName = computed(() => this.name() ?? this.autoName);
  protected readonly layoutClass = computed(() =>
    this.orientation() === "horizontal"
      ? "kc-radio-group kc-radio-group--horizontal"
      : "kc-radio-group",
  );

  private onChange: (v: string | null) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onRadioChange(v: string) {
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? null);
  }
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(state: boolean): void {
    this.cvaDisabled.set(state);
  }
}
