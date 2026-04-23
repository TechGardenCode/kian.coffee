import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * HA redundancy map — a side-by-side inventory of what is already
 * redundant versus what is still a single point of failure. The right
 * column is the focal accent — that's the work ahead.
 *
 * Public-page safe: no AZ codes, no IPs, generic mitigation phrasing.
 */
@Component({
  selector: 'app-ha-redundancy-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 1000 500"
      role="img"
      aria-labelledby="ha-title ha-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="ha-title">HA redundancy map</title>
      <desc id="ha-desc">
        Left column lists services that are already redundant — DNS,
        Kubernetes control planes, Cloudflare tunnels, the dual-gateway
        edge. Right column is the work ahead — observability, storage,
        private PKI, and GitOps control plane — each with a mitigation
        path in flight.
      </desc>

      <!-- ============ Column headers ============ -->
      <text x="60" y="52" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.18em">STATUS TODAY</text>

      <!-- Left column header -->
      <rect x="60" y="68" width="420" height="44" rx="6" ry="6"
            fill="var(--dg-paper-2)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.9" />
      <text x="80" y="96" font-family="var(--font-sans)" font-size="14" font-weight="600"
            fill="var(--dg-ink)">Redundant today</text>
      <text x="460" y="96" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="end">×N MARKER</text>

      <!-- Right column header — FOCAL -->
      <rect x="520" y="68" width="420" height="44" rx="6" ry="6"
            fill="var(--dg-accent-tint)" stroke="var(--dg-accent)" stroke-width="1.2" />
      <circle cx="534" cy="90" r="3" fill="var(--dg-accent)" />
      <text x="548" y="96" font-family="var(--font-sans)" font-size="14" font-weight="600"
            fill="var(--dg-ink)">Single point of failure</text>
      <text x="920" y="96" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-accent-strong)" letter-spacing="0.10em" text-anchor="end">MITIGATION IN FLIGHT</text>

      <!-- ============ Left column — redundant services ============ -->
      <g>
        <rect x="60" y="132" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="155" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">Technitium DNS</text>
        <text x="240" y="155" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">keepalived VIP + AXFR replication</text>
        <rect x="440" y="142" width="28" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="454" y="154" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">×3</text>
      </g>

      <g>
        <rect x="60" y="176" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="199" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">talos-core · etcd quorum</text>
        <text x="300" y="199" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">control plane</text>
        <rect x="440" y="186" width="28" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="454" y="198" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">×3</text>
      </g>

      <g>
        <rect x="60" y="220" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="243" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">talos-dev · etcd quorum</text>
        <text x="296" y="243" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">control plane</text>
        <rect x="440" y="230" width="28" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="454" y="242" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">×3</text>
      </g>

      <g>
        <rect x="60" y="264" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="287" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">talos-prod · etcd quorum</text>
        <text x="304" y="287" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">bare-metal</text>
        <rect x="440" y="274" width="28" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="454" y="286" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">×3</text>
      </g>

      <g>
        <rect x="60" y="308" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="331" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">cloudflared · per cluster</text>
        <text x="296" y="331" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">outbound tunnels</text>
        <rect x="440" y="318" width="28" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="454" y="330" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">×2</text>
      </g>

      <g>
        <rect x="60" y="352" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="375" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">Split-gateway edge</text>
        <text x="272" y="375" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">eg-internal + eg-public</text>
        <rect x="428" y="362" width="44" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="450" y="374" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">split</text>
      </g>

      <g>
        <rect x="60" y="396" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-rule-solid)" stroke-width="0.8" />
        <text x="80" y="419" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">cert-manager + step-issuer</text>
        <text x="316" y="419" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)">K8s-managed</text>
        <rect x="412" y="406" width="60" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
        <text x="442" y="418" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-paper)" text-anchor="middle">self-heal</text>
      </g>

      <!-- ============ Right column — SPoFs with mitigations ============ -->
      <g>
        <rect x="520" y="132" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="0.8" opacity="0.92" />
        <text x="540" y="155" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">LGTM observability</text>
        <text x="696" y="155" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-accent-strong)">→ migrate to Kubernetes</text>
        <rect x="900" y="142" width="28" height="16" rx="3" ry="3"
              fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
        <text x="914" y="154" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-accent-strong)" text-anchor="middle">×1</text>
      </g>

      <g>
        <rect x="520" y="176" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="0.8" opacity="0.92" />
        <text x="540" y="199" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">Primary NAS</text>
        <text x="636" y="199" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-accent-strong)">→ async replication to second NAS</text>
        <rect x="900" y="186" width="28" height="16" rx="3" ry="3"
              fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
        <text x="914" y="198" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-accent-strong)" text-anchor="middle">×1</text>
      </g>

      <g>
        <rect x="520" y="220" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="0.8" opacity="0.92" />
        <text x="540" y="243" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">step-ca (private PKI)</text>
        <text x="704" y="243" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-accent-strong)">→ HA pair planned</text>
        <rect x="900" y="230" width="28" height="16" rx="3" ry="3"
              fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
        <text x="914" y="242" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-accent-strong)" text-anchor="middle">×1</text>
      </g>

      <g>
        <rect x="520" y="264" width="420" height="36" rx="4" ry="4"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="0.8" opacity="0.92" />
        <text x="540" y="287" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)">ArgoCD control plane</text>
        <text x="688" y="287" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-accent-strong)">→ run across multiple clusters</text>
        <rect x="900" y="274" width="28" height="16" rx="3" ry="3"
              fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
        <text x="914" y="286" font-family="var(--font-mono)" font-size="9" font-weight="600"
              fill="var(--dg-accent-strong)" text-anchor="middle">×1</text>
      </g>

      <!-- Summary callout for right column -->
      <rect x="520" y="320" width="420" height="112" rx="6" ry="6"
            fill="var(--dg-paper-2)" opacity="0.6" stroke="var(--dg-rule)" stroke-width="0.8" />
      <text x="540" y="348" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.14em">ROADMAP</text>
      <text x="540" y="372" font-family="var(--font-sans)" font-size="12" font-weight="500"
            fill="var(--dg-ink)">
        Each SPoF has a named next step,
      </text>
      <text x="540" y="392" font-family="var(--font-sans)" font-size="12" font-weight="500"
            fill="var(--dg-ink)">
        and multi-AZ replication behind it all.
      </text>
      <text x="540" y="420" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)">secondary AZ · site-to-site VPN · cross-AZ DNS</text>

      <!-- ============ Legend ============ -->
      <line x1="60" y1="456" x2="940" y2="456" stroke="var(--dg-rule)" stroke-width="0.8" />
      <text x="60" y="480" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-muted)" letter-spacing="0.18em">LEGEND</text>

      <rect x="180" y="470" width="28" height="16" rx="3" ry="3" fill="var(--dg-ink)" opacity="0.88" />
      <text x="194" y="482" font-family="var(--font-mono)" font-size="9" font-weight="600"
            fill="var(--dg-paper)" text-anchor="middle">×N</text>
      <text x="220" y="482" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">replica count · redundant</text>

      <rect x="480" y="470" width="28" height="16" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
      <text x="494" y="482" font-family="var(--font-mono)" font-size="9" font-weight="600"
            fill="var(--dg-accent-strong)" text-anchor="middle">×1</text>
      <text x="520" y="482" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">single instance · work in flight</text>
    </svg>
  `,
})
export class HaRedundancyDiagram {}
