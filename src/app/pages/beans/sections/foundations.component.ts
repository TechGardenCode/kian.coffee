import { ChangeDetectionStrategy, Component } from '@angular/core';
import { palette, radii, semantic, space, typeScale, type TypeScaleKey } from '@kian.coffee/beans';

interface PaletteRow {
  readonly name: string;
  readonly steps: readonly { step: string; hex: string; bgClass: string }[];
}

/** Static Tailwind class strings for every palette swatch — Tailwind's
 *  source-scanner only picks up class names that appear literally in
 *  source files, so dynamic `bg-${name}-${step}` won't generate a
 *  utility. This map mirrors the beans palette ramps. */
const PALETTE_BG_CLASS: Record<string, string> = {
  'cream-50': 'bg-cream-50',     'cream-100': 'bg-cream-100',
  'cream-200': 'bg-cream-200',   'cream-300': 'bg-cream-300',
  'cream-400': 'bg-cream-400',   'cream-500': 'bg-cream-500',
  'cream-600': 'bg-cream-600',
  'ink-100': 'bg-ink-100',       'ink-300': 'bg-ink-300',
  'ink-500': 'bg-ink-500',       'ink-700': 'bg-ink-700',
  'ink-900': 'bg-ink-900',
  'roast-700': 'bg-roast-700',   'roast-800': 'bg-roast-800',
  'roast-850': 'bg-roast-850',   'roast-900': 'bg-roast-900',
  'roast-950': 'bg-roast-950',
  'taupe-300': 'bg-taupe-300',   'taupe-400': 'bg-taupe-400',
  'taupe-500': 'bg-taupe-500',   'taupe-600': 'bg-taupe-600',
  'accent-50': 'bg-accent-50',   'accent-100': 'bg-accent-100',
  'accent-200': 'bg-accent-200', 'accent-300': 'bg-accent-300',
  'accent-400': 'bg-accent-400', 'accent-500': 'bg-accent-500',
  'accent-600': 'bg-accent-600', 'accent-700': 'bg-accent-700',
  'accent-800': 'bg-accent-800',
  'espresso': 'bg-espresso',     'foam': 'bg-foam',
};

interface SemanticPair {
  readonly name: string;
  readonly cssVar: string;
  readonly light: string;
  readonly dark: string;
}

interface TypeStep {
  readonly token: TypeScaleKey;
  /** Tailwind utility resolved against the typeScale tokens. */
  readonly sampleClass: string;
  /** Human-readable spec line shown next to the sample. */
  readonly meta: string;
  readonly sample: string;
}

interface SpaceRow {
  readonly token: string;
  readonly value: string;
}

const PALETTE_ROWS: readonly PaletteRow[] = (() => {
  const ramps: PaletteRow[] = [];
  for (const [name, family] of Object.entries(palette)) {
    if (typeof family === 'string') {
      ramps.push({
        name,
        steps: [{ step: '', hex: family, bgClass: PALETTE_BG_CLASS[name] ?? '' }],
      });
    } else {
      ramps.push({
        name,
        steps: Object.entries(family).map(([step, hex]) => ({
          step,
          hex,
          bgClass: PALETTE_BG_CLASS[`${name}-${step}`] ?? '',
        })),
      });
    }
  }
  return ramps;
})();

