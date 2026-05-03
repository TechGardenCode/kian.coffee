import { ChangeDetectionStrategy, Component, booleanAttribute, input } from "@angular/core";

@Component({
  selector: "kc-page-hero",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    "[class]": "narrow() ? 'kc-page__hero kc-page__hero--narrow' : 'kc-page__hero'",
  },
})
export class KcPageHero {
  readonly narrow = input(false, { transform: booleanAttribute });
}
