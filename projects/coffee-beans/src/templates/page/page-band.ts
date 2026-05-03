import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

export type KcPageBandVariant = "plain" | "metric";

@Component({
  selector: "kc-page-band",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kc-page__band-inner">
      <ng-content />
    </div>
  `,
  host: {
    class: "kc-page__band",
    "[class.kc-page__band--metric]": "isMetric()",
  },
})
export class KcPageBand {
  readonly variant = input<KcPageBandVariant>("plain");

  readonly isMetric = computed(() => this.variant() === "metric");
}