const SEMANTIC_GROUPS: readonly { heading: string; tokens: readonly SemanticPair[] }[] = [
  {
    heading: 'Surfaces',
    tokens: [
      { name: 'bgBase', cssVar: '--bg-base', light: semantic.light.bgBase, dark: semantic.dark.bgBase },
      { name: 'bgRaised', cssVar: '--bg-raised', light: semantic.light.bgRaised, dark: semantic.dark.bgRaised },
      { name: 'bgSunken', cssVar: '--bg-sunken', light: semantic.light.bgSunken, dark: semantic.dark.bgSunken },
      { name: 'bgInverse', cssVar: '--bg-inverse', light: semantic.light.bgInverse, dark: semantic.dark.bgInverse },
    ],
  },
  {
    heading: 'Text',
    tokens: [
      { name: 'textPrimary', cssVar: '--text-primary', light: semantic.light.textPrimary, dark: semantic.dark.textPrimary },
      { name: 'textSecondary', cssVar: '--text-secondary', light: semantic.light.textSecondary, dark: semantic.dark.textSecondary },
      { name: 'textMuted', cssVar: '--text-muted', light: semantic.light.textMuted, dark: semantic.dark.textMuted },
      { name: 'textSubtle', cssVar: '--text-subtle', light: semantic.light.textSubtle, dark: semantic.dark.textSubtle },
    ],
  },
  {
    heading: 'Borders',
    tokens: [
      { name: 'borderSubtle', cssVar: '--border-subtle', light: semantic.light.borderSubtle, dark: semantic.dark.borderSubtle },
      { name: 'borderDefault', cssVar: '--border-default', light: semantic.light.borderDefault, dark: semantic.dark.borderDefault },
      { name: 'borderStrong', cssVar: '--border-strong', light: semantic.light.borderStrong, dark: semantic.dark.borderStrong },
    ],
  },
  {
    heading: 'Accent',
    tokens: [
      { name: 'accent', cssVar: '--accent', light: semantic.light.accent, dark: semantic.dark.accent },
      { name: 'accentHover', cssVar: '--accent-hover', light: semantic.light.accentHover, dark: semantic.dark.accentHover },
      { name: 'accentTint', cssVar: '--accent-tint', light: semantic.light.accentTint, dark: semantic.dark.accentTint },
    ],
  },
];

/** Each entry pairs the typeScale token with a static Tailwind utility
 *  string so the class names appear literally in source for Tailwind's
 *  source-scanner to pick up. Sample text + meta line read from the
 *  data export. */
const TYPE_SAMPLES: Record<TypeScaleKey, { sampleClass: string; sample: string }> = {
  'display-xl': { sampleClass: 'font-display text-display-xl',  sample: 'Display XL' },
  'display-lg': { sampleClass: 'font-display text-display-lg',  sample: 'Display LG' },
  'heading-1':  { sampleClass: 'font-display text-heading-1',   sample: 'Heading 1' },
  'heading-2':  { sampleClass: 'font-display text-heading-2',   sample: 'Heading 2' },
  'heading-3':  { sampleClass: 'font-display text-heading-3',   sample: 'Heading 3' },
  'body-lg':    { sampleClass: 'font-sans text-body-lg',        sample: 'Body LG — lede paragraph copy.' },
  'body':       { sampleClass: 'font-sans text-body',           sample: 'Body — long-form prose at the default reading size.' },
  'body-md':    { sampleClass: 'font-sans text-body-md',        sample: 'Body MD — the page-level prose default.' },
  'body-sm':    { sampleClass: 'font-sans text-body-sm',        sample: 'Body SM — secondary copy.' },
  'caption':    { sampleClass: 'font-sans text-caption',        sample: 'Caption — micro labels and helper text.' },
  'mono':       { sampleClass: 'font-mono text-mono',           sample: '--space-6: 32px' },
  'label':      { sampleClass: 'font-mono text-label uppercase', sample: 'LABEL · ALL CAPS' },
};

const TYPE_SCALE: readonly TypeStep[] = (Object.keys(typeScale) as TypeScaleKey[]).map((token) => {
  const step = typeScale[token];
  return {
    token,
    sampleClass: TYPE_SAMPLES[token].sampleClass,
    meta: `${step.size} · ${step.weight} · lh ${step.leading}`,
    sample: TYPE_SAMPLES[token].sample,
  };
});

const SPACE_ROWS: readonly SpaceRow[] = Object.entries(space).map(([token, value]) => ({
  token: `space-${token}`,
  value,
}));

const RADII_ROWS = Object.entries(radii).map(([token, value]) => ({ token: `radius-${token}`, value }));

/** Elevation specimens — class names map to Tailwind's shadow-X utilities.
 *  The underlying --shadow-X CSS vars are defined in src/styles.css @theme
 *  with a `.dark { ... }` override, so the shadows mode-swap automatically
 *  via CSS cascade. No runtime ThemeService injection needed. */
const ELEVATION_ROWS = [
  { token: 'shadow-xs',    class: 'shadow-xs' },
  { token: 'shadow-sm',    class: 'shadow-sm' },
  { token: 'shadow-md',    class: 'shadow-md' },
  { token: 'shadow-lg',    class: 'shadow-lg' },
  { token: 'shadow-inner', class: 'shadow-inner' },
] as const;

