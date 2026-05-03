import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CheckboxComponent,
  CopyButtonComponent,
  type CopyResult,
  FieldComponent,
  InputComponent,
  LabelComponent,
  ModeToggleDirective,
  RadioGroupComponent,
  RadioOption,
  ScrollSpyDirective,
  SelectComponent,
  SliderComponent,
  SwitchComponent,
  TabRovingDirective,
  TextareaComponent,
  TooltipDirective,
} from '@kian.coffee/beans';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelComponent,
    FieldComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxComponent,
    RadioGroupComponent,
    SwitchComponent,
    SliderComponent,
    // Group B
    ModeToggleDirective,
    ScrollSpyDirective,
    CopyButtonComponent,
    TabRovingDirective,
    TooltipDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ----- ngModel (template-driven) bindings -----
  protected readonly inputModel = signal('');
  protected readonly textareaModel = signal('');
  protected readonly selectModel = signal('pour');
  protected readonly checkboxModel = signal(false);
  protected readonly switchModel = signal(true);
  protected readonly sliderModel = signal(40);
  protected readonly radioModel = signal('pour');

  // ----- Reactive form bindings -----
  protected readonly inputCtrl = new FormControl<string>('hello@kian.coffee', { nonNullable: true });
  protected readonly textareaCtrl = new FormControl<string>('', { nonNullable: true });
  protected readonly selectCtrl = new FormControl<string>('drip', { nonNullable: true });
  protected readonly checkboxCtrl = new FormControl<boolean>(true, { nonNullable: true });
  protected readonly switchCtrl = new FormControl<boolean>(false, { nonNullable: true });
  protected readonly sliderCtrl = new FormControl<number>(72, { nonNullable: true });
  protected readonly radioCtrl = new FormControl<string | null>('drip');

  protected readonly brewOptions: readonly RadioOption[] = [
    { value: 'pour', label: 'Pour-over' },
    { value: 'drip', label: 'Drip' },
    { value: 'press', label: 'French press' },
    { value: 'espresso', label: 'Espresso' },
  ];

  protected readonly selectOptions = ['pour', 'drip', 'press', 'espresso'];

  protected readonly sliderFormat = (v: number) => `${v}°C`;

  /** Drives [disabled] on every Angular control (ngModel + FormControl).
   *  Also flips the underlying FormControls so we can verify CVA
   *  setDisabledState propagation through reactive forms. */
  protected readonly disabledAll = signal(false);
  protected toggleDisableAll() {
    const next = !this.disabledAll();
    this.disabledAll.set(next);
    const ctrls = [
      this.inputCtrl,
      this.textareaCtrl,
      this.selectCtrl,
      this.checkboxCtrl,
      this.switchCtrl,
      this.sliderCtrl,
      this.radioCtrl,
    ];
    for (const c of ctrls) {
      if (next) c.disable(); else c.enable();
    }
  }

  // ============================== GROUP B ==============================

  protected readonly snippet = `npm i @kian.coffee/beans`;
  protected readonly copyResult = signal<CopyResult | null>(null);
  protected onCopy(r: CopyResult) { this.copyResult.set(r); }
  protected async bareCopy(text: string) {
    try { await navigator.clipboard.writeText(text); }
    catch { /* parity demo — no fallback in the bare cell */ }
  }

  protected readonly scrollSpyIds = ['ss-1', 'ss-2', 'ss-3', 'ss-4'] as const;
  protected readonly activeScrollId = signal<string | null>(null);
  protected onScrollSpyChange(id: string | null) { this.activeScrollId.set(id); }

  /** CSS-floor mode-toggle — verbatim logic from Components.html lines
   *  1580–1597, kept intentionally inside the sandbox so the parity cell
   *  demonstrates "bare HTML + tiny IIFE" without consuming library code. */
  protected applyBareMode(mode: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('kc-ds-mode', mode);
  }
}
