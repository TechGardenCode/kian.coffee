import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "kc-label",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="kc-label" [attr.for]="for()">
      <ng-content />
    </label>
  `,
})
export class LabelComponent {
  readonly for = input<string | undefined>(undefined);
}
