export interface LabStat {
  readonly value: string;
  readonly label: string;
}

export interface LabStackGroup {
  readonly heading: string;
  readonly note: string;
  readonly items: readonly string[];
}

export interface LabPrinciple {
  readonly title: string;
  readonly body: string;
}

// Counts are derivable from repo state — the lab page doesn't surface
// operational detail (IPs, CIDRs, AZ codes, repo paths) on purpose.
export const LAB_STATS: readonly LabStat[] = [
  { value: '3', label: 'Talos clusters today — core · dev · prod (4th planned for second AZ)' },
  { value: '9', label: 'Kubernetes nodes today — 12 once the second AZ is up' },
  { value: '3', label: 'bare-metal EliteDesks running prod (+3 more planned for the second AZ)' },
  { value: '3', label: 'Technitium DNS instances behind a VIP' },
  { value: '13', label: 'Ansible-managed Linux hosts' },
  { value: '6', label: 'VLANs — mgmt · trusted · DMZ · IoT · guest · clients' },
];

export const LAB_PRINCIPLES: readonly LabPrinciple[] = [
  {
    title: 'Hardware redundancy',
    body: 'Every Talos cluster runs a three-node etcd quorum. Three Technitium DNS instances sit behind a keepalived VIP with AXFR replication. Storage replication and LGTM HA aren’t there yet — the HA diagram below shows where each one stands.',
  },
  {
    title: 'High availability',
    body: 'Services self-heal through Kubernetes. The edge is split: internal and public traffic land on separate Envoy Gateways, each with its own IPs and policies. Per-cluster Cloudflare tunnels run two replicas. Private PKI and observability are still single-instance, and both are queued for HA work.',
  },
  {
    title: 'GitOps all the way down',
    body: 'Every change is a commit. ArgoCD reconciles workloads, Talos holds cluster state, Ansible holds host state. Rollbacks are a git revert and a webhook. Production promotions go through an auto-generated PR that a human still has to merge.',
  },
  {
    title: 'Multi-AZ by design',
    body: 'A second AZ is wired up over a UniFi site-to-site VPN. The hardware is mid-move between sites right now, so production is on one AZ until it lands. DNS zones, cluster naming, and storage all already assume a second site, so adding it back is an addition rather than a rewrite.',
  },
];

export const LAB_STACK: readonly LabStackGroup[] = [
  {
    heading: 'Infrastructure',
    note: 'Physical hosts, hypervisor, networking',
    items: [
      'HP EliteDesk (×3, bare-metal prod)',
      'Minisforum HX90 / BD795i (×3, Proxmox)',
      'Raspberry Pi 5 (×2)',
      'TrueNAS (×2)',
      'VLAN segmentation',
    ],
  },
  {
    heading: 'Operating system + Kubernetes',
    note: 'Immutable OS, 3 Talos clusters, MetalLB L2',
    items: [
      'Talos Linux',
      'Kubernetes',
      'MetalLB',
      'Envoy Gateway',
      'Gateway API',
    ],
  },
  {
    heading: 'Platform services',
    note: 'The cloud-native plane that ties it all together',
    items: [
      'ArgoCD',
      'Argo Workflows',
      'cert-manager',
      'external-dns',
      'Technitium DNS',
      'CloudNativePG',
      'Dragonfly',
      'External Secrets Operator',
      'Bitwarden Secrets Manager',
      'Reloader',
    ],
  },
  {
    heading: 'Observability',
    note: 'LGTM stack, self-hosted',
    items: [
      'Grafana',
      'Loki',
      'Tempo',
      'Mimir',
      'Grafana Alloy',
      'Prometheus Operator',
    ],
  },
  {
    heading: 'Delivery pipeline',
    note: 'GitOps end-to-end, PRs promote dev → prod',
    items: [
      'GitHub Actions',
      'ghcr.io',
      'auto-promoted image tags',
      'Renovate',
    ],
  },
  {
    heading: 'Apps running here',
    note: 'Workloads shipped from personal repos',
    items: [
      'kian.coffee',
      'techgarden.gg',
      'Hausparty',
      'Pelican + Wings (game servers)',
    ],
  },
];
