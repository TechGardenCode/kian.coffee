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
    note: 'Infrastructure and platform work. A self-hosted hybrid cloud.',
    projects: [
      {
        title: 'Self-hosted hybrid cloud',
        eyebrow: 'Platform · Kubernetes',
        // Paraphrased from CV. CV says "K3s + Proxmox"; current homelab runs
        // Talos — verify which wording to ship with.
        summary: `Multi-AZ Kubernetes on Proxmox, declared in git and rolled out
by Ansible, ArgoCD, and GitHub Actions. The same patterns I use at work,
sized for a basement.`,
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
        summary: `TrueNAS and ZFS, with Cloud Sync and RSync handling durability
and archival across availability zones.`,
        stack: ['TrueNAS', 'ZFS', 'Cloud Sync', 'RSync'],
      },
    ],
  },
  {
    heading: 'AI as a tool, not a product',
    note: 'Where AI does the actual work: ops, automation, observability. Quietly, in the background.',
    projects: [
      {
        title: 'A local LLM watching the monitoring stack',
        eyebrow: 'Agentic Ops',
        summary: `A local LLM stands up Prometheus and Grafana with Ansible,
watches what's actually firing, and tunes thresholds and scrape intervals
based on what it sees. Same loop a human SRE runs, just cheaper to run
overnight.`,
        stack: ['Local LLM', 'Ansible', 'Prometheus', 'Grafana'],
      },
      {
        title: 'AI-enabled home automation',
        eyebrow: 'Home Automation',
        // CV wording.
        summary: `Home Assistant, N8N, and a local LLM running together for
private automation that doesn't round-trip to anyone's cloud.`,
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
        summary: `The page you're reading right now. Angular 21 with standalone
components, Tailwind v4, SSR + ISR cache, served out of the same Talos cluster
the /lab page describes. If it loaded, the homelab's alive.`,
        stack: ['Angular 21', 'Tailwind v4', 'SSR + ISR cache', 'ArgoCD'],
        links: [
          { label: 'Source', href: 'https://github.com/TechGardenCode/kian-coffee', external: true },
        ],
      },
      {
        title: 'Hausparty',
        eyebrow: 'Next.js · CNPG · Dragonfly',
        summary: `A content-discovery app backed by a staged ingestion pipeline.
Next.js 16 on the frontend. CloudNativePG for durable state. Dragonfly for
rate limits and cache. Ships through the same GitOps pipeline as everything
else in the lab.`,
        stack: ['Next.js 16', 'CloudNativePG', 'Dragonfly', 'Kubernetes'],
      },
      {
        title: 'Pelican + Wings game servers',
        eyebrow: 'Game infra',
        summary: `Pelican control plane on the core cluster. Wings daemons on a
dedicated node out on VLAN 80. Friends spin up their own game servers without
texting me first.`,
        stack: ['Pelican', 'Wings', 'VLAN 80'],
      },
    ],
  },
];
