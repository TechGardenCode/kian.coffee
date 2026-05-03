import { ChangeDetectionStrategy, Component } from '@angular/core';

type Status = 'stable' | 'wip' | 'planned';

interface AuditEntry {
  readonly label: string;
  readonly status: Status;
  readonly note: string;
}

const ENTRIES: readonly AuditEntry[] = [
  { label: 'Tokens — palette, color, type, spacing, radii, motion', status: 'stable', note: 'Two-tier model is settled. New raw colors will land on the existing ramps; semantic names will not change.' },
  { label: 'Tokens — elevation', status: 'stable', note: 'Five depths each, light / dark independent. No more shadows planned.' },
  { label: 'Forms components — Input, Textarea, Select, Checkbox, Radio, Switch, Slider', status: 'stable', note: 'Public API set. CVA wired; size + invalid + disabled are uniform across the family.' },
  { label: 'Field + Label wrappers', status: 'stable', note: 'Slot-based composition; help / error text positions are fixed.' },
  { label: 'Behaviors — mode toggle, scroll spy, tab roving, tooltip, copy', status: 'stable', note: 'Framework-agnostic at the core; Angular adapters in the components/ tier.' },
  { label: 'Page templates — Page, Hero, Section, Band, Footer CTA, Marketing, Doc', status: 'stable', note: 'Doc landed alongside this page. Article template is still a seam.' },
  { label: 'Page templates — Article', status: 'wip', note: 'Constrained prose column with table-of-contents. Lands when the first article route exists.' },
  { label: 'Type-scale tokens', status: 'planned', note: 'Type sizes are hardcoded today. A real scale-token export would let pages reference --text-display-xl etc.' },
  { label: 'Iconography', status: 'planned', note: 'No first-party icon set yet. Pages currently borrow glyphs ad-hoc; a curated set is on the roadmap.' },
  { label: 'Section markers', status: 'planned', note: 'The dividers and band-end glyphs the doc references are not yet a published primitive.' },
];

@Component({
  selector: 'app-beans-audit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="mb-6 max-w-prose font-sans text-base leading-relaxed text-ink-700 dark:text-taupe">
      Where things stand. Stable means the API and visual treatment
      are settled and you can build against them; WIP means the shape
      is right but final details are landing; planned means it's known
      and on the list, but not built yet.
    </p>
    <div class="flex flex-col gap-2">
      @for (entry of entries; track entry.label) {
        <div class="grid gap-3 rounded border border-ink-900/10 p-3 dark:border-foam/10 grid-cols-[1fr_auto]">
          <div>
            <span class="font-mono text-sm text-ink-900 dark:text-foam">{{ entry.label }}</span>
            <span class="mt-0.5 block font-sans text-xs text-ink-500 dark:text-taupe-dim">{{ entry.note }}</span>
          </div>
          <span
            class="inline-flex items-center gap-1 self-start rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider"
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
