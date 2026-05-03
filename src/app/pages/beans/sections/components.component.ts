import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  CheckboxComponent,
  FieldComponent,
  InputComponent,
  LabelComponent,
  RadioGroupComponent,
  SelectComponent,
  SliderComponent,
  SwitchComponent,
  TextareaComponent,
  type RadioOption,
} from '@kian.coffee/beans';

const ROAST_OPTIONS: readonly RadioOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'dark', label: 'Dark' },
];

@Component({
  selector: 'app-beans-components',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonComponent,
    LabelComponent,
    FieldComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxComponent,
    RadioGroupComponent,
    SwitchComponent,
    SliderComponent,
  ],
  template: `
    <p class="mb-6 max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
      Each component appears once, in its baseline form, with the
      variants and states it supports rendered alongside. Sizes,
      disabled, invalid, focus, and any per-component specialties
      (indeterminate, orientation, bubble) are shown together.
    </p>

    <div class="flex flex-col gap-6">

      <!-- Button -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Button</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            The primary action. Three variants, three sizes. Ghost is
            the quietest; primary is reserved for the page's main act.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Variants</span>
            <div class="flex flex-wrap gap-2">
              <kc-button variant="primary">Primary</kc-button>
              <kc-button variant="secondary">Secondary</kc-button>
              <kc-button variant="ghost">Ghost</kc-button>
            </div>
          </div>
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Sizes</span>
            <div class="flex flex-wrap items-center gap-2">
              <kc-button size="sm">Small</kc-button>
              <kc-button size="md">Medium</kc-button>
              <kc-button size="lg">Large</kc-button>
            </div>
          </div>
        </div>
      </article>

      <!-- Label & Field -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Label &amp; Field</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Wrappers — a semantic label and a field that pairs label,
            control, and help/error text. Used by every form input
            below.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-72 flex-1 flex-col gap-3">
            <kc-field>
              <kc-label slot="label">Email address</kc-label>
              <kc-input placeholder="name@example.com" />
              <span slot="help">We'll never share it.</span>
            </kc-field>
          </div>
          <div class="flex min-w-72 flex-1 flex-col gap-3">
            <kc-field>
              <kc-label slot="label">Email address</kc-label>
              <kc-input
                [invalid]="true"
                               [ngModel]="'not-an-email'"
                [ngModelOptions]="{ standalone: true }"
              />
              <span slot="error">That doesn't look right.</span>
            </kc-field>
          </div>
        </div>
      </article>

      <!-- Input -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Input</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Single-line text input. Three sizes; invalid + disabled
            states are visually distinct from default focus.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Sizes</span>
            <kc-input size="sm" placeholder="Small" />
            <kc-input size="md" placeholder="Medium" />
            <kc-input size="lg" placeholder="Large" />
          </div>
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">States</span>
            <kc-input placeholder="Default" />
            <kc-input
              [ngModel]="'Filled value'"
              [ngModelOptions]="{ standalone: true }"
                         />
            <kc-input
              [invalid]="true"
              [ngModel]="'Invalid value'"
              [ngModelOptions]="{ standalone: true }"
                         />
            <kc-input
              [ngModel]="'Disabled'"
              [ngModelOptions]="{ standalone: true }"
              [disabled]="true"
            />
          </div>
        </div>
      </article>

      <!-- Textarea -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Textarea</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Multi-line text input. Same size and state model as Input;
            row count is set by the <code class="font-mono text-xs">rows</code> attribute.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-64 flex-1 flex-col gap-3">
            <kc-textarea [rows]="3" placeholder="Default state" />
          </div>
          <div class="flex min-w-64 flex-1 flex-col gap-3">
            <kc-textarea
              [rows]="3"
              [invalid]="true"
              [ngModel]="'Invalid state'"
              [ngModelOptions]="{ standalone: true }"
                         />
          </div>
        </div>
      </article>

      <!-- Select -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Select</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Native select, restyled. Three sizes; option list is the
            browser's native picker for accessibility on mobile.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Sizes</span>
            <kc-select size="sm">
              <option>Small</option>
              <option>Choice two</option>
            </kc-select>
            <kc-select size="md">
              <option>Medium</option>
              <option>Choice two</option>
            </kc-select>
            <kc-select size="lg">
              <option>Large</option>
              <option>Choice two</option>
            </kc-select>
          </div>
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">States</span>
            <kc-select [invalid]="true">
              <option>Invalid</option>
            </kc-select>
            <kc-select [disabled]="true">
              <option>Disabled</option>
            </kc-select>
          </div>
        </div>
      </article>

      <!-- Checkbox -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Checkbox</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Binary control. Indeterminate is for mixed-children parent
            checkboxes — a third visual state that resolves to either
            true or false on click.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">States</span>
            <kc-checkbox label="Unchecked" />
            <kc-checkbox
              label="Checked"
              [ngModel]="true"
              [ngModelOptions]="{ standalone: true }"
                         />
            <kc-checkbox label="Indeterminate" [indeterminate]="true" />
            <kc-checkbox label="Invalid" [invalid]="true" />
            <kc-checkbox label="Disabled" [disabled]="true" />
          </div>
        </div>
      </article>

      <!-- Radio group -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Radio group</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Mutually-exclusive choice. Vertical by default; horizontal
            when the labels are short and the choices read better as a
            row.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Vertical</span>
            <kc-radio-group
              [options]="roastOptions"
              [ngModel]="'medium'"
              [ngModelOptions]="{ standalone: true }"
                         />
          </div>
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Horizontal</span>
            <kc-radio-group
              orientation="horizontal"
              [options]="roastOptions"
              [ngModel]="'medium'"
              [ngModelOptions]="{ standalone: true }"
                         />
          </div>
        </div>
      </article>

      <!-- Switch -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Switch</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            On/off toggle for instant settings — flips a boolean state
            without a confirmation step. Use it for "this is on now"
            choices, not destructive ones.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-48 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">States</span>
            <div class="flex flex-wrap items-center gap-3">
              <kc-switch />
              <kc-switch
                [ngModel]="true"
                [ngModelOptions]="{ standalone: true }"
                             />
              <kc-switch [disabled]="true" />
            </div>
          </div>
        </div>
      </article>

      <!-- Slider -->
      <article class="flex flex-col gap-4 rounded-md border border-ink-900/10 bg-cream-50 p-6 dark:border-foam/10 dark:bg-roast-850">
        <header class="flex flex-col gap-1">
          <h3 class="m-0 font-display text-xl font-medium text-ink-900 dark:text-foam">Slider</h3>
          <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">
            Range input. Optional bubble shows the live value above
            the thumb on interaction.
          </p>
        </header>
        <div class="flex flex-wrap items-start gap-6">
          <div class="flex min-w-64 flex-1 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">Default</span>
            <kc-slider
              [ngModel]="40"
              [ngModelOptions]="{ standalone: true }"
                         />
          </div>
          <div class="flex min-w-64 flex-1 flex-col gap-3">
            <span class="label text-ink-500 dark:text-taupe-dim">With bubble</span>
            <kc-slider
              [showBubble]="true"
              [ngModel]="65"
              [ngModelOptions]="{ standalone: true }"
                         />
          </div>
        </div>
      </article>

    </div>
  `,
})
export class BeansComponentsComponent {
  readonly roastOptions = ROAST_OPTIONS;
}
