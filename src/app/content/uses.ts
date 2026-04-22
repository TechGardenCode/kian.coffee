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
 * /uses content — personal tooling, hardware, and rituals. Nothing here is
 * sourced from the CV, so every item below is a bracketed placeholder for
 * the user to fill in. Structure + section headings are the scaffolding;
 * specifics are explicitly NOT invented.
 */
export const USES: readonly UsesGroup[] = [
  {
    heading: 'Editor + coding',
    note: 'Where most hours go',
    items: [
      { name: '[TOOL 1]', detail: '[one-line note on why this one, e.g. editor choice + notable config]' },
      { name: '[TOOL 2]', detail: '[one-line note]' },
      { name: '[TOOL 3]', detail: '[one-line note]' },
      { name: '[TOOL 4]', detail: '[one-line note]' },
    ],
  },
  {
    heading: 'Daily-driver hardware',
    note: 'The desk setup',
    items: [
      { name: '[LAPTOP / DESKTOP — model]', detail: '[spec callouts + why this one]' },
      { name: '[MONITOR(S)]', detail: '[size · resolution · positioning]' },
      { name: '[KEYBOARD]', detail: '[switches · layout · anything custom]' },
      { name: '[MOUSE / TRACKPAD]', detail: '[why this one]' },
      { name: '[DESK / CHAIR]', detail: '[if worth naming]' },
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
      { name: '[PROXMOX HOSTS — models]', detail: 'hx90, bd-n1, bd-n2 — [fill in physical models / specs]' },
      { name: 'Raspberry Pi ×2', detail: 'rpi-n1 (DNS primary) + rpi-n2 (edge LB) — [fill in generation, e.g. Pi 5]' },
      { name: 'TrueNAS — 2 nodes', detail: 'jb-nas + cm-nas — ZFS, RSync + Cloud Sync for 3-2-1' },
      { name: '[NETWORK GEAR]', detail: '[router / switch model, VLAN + VPN setup notes]' },
    ],
  },
  {
    heading: 'Infra + ops toolbelt',
    note: 'What lives in the terminal',
    items: [
      // These are verifiable from the homelab CLAUDE.md + skills/ folder.
      { name: 'talosctl', detail: 'The only way to talk to Talos — no SSH, no shell' },
      { name: 'ArgoCD CLI', detail: 'App management from the terminal; web UI is for observing' },
      { name: 'Ansible', detail: 'Host config for everything outside Kubernetes' },
      { name: 'Grafana + Loki + Tempo (self-hosted)', detail: 'LGTM stack with Alloy on every host' },
      { name: 'Bitwarden Secrets Manager', detail: 'Single source of truth for homelab secrets' },
      { name: '[OTHER TOOLS]', detail: '[add anything else worth naming — k9s, gh, Warp, etc.]' },
    ],
  },
  {
    heading: 'Coffee',
    note: 'The other kind of stack',
    items: [
      { name: '[ESPRESSO GRINDER]', detail: '[make + model + why you picked it]' },
      { name: '[ESPRESSO MACHINE]', detail: '[make + model]' },
      { name: '[BATCH-BREW GRINDER]', detail: '[make + model, if separate from espresso]' },
      { name: '[BREW METHOD]', detail: '[pour-over? Aeropress? Moka? Whatever the ritual is]' },
      { name: '[BEAN ROTATION]', detail: '[roaster or subscription, style of bean you lean toward]' },
    ],
  },
];
