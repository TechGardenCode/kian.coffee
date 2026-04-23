export interface UsesGroup {
  readonly heading: string;
  readonly note: string;
  readonly items: readonly UsesItem[];
}

export interface UsesItem {
  readonly name: string;
  readonly detail: string;
}

/**
 * /uses content — personal tooling, hardware, and rituals. Editor/terminal
 * tools and items verifiable from the homelab repo are filled in; personal
 * hardware (laptop, monitor, keyboard, coffee gear) stays as short `[model]`
 * markers for Kian to swap in — honesty beats fabrication.
 */
export const USES: readonly UsesGroup[] = [
  {
    heading: 'Editor + coding',
    note: 'Where most hours go',
    items: [
      { name: 'Claude Code', detail: 'Primary pair. Agents, skills, the whole harness.' },
      { name: 'VS Code', detail: 'Editor of record. Fallback when a tool needs a real IDE.' },
      { name: 'Warp', detail: 'Terminal with command history I actually trust.' },
      { name: 'gh CLI', detail: 'PRs, issues, and CI from the terminal. The browser is too slow.' },
    ],
  },
  {
    heading: 'Daily-driver hardware',
    note: 'The desk setup',
    items: [
      { name: 'Laptop', detail: '[model · year · why this one]' },
      { name: 'Monitor(s)', detail: '[size · resolution · positioning]' },
      { name: 'Keyboard', detail: '[switches · layout · anything custom]' },
      { name: 'Mouse / trackpad', detail: '[why this one]' },
      { name: 'Desk / chair', detail: '[if worth naming]' },
    ],
  },
  {
    heading: 'Homelab hardware',
    note: 'The rack under the desk',
    items: [
      // The EliteDesks + node counts are verifiable from
      // projects/wiki/wiki/architecture/network-topology.md and
      // ansible/inventory/hosts.yml — safe to keep.
      { name: 'HP EliteDesk 800 G4 ×3', detail: 'Bare-metal Talos prod cluster — talos-prod-s1/s2/s3' },
      { name: 'Proxmox hosts ×3', detail: 'hx90, bd-n1, bd-n2. [physical models / specs]' },
      { name: 'Raspberry Pi ×2', detail: 'rpi-n1 (DNS primary) + rpi-n2 (edge LB). [Pi generation]' },
      { name: 'TrueNAS — 2 nodes', detail: 'jb-nas + cm-nas — ZFS, RSync + Cloud Sync for 3-2-1' },
      { name: 'Network gear', detail: '[router / switch model · VLAN + VPN notes]' },
    ],
  },
  {
    heading: 'Infra + ops toolbelt',
    note: 'What lives in the terminal',
    items: [
      { name: 'talosctl', detail: 'The only way to talk to Talos — no SSH, no shell' },
      { name: 'kubectl + k9s', detail: 'Day-to-day cluster driving; k9s for when I need to see five things at once' },
      { name: 'ArgoCD CLI', detail: 'App management from the terminal; web UI is for observing' },
      { name: 'Ansible', detail: 'Host config for everything outside Kubernetes' },
      { name: 'Grafana + Loki + Tempo (self-hosted)', detail: 'LGTM stack with Alloy on every host' },
      { name: 'Bitwarden Secrets Manager', detail: 'Single source of truth for homelab secrets' },
    ],
  },
  {
    heading: 'Coffee',
    note: 'The other kind of stack',
    items: [
      { name: 'Espresso grinder', detail: '[make · model · why]' },
      { name: 'Espresso machine', detail: '[make · model]' },
      { name: 'Batch-brew grinder', detail: '[make · model, if separate from espresso]' },
      { name: 'Brew method', detail: '[pour-over · Aeropress · whatever the ritual is]' },
      { name: 'Bean rotation', detail: '[roaster · style of bean you lean toward]' },
    ],
  },
];
