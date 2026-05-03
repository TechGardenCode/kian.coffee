import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

export type KcPageMaxWidth = "sm" | "md" | "lg";

@Component({
  selector: "kc-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    "[class]": "hostClass()",
  },
})
export class KcPage {
  readonly maxWidth = input<KcPageMaxWidth | null>(null);

  readonly hostClass = computed(() => {
    const mw = this.maxWidth();
    return mw ? `kc-page kc-page--max-w-${mw}` : "kc-page";
  });
}
