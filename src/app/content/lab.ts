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
  { value: '4', label: 'Talos clusters — core · dev · 2× prod (active-active)' },
  { value: '12', label: 'Kubernetes nodes across two AZs' },
  { value: '6', label: 'bare-metal EliteDesks running prod across two AZs' },
  { value: '3', label: 'Technitium DNS instances behind a VIP' },
  { value: '13', label: 'Ansible-managed Linux hosts' },
  { value: '6', label: 'VLANs — mgmt · trusted · DMZ · IoT · guest · clients' },
];

export const LAB_PRINCIPLES: readonly LabPrinciple[] = [
  {
    title: 'Hardware redundancy',
    body: 'Every Talos cluster runs a 3-node etcd quorum. Three Technitium DNS instances sit behind a keepalived VIP with AXFR replication. Storage replicates cross-AZ between two TrueNAS boxes. LGTM HA is the last single-instance piece on the roadmap; the HA diagram below shows where it sits.',
  },
  {
    title: 'High availability',
    body: 'Services self-heal via Kubernetes. The edge is split — internal and public traffic terminate on separate Envoy Gateways with their own IPs and policies. Per-cluster Cloudflare tunnels run two replicas. Private PKI and observability still run as a single instance; both are on the HA roadmap below.',
  },
  {
    title: 'GitOps all the way down',
    body: 'Every change is a commit. ArgoCD reconciles workloads, Talos holds cluster state, Ansible holds host state. Rollbacks are a git revert and a webhook; production promotions go through an auto-generated PR a human still has to merge.',
  },
  {
    title: 'Multi-AZ, active-active',
    body: 'Production runs active-active across two AZs, connected by UniFi site-to-site VPN. Each AZ has its own bare-metal Talos prod cluster and TrueNAS; ArgoCD on the core cluster reconciles both. Cross-AZ DNS and storage replication are already in place.',
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
