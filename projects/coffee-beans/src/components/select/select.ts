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

export type SelectSize = "sm" | "md" | "lg";

const selectClasses = defineVariants({
  base: "kc-select",
  variants: {
    size: { sm: "kc-select--sm", md: "", lg: "kc-select--lg" },
    invalid: { true: "kc-select--invalid", false: "" },
  },
  defaultVariants: { size: "md", invalid: "false" },
});

@Component({
  selector: "kc-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      [class]="classes()"
      [attr.id]="id()"
      [attr.name]="name()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [value]="value()"
      (change)="onSelectChange($event)"
      (blur)="onTouched()"
    >
      <ng-content />
    </select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly size = input<SelectSize>("md");
  readonly invalid = input(false);
  readonly disabled = input(false);

  protected readonly cvaDisabled = signal(false);
  protected readonly value = signal<string>("");

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );
  protected readonly classes = computed(() =>
    selectClasses({
      size: this.size(),
      invalid: this.invalid() ? "true" : "false",
    }),
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onSelectChange(ev: Event) {
    const v = (ev.target as HTMLSelectElement).value;
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