@Component({
  selector: 'app-beans-foundations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Palette ----------------------------------------------------------- -->
    <section id="palette" class="block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.01</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Palette</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        The raw palette. Every semantic token below resolves to a value
        from one of these ramps. Cream and roast are the substrate;
        accent is the only chromatic family.
      </p>
      <div class="mt-6 flex flex-col gap-6">
        @for (row of paletteRows; track row.name) {
          <div class="flex flex-col gap-2">
            <span class="label text-ink-700 dark:text-taupe">{{ row.name }}</span>
            <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(5rem,1fr))]">
              @for (step of row.steps; track step.step) {
                <div class="flex flex-col overflow-hidden rounded-md border border-ink-900/10 bg-cream-50 dark:border-foam/10 dark:bg-roast-850">
                  <span class="block h-16" [class]="step.bgClass"></span>
                  <span class="flex flex-col gap-0.5 px-3 py-2 font-mono text-caption">
                    <span class="font-medium text-ink-900 dark:text-foam">{{ step.step || '—' }}</span>
                    <span class="text-caption text-ink-500 dark:text-taupe-dim">{{ step.hex }}</span>
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Semantic color --------------------------------------------------- -->
    <section id="color" class="mt-12 block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.02</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Color (semantic)</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Surface, text, border, and accent tokens. Each shows its
        light-mode and dark-mode resolved values side-by-side, so the
        page is informative regardless of which mode you're in.
      </p>
      @for (group of semanticGroups; track group.heading) {
        <div class="mt-6">
          <p class="label mb-2 text-ink-700 dark:text-taupe">{{ group.heading }}</p>
          <div class="grid gap-3 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
            @for (token of group.tokens; track token.name) {
              <div class="flex flex-col overflow-hidden rounded-md border border-ink-900/10 bg-cream-50 dark:border-foam/10 dark:bg-roast-850">
                <div class="flex flex-col gap-0.5 border-b border-ink-900/10 p-3 dark:border-foam/10">
                  <span class="font-mono text-body-sm font-medium text-ink-900 dark:text-foam">{{ token.name }}</span>
                  <span class="font-mono text-caption text-ink-500 dark:text-taupe-dim">{{ token.cssVar }}</span>
                </div>
                <div class="grid items-center gap-2 px-3 py-2 font-mono text-caption bg-cream-100 text-ink-900 grid-cols-[1.5rem_auto_1fr]">
                  <span class="h-6 w-6 rounded border border-black/15" [style.background]="token.light"></span>
                  <span class="uppercase tracking-wider opacity-60">light</span>
                  <span class="overflow-hidden text-ellipsis whitespace-nowrap text-end">{{ token.light }}</span>
                </div>
                <div class="grid items-center gap-2 px-3 py-2 font-mono text-caption bg-roast-900 text-cream-100 grid-cols-[1.5rem_auto_1fr]">
                  <span class="h-6 w-6 rounded border border-white/15" [style.background]="token.dark"></span>
                  <span class="uppercase tracking-wider opacity-60">dark</span>
                  <span class="overflow-hidden text-ellipsis whitespace-nowrap text-end">{{ token.dark }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </section>

    <!-- Typography ------------------------------------------------------- -->
    <section id="typography" class="mt-12 block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.03</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Typography</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Three families. Fraunces sets the editorial voice in display.
        Inter handles long-form body. JetBrains Mono is the system
        voice — labels, code, mono numerals.
      </p>
      <div class="mt-6 flex flex-col gap-4">
        <div class="flex flex-col gap-3 rounded-md border border-ink-900/10 bg-cream-50 p-5 dark:border-foam/10 dark:bg-roast-850">
          <div class="flex flex-col gap-1">
            <h4 class="m-0 font-display text-xl font-medium tracking-tight text-ink-900 dark:text-foam">Fraunces</h4>
            <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">Display · font-display</p>
          </div>
          <p class="m-0 font-display text-2xl leading-snug text-ink-900 dark:text-foam">Mountain coffee, slowly.</p>
        </div>
        <div class="flex flex-col gap-3 rounded-md border border-ink-900/10 bg-cream-50 p-5 dark:border-foam/10 dark:bg-roast-850">
          <div class="flex flex-col gap-1">
            <h4 class="m-0 font-sans text-xl font-medium tracking-tight text-ink-900 dark:text-foam">Inter</h4>
            <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">Body sans · font-sans</p>
          </div>
          <p class="m-0 font-sans text-2xl leading-snug text-ink-900 dark:text-foam">The quick brown fox jumps over the lazy dog.</p>
        </div>
        <div class="flex flex-col gap-3 rounded-md border border-ink-900/10 bg-cream-50 p-5 dark:border-foam/10 dark:bg-roast-850">
          <div class="flex flex-col gap-1">
            <h4 class="m-0 font-mono text-xl font-medium tracking-tight text-ink-900 dark:text-foam">JetBrains Mono</h4>
            <p class="m-0 font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe">Mono · font-mono</p>
          </div>
          <p class="m-0 font-mono text-2xl leading-snug text-ink-900 dark:text-foam">const space = &#123; 1: "4px", 10: "128px" &#125;</p>
        </div>
      </div>
    </section>

    <!-- Type scale ------------------------------------------------------- -->
    <section id="type-scale" class="mt-12 block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.04</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Type scale</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Reference sizes used across the site. Hero copy is fluid in
        production via <code class="font-mono text-sm">clamp()</code>;
        these are the desktop targets.
      </p>
      <div class="mt-6">
        @for (step of typeScale; track step.token) {
          <div class="flex flex-col gap-2 border-b border-ink-900/10 py-4 last:border-b-0 dark:border-foam/10">
            <p class="m-0 text-ink-900 dark:text-foam" [class]="step.sampleClass">{{ step.sample }}</p>
            <div class="flex gap-3 font-mono text-caption text-ink-500 dark:text-taupe-dim">
              <span>{{ step.token }}</span>
              <span>{{ step.meta }}</span>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Spacing ---------------------------------------------------------- -->
    <section id="spacing" class="mt-12 block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.05</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Spacing</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Ten steps. Never use a value not on the scale. Page-level
        rhythm uses 9 and 10; interior rhythm uses 1 through 7. Bar
        widths below are literal — what you see is the actual
        token value.
      </p>
      <div class="mt-6">
        @for (row of spaceRows; track row.token) {
          <div class="grid items-center gap-3 py-2 grid-cols-[5rem_1fr_4rem]">
            <span class="font-mono text-xs text-ink-500 dark:text-taupe-dim">{{ row.token }}</span>
            <div class="block w-full">
              <span class="block h-3 rounded-full bg-accent" [style.width]="row.value"></span>
            </div>
            <span class="text-end font-mono text-xs text-ink-500 dark:text-taupe-dim">{{ row.value }}</span>
          </div>
        }
      </div>
    </section>

    <!-- Radii ------------------------------------------------------------ -->
    <section id="radii" class="mt-12 block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.06</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Radii</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Six radii. Pill is reserved for fully-rounded elements
        (badges, switches); xl is reserved for hero-scale surfaces.
      </p>
      <div class="mt-6 grid gap-3 grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]">
        @for (r of radiiRows; track r.token) {
          <div class="flex flex-col gap-2">
            <div class="h-20 border border-accent bg-accent/10" [style.borderRadius]="r.value"></div>
            <div class="flex justify-between font-mono text-caption text-ink-500 dark:text-taupe-dim">
              <span>{{ r.token }}</span>
              <span>{{ r.value }}</span>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Elevation -------------------------------------------------------- -->
    <section id="elevation" class="mt-12 block scroll-mt-20">
      <p class="label mb-3 text-ink-500 dark:text-taupe-dim">02.07</p>
      <h3 class="mb-4 font-display text-2xl font-medium tracking-tight text-ink-900 dark:text-foam">Elevation</h3>
      <p class="max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
        Five depths. Light- and dark-mode shadows are tuned
        independently because dark surfaces need stronger separation.
      </p>
      <div class="mt-6 grid gap-6 rounded-md bg-cream-200 p-6 dark:bg-roast-950 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
        @for (e of elevationRows; track e.token) {
          <div class="flex flex-col items-center gap-2">
            <div class="h-20 w-full rounded-md bg-cream-50 dark:bg-roast-850" [class]="e.class"></div>
            <div class="font-mono text-caption text-ink-500 dark:text-taupe-dim">{{ e.token }}</div>
          </div>
        }
      </div>
    </section>
  `,
})
export class BeansFoundationsComponent {
  readonly paletteRows = PALETTE_ROWS;
  readonly semanticGroups = SEMANTIC_GROUPS;
  readonly typeScale = TYPE_SCALE;
  readonly spaceRows = SPACE_ROWS;
  readonly radiiRows = RADII_ROWS;
  readonly elevationRows = ELEVATION_ROWS;
}
