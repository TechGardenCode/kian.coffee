import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "kc-switch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="kc-switch">
      <input
        type="checkbox"
        role="switch"
        [attr.id]="id()"
        [attr.name]="name()"
        [attr.aria-checked]="checked()"
        [disabled]="isDisabled()"
        [checked]="checked()"
        (change)="onSwitchChange($event)"
        (blur)="onTouched()"
      />
      <span class="track"></span>
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
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input(false);

  protected readonly cvaDisabled = signal(false);
  protected readonly checked = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onSwitchChange(ev: Event) {
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
