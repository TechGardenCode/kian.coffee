export interface LabStat {
  readonly value: string;
  readonly label: string;
}

export interface LabStackGroup {
  readonly heading: string;
  readonly note: string;
  readonly items: readonly string[];
}

// Every stat below is derivable from repo state — talos/clusters/ for the
// cluster count, ansible/inventory/hosts.yml for managed hosts, wiki
// network-topology.md for VLAN list.
export const LAB_STATS: readonly LabStat[] = [
  { value: '3', label: 'Talos clusters — core · dev · prod' },
  { value: '9', label: 'Kubernetes nodes across the three clusters' },
  { value: '3', label: 'bare-metal EliteDesks running prod' },
  { value: '13', label: 'Ansible-managed Linux hosts' },
  { value: '6', label: 'VLANs — mgmt · trusted · DMZ · IoT · guest · clients' },
];

export const LAB_STACK: readonly LabStackGroup[] = [
  {
    heading: 'Infrastructure',
    note: 'Physical hosts, hypervisor, networking',
    items: [
      'Proxmox VE',
      'HP EliteDesk 800 G4 (×3)',
      'Raspberry Pi (×2)',
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
      'update-image-tag.yml',
      'repository_dispatch',
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
      'Home Assistant',
      '*arr media suite',
    ],
  },
];
