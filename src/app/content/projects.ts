export interface ProjectEntry {
  readonly title: string;
  readonly eyebrow: string;
  /** 1–2 sentence narrative. CV-sourced where possible; placeholder otherwise. */
  readonly summary: string;
  readonly stack: readonly string[];
  readonly links?: readonly ProjectLink[];
}

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface ProjectGroup {
  readonly heading: string;
  readonly note: string;
  readonly projects: readonly ProjectEntry[];
}

/**
 * Side projects and shipped apps. CV entries are reproduced close to the
 * original wording; non-CV entries (Hausparty, Pelican, kian.coffee) use
 * bracketed placeholders so the user can supply their own copy.
 */
export const PROJECT_GROUPS: readonly ProjectGroup[] = [
  {
    heading: 'Built on bare metal',
    note: 'Infrastructure + platform work — a self-hosted hybrid cloud.',
    projects: [
      {
        title: 'Self-hosted hybrid cloud',
        eyebrow: 'Platform · Kubernetes',
        // Paraphrased from CV. CV says "K3s + Proxmox"; current homelab runs
        // Talos — verify which wording to ship with.
        summary: `Highly available multi-AZ Kubernetes cluster on Proxmox, with
declarative rollouts via Ansible, ArgoCD, and GitHub Actions. Cloud-scale
resilience patterns applied on bare metal.`,
        stack: ['Kubernetes', 'Proxmox', 'ArgoCD', 'Ansible', 'GitHub Actions'],
        links: [
          { label: 'See it on /lab', href: '/lab' },
          { label: 'Source', href: 'https://github.com/TechGardenCode/kian.sh', external: true },
        ],
      },
      {
        title: 'Zero-trust home network',
        eyebrow: 'Security · Networking',
        // CV wording.
        summary: `Deny-by-default, allowlist-based access model with VPN, VLAN
segmentation, and DMZ firewalls.`,
        stack: ['VLANs', 'VPN', 'DMZ'],
      },
      {
        title: 'Multi-AZ NAS with 3-2-1 backups',
        eyebrow: 'Storage · Durability',
        // CV wording.
        summary: `TrueNAS + ZFS with Cloud Sync and RSync for data durability and
archival across availability zones.`,
        stack: ['TrueNAS', 'ZFS', 'Cloud Sync', 'RSync'],
      },
    ],
  },
  {
    heading: 'AI as a tool, not a product',
    note: 'Where AI earns a seat — ops, automation, observability — not the headline, the force multiplier.',
    projects: [
      {
        title: 'AI-first monitoring + IaC',
        eyebrow: 'Agentic Ops',
        // CV wording.
        summary: `Local LLM drives Ansible-based setup of Prometheus + Grafana
stacks, evaluates and reinforces monitoring coverage, triages incoming
alerts, and auto-tunes thresholds and alert/scrape parameters based on
observed signal. Agentic ops on a self-hosted stack.`,
        stack: ['Local LLM', 'Ansible', 'Prometheus', 'Grafana'],
      },
      {
        title: 'AI-enabled home automation',
        eyebrow: 'Home Automation',
        // CV wording.
        summary: `Home Assistant + N8N + local LLM orchestration for private,
low-latency automation. Keeps inference and data on-prem.`,
        stack: ['Home Assistant', 'N8N', 'Local LLM'],
      },
    ],
  },
  {
    heading: 'Apps I ship from the same lab',
    note: 'Workloads deployed through the same GitOps pipeline that serves this site.',
    projects: [
      {
        title: 'kian.coffee',
        eyebrow: 'This site',
        summary: `[KIAN.COFFEE SUMMARY — 1–2 sentences describing this site the way
you'd describe a project. What it is, why it exists, what makes it worth
pointing at. Skip hyperbole.]`,
        stack: ['Angular 21', 'Tailwind v4', 'SSR + ISR cache', 'ArgoCD'],
        links: [
          { label: 'Source', href: 'https://github.com/TechGardenCode/kian-coffee', external: true },
        ],
      },
      {
        title: 'Hausparty',
        eyebrow: '[domain tag, e.g. Next.js · CNPG]',
        summary: `[HAUSPARTY SUMMARY — 1–2 sentences. What it is, the interesting
technical bits, any stack choices worth naming. Your words, not mine.]`,
        stack: ['[stack 1]', '[stack 2]', '[stack 3]', '[stack 4]'],
      },
      {
        title: 'Pelican + Wings game servers',
        eyebrow: 'Game infra',
        summary: `[GAME-SERVER SUMMARY — 1–2 sentences. What it's for, how it's
wired, who uses it. Keep it human.]`,
        stack: ['Pelican', 'Wings', 'VLAN 80'],
      },
    ],
  },
];
