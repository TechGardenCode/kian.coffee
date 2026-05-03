import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "kc-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: "kc-page" },
})
export class KcPage {}
