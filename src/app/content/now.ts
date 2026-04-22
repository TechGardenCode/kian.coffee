export interface NowFocus {
  readonly heading: string;
  readonly body: string;
}

/** Update this date whenever the focus list changes. Printed on the page so
 *  visitors know how recent the snapshot is. */
export const NOW_UPDATED_ISO = '2026-04-22';
export const NOW_LOCATION = 'Arlington, VA';
export const NOW_LEADE = `[/NOW LEADE — 1–2 sentences. What this page is, who it's for, the level
of detail you want to go into. Example starting point: "A short snapshot of
what I'm focused on right now — not every project, just the things that would
actually come up in conversation."]`;

/**
 * /now focus blocks. Bodies are deliberately placeholder so the user writes
 * them in their own voice — this page decays fastest of anything on the site,
 * and made-up specifics ("third wave rollout", "reading DDIA for the third
 * time") would read as filler.
 */
export const NOW_FOCUS: readonly NowFocus[] = [
  {
    heading: 'At Mastercard',
    body: `[CURRENT WORK FOCUS — 2–3 sentences on what's actively on the plate.
Prefer concrete nouns over adjectives. What's shipping this quarter, what's
still being designed, what the next milestone looks like.]`,
  },
  {
    heading: 'Self-hosted',
    body: `[SELF-HOSTED FOCUS — what's changing in the homelab or personal
projects right now. kian.coffee rebuild, Hausparty phases, homelab upgrades,
anything you'd want to talk about if someone asked "what have you been
tinkering with?"]`,
  },
  {
    heading: 'Learning',
    body: `[LEARNING FOCUS — what you're going deeper on right now. Books,
topics, domains, tools. Specific enough to invite a real conversation, not
so specific it rots in a month.]`,
  },
  {
    heading: 'Off-keyboard',
    body: `[OFF-KEYBOARD — what's going on outside the screen. Keep it honest;
don't fabricate hobbies you don't have. If there's nothing worth saying,
drop this block entirely.]`,
  },
];
