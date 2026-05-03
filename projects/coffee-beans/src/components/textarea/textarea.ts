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

export type TextareaSize = "sm" | "md" | "lg";

const textareaClasses = defineVariants({
  base: "kc-textarea",
  variants: {
    size: { sm: "kc-textarea--sm", md: "", lg: "kc-textarea--lg" },
    invalid: { true: "kc-textarea--invalid", false: "" },
  },
  defaultVariants: { size: "md", invalid: "false" },
});

@Component({
  selector: "kc-textarea",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <textarea
      [class]="classes()"
      [attr.placeholder]="placeholder()"
      [attr.id]="id()"
      [attr.name]="name()"
      [attr.rows]="rows()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    ></textarea>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  readonly placeholder = input<string | undefined>(undefined);
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly rows = input<number>(4);
  readonly size = input<TextareaSize>("md");
  readonly invalid = input(false);
  readonly disabled = input(false);

  protected readonly cvaDisabled = signal(false);
  protected readonly value = signal<string>("");

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );
  protected readonly classes = computed(() =>
    textareaClasses({
      size: this.size(),
      invalid: this.invalid() ? "true" : "false",
    }),
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(ev: Event) {
    const v = (ev.target as HTMLTextAreaElement).value;
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
