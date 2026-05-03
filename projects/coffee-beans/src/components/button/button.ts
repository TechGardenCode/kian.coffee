import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { defineVariants } from "../../core/variants";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonType = "button" | "submit" | "reset";

const buttonClasses = defineVariants({
  base: "kc-btn",
  variants: {
    variant: {
      primary: "kc-btn--primary",
      secondary: "kc-btn--secondary",
      ghost: "kc-btn--ghost",
    },
    size: {
      sm: "kc-btn--sm",
      md: "",
      lg: "kc-btn--lg",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

@Component({
  selector: "kc-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="classes()"
      [attr.type]="type()"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>("primary");
  readonly size = input<ButtonSize>("md");
  readonly type = input<ButtonType>("button");
  readonly disabled = input(false);

  readonly classes = computed(() =>
    buttonClasses({ variant: this.variant(), size: this.size() }),
  );
}
