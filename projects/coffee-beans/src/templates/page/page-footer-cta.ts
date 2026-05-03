import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "kc-page-footer-cta",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kc-page__footer-cta-prose">
      <ng-content select="[slot=prose]" />
    </div>
    <div class="kc-page__footer-cta-arrows">
      <ng-content select="[slot=arrows]" />
    </div>
    <ng-content />
  `,
  host: {
    class: "kc-page__footer-cta",
  },
})
export class KcPageFooterCta {}
