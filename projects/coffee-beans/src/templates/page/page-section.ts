import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "kc-page-section",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasHead()) {
      <div class="kc-page__section-head">
        <div class="kc-page__section-head-main">
          <ng-content select="[slot=eyebrow]" />
          @if (title(); as t) {
            <h2 class="kc-page__section-title">{{ t }}</h2>
          }
          <ng-content select="[slot=title]" />
        </div>
        @if (kicker(); as k) {
          <span class="kc-page__section-kicker">{{ k }}</span>
        }
        <ng-content select="[slot=kicker]" />
      </div>
    }
    <div class="kc-page__section-body">
      <ng-content />
    </div>
  `,
  host: {
    class: "kc-page__section",
    "[id]": "anchor() || null",
  },
})
export class KcPageSection {
  readonly anchor = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly kicker = input<string | null>(null);
  readonly hasHead = input(true);
}
