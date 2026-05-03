import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from "@angular/core";

@Component({
  selector: "kc-page-section",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasHead()) {
      <div [class]="headClass()">
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
    "[class.kc-page__section--rule]": "rule()",
    "[id]": "anchor() || null",
  },
})
export class KcPageSection {
  readonly anchor = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly kicker = input<string | null>(null);
  readonly hasHead = input(true, { transform: booleanAttribute });
  readonly headRule = input(false, { transform: booleanAttribute });
  readonly rule = input(false, { transform: booleanAttribute });

  readonly headClass = computed(() =>
    this.headRule()
      ? "kc-page__section-head kc-page__section-head--rule"
      : "kc-page__section-head",
  );
}
