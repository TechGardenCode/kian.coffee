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
    "[class]": "hostClass()",
  },
})
export class KcPageBand {
  readonly variant = input<KcPageBandVariant>("plain");

  readonly hostClass = computed(() => {
    const v = this.variant();
    return v === "plain" ? "kc-page__band" : `kc-page__band kc-page__band--${v}`;
  });
}
