import { ChangeDetectionStrategy, Component, booleanAttribute, input } from "@angular/core";

@Component({
  selector: "kc-page-hero",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: "kc-page__hero",
    "[class.kc-page__hero--tall]": "tall()",
  },
})
export class KcPageHero {
  readonly tall = input(false, { transform: booleanAttribute });
}
