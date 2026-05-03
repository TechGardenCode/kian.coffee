import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "kc-field",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kc-field">
      @if (label()) {
        <label class="kc-field__label" [attr.for]="for()">{{ label() }}</label>
      }
      <ng-content />
      @if (error()) {
        <p class="kc-field__error">{{ error() }}</p>
      } @else if (help()) {
        <p class="kc-field__help">{{ help() }}</p>
      }
    </div>
  `,
})
export class FieldComponent {
  readonly label = input<string | undefined>(undefined);
  readonly help = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly for = input<string | undefined>(undefined);
}
