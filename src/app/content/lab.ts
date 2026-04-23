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
  { value: '3', label: 'Talos clusters — core · dev · prod' },
  { value: '9', label: 'Kubernetes nodes across the three clusters' },
  { value: '3', label: 'bare-metal EliteDesks running prod' },
  { value: '3', label: 'Technitium DNS instances behind a VIP' },
  { value: '13', label: 'Ansible-managed Linux hosts' },
  { value: '6', label: 'VLANs — mgmt · trusted · DMZ · IoT · guest · clients' },
];

export const LAB_PRINCIPLES: readonly LabPrinciple[] = [
  {
    title: 'Redundancy at the failure domain that matters',
    body: 'Every Talos cluster runs a 3-node etcd quorum. Three Technitium DNS instances sit behind a keepalived VIP with AXFR replication. Storage replication and LGTM HA are the named next steps — the map below is honest about what is and is not already redundant.',
  },
  {
    title: 'High availability on the hot path',
    body: 'Services self-heal via Kubernetes. The edge is split — internal and public traffic terminate on separate Envoy Gateways with their own IPs and policies. Per-cluster Cloudflare tunnels run with two replicas. Private PKI and observability are still single-instance and called out as such.',
  },
  {
    title: 'GitOps all the way down',
    body: 'Every change is a commit. ArgoCD reconciles workloads, Talos holds cluster state, Ansible holds host state. Rollbacks are a git revert and a webhook; production promotions go through an auto-generated PR a human still has to merge.',
  },
  {
    title: 'Multi-AZ by design',
    body: 'A secondary AZ is already wired via UniFi site-to-site VPN. DNS zones, cluster naming, and storage strategy all assume a second site — so when the second cluster stands up, nothing needs to be refactored.',
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
