import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Platform stack diagram — layer-stack type, authored to the diagram-design
 * skill's spec (4px grid, ≤6 layers, one focal layer, semantic colors via
 * CSS custom properties so light/dark both adapt automatically).
 *
 * Layers (bottom → top abstraction):
 *   L1 Infrastructure    — Proxmox hosts + bare-metal
 *   L2 Operating system  — Talos Linux
 *   L3 Kubernetes        — 3 clusters
 *   L4 Platform services — FOCAL (GitOps, edge, certs, DB, cache, observability)
 *   L5 Workloads         — techgarden.gg apps + game servers
 */
@Component({
  selector: 'app-platform-stack-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 1000 488"
      role="img"
      aria-labelledby="stack-title stack-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="stack-title">Homelab platform stack</title>
      <desc id="stack-desc">
        Five abstraction layers from bare-metal infrastructure up to application
        workloads. Platform services layer is highlighted as the focal layer —
        the cloud-native plane that ties everything together.
      </desc>

      <!-- ============ Outer container hairline ============ -->
      <rect
        x="60" y="32" width="880" height="320"
        rx="8" ry="8"
        fill="none"
        stroke="var(--dg-ink)"
        stroke-width="1"
        opacity="0.55"
      />

      <!-- ============ L1 — Infrastructure ============ -->
      <rect x="60" y="32" width="880" height="64" rx="8" ry="8" fill="var(--dg-paper)" />
      <!-- top radius clip: paint flat rect over bottom half so only the top corners are rounded; skipped for simplicity — corners are only visible on first/last layer -->

      <text x="88" y="70" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">L1</text>
      <text x="180" y="70" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Infrastructure</text>
      <text x="180" y="86" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-soft)" letter-spacing="0.04em">physical · hypervisor</text>
      <text x="916" y="70" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em" text-anchor="end">
        3× Proxmox · 3× bare-metal EliteDesks
      </text>
      <text x="916" y="86" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em" text-anchor="end">
        + 2× RPi edge · 2× NAS
      </text>

      <!-- ============ L2 — Operating system ============ -->
      <line x1="60" y1="96" x2="940" y2="96" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="96" width="880" height="64" fill="var(--dg-paper-2)" opacity="0.55" />

      <text x="88" y="134" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">L2</text>
      <text x="180" y="134" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Operating system</text>
      <text x="180" y="150" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-soft)" letter-spacing="0.04em">immutable · minimal</text>
      <text x="916" y="134" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em" text-anchor="end">
        Talos Linux — API-driven, no SSH
      </text>

      <!-- ============ L3 — Kubernetes ============ -->
      <line x1="60" y1="160" x2="940" y2="160" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="160" width="880" height="64" fill="var(--dg-paper)" />

      <text x="88" y="198" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">L3</text>
      <text x="180" y="198" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Kubernetes</text>
      <text x="180" y="214" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-soft)" letter-spacing="0.04em">clusters · MetalLB L2</text>
      <text x="916" y="198" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em" text-anchor="end">
        core · dev · prod — 9 control/worker nodes
      </text>

      <!-- ============ L4 — Platform services (FOCAL) ============ -->
      <line x1="60" y1="224" x2="940" y2="224" stroke="var(--dg-rule)" stroke-width="1" />
      <rect
        x="60" y="224" width="880" height="64"
        fill="var(--dg-accent-tint)"
        stroke="var(--dg-accent)"
        stroke-width="1.2"
      />
      <!-- Focal marker: small circle left of the index to signal "this is the layer" -->
      <circle cx="72" cy="256" r="3" fill="var(--dg-accent)" />

      <text x="88" y="262" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-accent-strong)" letter-spacing="0.14em" font-weight="500">L4</text>
      <text x="180" y="262" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Platform services</text>
      <text x="180" y="278" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em">the cloud-native plane</text>
      <text x="916" y="262" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em" text-anchor="end">
        ArgoCD · Envoy GW · cert-manager · CNPG
      </text>
      <text x="916" y="278" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em" text-anchor="end">
        external-dns · Dragonfly · LGTM observability
      </text>

      <!-- ============ L5 — Workloads ============ -->
      <line x1="60" y1="288" x2="940" y2="288" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="288" width="880" height="64" fill="var(--dg-paper-2)" opacity="0.55" />

      <text x="88" y="326" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">L5</text>
      <text x="180" y="326" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Workloads</text>
      <text x="180" y="342" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-soft)" letter-spacing="0.04em">apps · services · game servers</text>
      <text x="916" y="326" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em" text-anchor="end">
        kian.coffee · techgarden.gg · Hausparty · Pelican
      </text>

      <!-- (direction indicator removed — L1–L5 indices already signal bottom-up abstraction) -->

      <!-- ============ Legend ============ -->
      <line x1="60" y1="400" x2="940" y2="400" stroke="var(--dg-rule)" stroke-width="0.8" />
      <text x="60" y="424" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-muted)" letter-spacing="0.18em">LEGEND</text>

      <!-- Focal marker sample -->
      <rect x="220" y="414" width="24" height="16" rx="3" ry="3"
            fill="var(--dg-accent-tint)" stroke="var(--dg-accent)" stroke-width="1" />
      <text x="256" y="426" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">focal layer</text>

      <!-- Non-focal sample -->
      <rect x="400" y="414" width="24" height="16" rx="3" ry="3"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.7" />
      <text x="436" y="426" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">abstraction layer</text>

      <!-- Rendered-from note -->
      <text x="940" y="424" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="end">
        SOURCE OF TRUTH: declarative inventory + cluster configs
      </text>

      <!-- ============ Separator before legend already above; nothing else ============ -->

    </svg>
  `,
})
export class PlatformStackDiagram {}
