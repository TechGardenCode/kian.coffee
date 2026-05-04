import { ChangeDetectionStrategy, Component } from '@angular/core';

type Status = 'stable' | 'wip' | 'planned';

interface AuditEntry {
  readonly label: string;
  readonly status: Status;
  readonly note: string;
}

const ENTRIES: readonly AuditEntry[] = [
  { label: 'Tokens — palette, color, type, spacing, radii, motion', status: 'stable', note: 'The two-tier model is settled. Any new raw colors land on the existing ramps. Semantic names won’t change.' },
  { label: 'Tokens — elevation', status: 'stable', note: 'Five depths, light and dark tuned separately. No more shadows planned.' },
  { label: 'Forms components — Input, Textarea, Select, Checkbox, Radio, Switch, Slider', status: 'stable', note: 'Public API is set. ControlValueAccessor wired. Size, invalid, and disabled behave the same across all of them.' },
  { label: 'Field + Label wrappers', status: 'stable', note: 'Slot-based. Help and error text positions are fixed.' },
  { label: 'Behaviors — mode toggle, scroll spy, tab roving, tooltip, copy', status: 'stable', note: 'The core logic is framework-agnostic. The Angular adapters live in components/.' },
  { label: 'Page templates — Page, Hero, Section, Band, Footer CTA, Marketing, Doc', status: 'stable', note: 'Doc landed with this page. Article is still a seam.' },
  { label: 'Page templates — Article', status: 'wip', note: 'Narrow prose column with a table of contents. Ships when the first article route does.' },
  { label: 'Type-scale tokens', status: 'stable', note: 'Ten steps, from display-xl down to label. Exported by beans and aliased into Tailwind via @theme, so pages use text-display-xl and friends.' },
  { label: 'Iconography', status: 'planned', note: 'No first-party icon set yet. Pages borrow glyphs ad-hoc for now. A curated set is on the list.' },
  { label: 'Section markers', status: 'planned', note: 'The dividers and band-end glyphs the doc references aren’t a published part of the system yet.' },
];

@Component({
  selector: 'app-beans-audit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="mb-6 max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
      Where things stand. Stable means the API and visual treatment are
      settled — go ahead and build against it. WIP means the shape is
      there but I'm still landing details. Planned means it's on the
      list but doesn't exist yet.
    </p>
    <div class="flex flex-col gap-2">
      @for (entry of entries; track entry.label) {
        <div class="grid gap-3 rounded border border-ink-900/10 p-3 dark:border-foam/10 grid-cols-[1fr_auto]">
          <div>
            <span class="font-mono text-sm text-ink-900 dark:text-foam">{{ entry.label }}</span>
            <span class="mt-0.5 block font-sans text-xs text-ink-500 dark:text-taupe-dim">{{ entry.note }}</span>
          </div>
          <span
            class="inline-flex items-center gap-1 self-start rounded-full border px-2 py-0.5 font-mono text-caption uppercase tracking-wider"
            [class.border-accent]="entry.status === 'stable'"
            [class.text-accent]="entry.status === 'stable'"
            [class.border-amber-700]="entry.status === 'wip'"
            [class.text-amber-700]="entry.status === 'wip'"
            [class.border-ink-500]="entry.status === 'planned'"
            [class.text-ink-500]="entry.status === 'planned'"
            [class.dark:border-taupe-dim]="entry.status === 'planned'"
            [class.dark:text-taupe-dim]="entry.status === 'planned'"
          >
            {{ entry.status }}
          </span>
        </div>
      }
    </div>
  `,
})
export class BeansAuditComponent {
  readonly entries = ENTRIES;
}
