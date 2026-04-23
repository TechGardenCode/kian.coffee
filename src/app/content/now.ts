export interface NowFocus {
  readonly heading: string;
  readonly body: string;
}

/** Update this date whenever the focus list changes. Printed on the page so
 *  visitors know how recent the snapshot is. */
export const NOW_UPDATED_ISO = '2026-04-22';
export const NOW_LOCATION = 'Arlington, VA';
export const NOW_LEADE = `A short snapshot of what I'm focused on right now. Not every project.
Just the stuff that would actually come up in conversation. This page decays
faster than anything else on the site, so check the date at the top.`;

/**
 * /now focus blocks. Decay fast. Refresh alongside NOW_UPDATED_ISO.
 */
export const NOW_FOCUS: readonly NowFocus[] = [
  {
    heading: 'At Mastercard',
    body: `Rolling out AI-first foundations across the org. Reusable skills,
MCP servers, agent patterns. In parallel, moving the design system's next
cohort through migration. 7 apps done, 28 in flight, more after that.`,
  },
  {
    heading: 'Self-hosted',
    body: `Just shipped the kian.coffee rebuild. This page is the proof.
Next up on Hausparty is the reconciliation and reports phases of the content
pipeline. The Pelican and Wings game-server stack on VLAN 80 is finally
stable enough that friends can run their own servers without a support call.`,
  },
  {
    heading: 'Learning',
    body: `Going deeper on agentic systems. Specifically, how to make local
LLMs useful for ops work without giving them the keys. On paper, whichever
fantasy series is next in the queue. 16 finished in 2025. 2026 is off to a
slow start.`,
  },
  {
    heading: 'Off-keyboard',
    body: `Coffee in the morning. Cat in the afternoon. Fantasy novel at
night. Occasional round with the smoke alarm when I get ambitious in the
kitchen.`,
  },
];
