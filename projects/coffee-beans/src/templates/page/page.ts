import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

export type KcPageMaxWidth = "sm" | "md" | "lg";

@Component({
  selector: "kc-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: "kc-page",
    "[class.kc-page--max-w-sm]": "isSm()",
    "[class.kc-page--max-w-md]": "isMd()",
    "[class.kc-page--max-w-lg]": "isLg()",
  },
})
export class KcPage {
  readonly maxWidth = input<KcPageMaxWidth | null>(null);

  readonly isSm = computed(() => this.maxWidth() === "sm");
  readonly isMd = computed(() => this.maxWidth() === "md");
  readonly isLg = computed(() => this.maxWidth() === "lg");
}
