import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { defineVariants } from "../../core/variants";

export type InputSize = "sm" | "md" | "lg";
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url";

const inputClasses = defineVariants({
  base: "kc-input",
  variants: {
    size: { sm: "kc-input--sm", md: "", lg: "kc-input--lg" },
    invalid: { true: "kc-input--invalid", false: "" },
  },
  defaultVariants: { size: "md", invalid: "false" },
});

@Component({
  selector: "kc-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      [class]="classes()"
      [attr.type]="type()"
      [attr.placeholder]="placeholder()"
      [attr.id]="id()"
      [attr.name]="name()"
      [attr.autocomplete]="autocomplete()"
      [attr.inputmode]="inputmode()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  readonly type = input<InputType>("text");
  readonly placeholder = input<string | undefined>(undefined);
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly inputmode = input<string | undefined>(undefined);
  readonly size = input<InputSize>("md");
  readonly invalid = input(false);
  readonly disabled = input(false);

  protected readonly cvaDisabled = signal(false);
  protected readonly value = signal<string>("");

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );
  protected readonly classes = computed(() =>
    inputClasses({
      size: this.size(),
      invalid: this.invalid() ? "true" : "false",
    }),
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? "");
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(state: boolean): void {
    this.cvaDisabled.set(state);
  }
}
