import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import {
  copyText,
  type CopyResult,
} from "../../core/behaviors/copy-to-clipboard";

@Component({
  selector: "kc-copy-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="kc-btn kc-btn--ghost kc-btn--sm"
      [attr.aria-label]="ariaLabel()"
      (click)="onClick()"
    >
      <span aria-live="polite">{{ label() }}</span>
    </button>
  `,
})
export class CopyButtonComponent {
  readonly text = input.required<string>();
  readonly defaultLabel = input<string>("Copy");
  readonly confirmedLabel = input<string>("Copied");
  readonly confirmDuration = input<number>(1200);

  readonly copied = output<CopyResult>();

  protected readonly confirmed = signal(false);
  protected readonly label = computed(() =>
    this.confirmed() ? this.confirmedLabel() : this.defaultLabel(),
  );
  protected readonly ariaLabel = computed(() => `${this.defaultLabel()} to clipboard`);

  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timer !== null) clearTimeout(this.timer);
    });
  }

  protected async onClick(): Promise<void> {
    const result = await copyText(this.text());
    this.copied.emit(result);
    if (!result.ok) return;
    this.confirmed.set(true);
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.confirmed.set(false);
      this.timer = null;
    }, this.confirmDuration());
  }
}
