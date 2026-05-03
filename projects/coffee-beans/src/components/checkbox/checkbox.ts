import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "kc-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="kc-checkbox" [class.kc-checkbox--invalid]="invalid()">
      <input
        #native
        type="checkbox"
        [attr.id]="id()"
        [attr.name]="name()"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        [disabled]="isDisabled()"
        [checked]="checked()"
        (change)="onCheckboxChange($event)"
        (blur)="onTouched()"
      />
      <span class="box"></span>
      @if (label()) {
        <span>{{ label() }}</span>
      } @else {
        <ng-content />
      }
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly indeterminate = input(false);
  readonly invalid = input(false);
  readonly disabled = input(false);

  protected readonly cvaDisabled = signal(false);
  protected readonly checked = signal(false);
  protected readonly native =
    viewChild.required<ElementRef<HTMLInputElement>>("native");

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );

  constructor() {
    effect(() => {
      const el = this.native().nativeElement;
      el.indeterminate = this.indeterminate();
    });
  }

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onCheckboxChange(ev: Event) {
    const v = (ev.target as HTMLInputElement).checked;
    this.checked.set(v);
    this.onChange(v);
  }

  writeValue(v: boolean | null): void {
    this.checked.set(!!v);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(state: boolean): void {
    this.cvaDisabled.set(state);
  }
}
