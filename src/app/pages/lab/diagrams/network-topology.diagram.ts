import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Network topology — VLAN segmentation with firewall posture.
 *
 * Six VLANs stacked as rows; each row shows purpose + policy. Focal row is
 * Servers (Trusted) — every app terminates there. Public access arrives
 * only via outbound-only Cloudflare Tunnel; inbound port-forwards are
 * deliberately absent.
 *
 * Authored to the diagram-design skill spec. Public-page safe: no CIDRs,
 * no IP ranges, no VIPs — posture over addresses.
 */
@Component({
  selector: 'app-network-topology-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 1000 548"
      role="img"
      aria-labelledby="net-title net-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="net-title">Network topology and VLAN posture</title>
      <desc id="net-desc">
        Six VLANs segmented by trust tier. Public traffic arrives only via
        outbound-only Cloudflare Tunnel — no inbound port forwards. Servers
        (Trusted) is the focal tier; Trusted Clients can reach it, Untrusted
        Servers and IoT cannot.
      </desc>

      <defs>
        <marker id="net-arrow-muted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-muted)" />
        </marker>
        <marker id="net-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-accent)" />
        </marker>
      </defs>

      <!-- ============ Top: Internet → Cloudflare Tunnel → edge firewall ============ -->
      <text x="60" y="48" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">UPSTREAM</text>

      <rect x="60" y="60" width="160" height="48" rx="6" ry="6"
            fill="var(--dg-paper-2)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.85" />
      <text x="140" y="82" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">Internet</text>
      <text x="140" y="98" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">web: tunnel only</text>

      <!-- dashed outbound tunnel arrow -->
      <line x1="224" y1="84" x2="316" y2="84"
            stroke="var(--dg-muted)" stroke-width="1" stroke-dasharray="5,4"
            marker-end="url(#net-arrow-muted)" />
      <rect x="236" y="68" width="72" height="12" rx="2" ry="2" fill="var(--dg-paper)" />
      <text x="272" y="77" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="middle">OUTBOUND ONLY</text>

      <rect x="320" y="60" width="200" height="48" rx="6" ry="6"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="1" />
      <text x="420" y="82" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">Cloudflare Tunnel</text>
      <text x="420" y="98" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">cloudflared · 2 replicas/cluster</text>

      <line x1="524" y1="84" x2="616" y2="84"
            stroke="var(--dg-muted)" stroke-width="1"
            marker-end="url(#net-arrow-muted)" />

      <rect x="620" y="60" width="180" height="48" rx="6" ry="6"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="1" />
      <text x="710" y="82" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">Edge firewall</text>
      <text x="710" y="98" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">deny-by-default between tiers</text>

      <!-- vertical join from edge firewall into VLAN stack -->
      <line x1="710" y1="108" x2="710" y2="140"
            stroke="var(--dg-muted)" stroke-width="1" />

      <!-- ============ VLAN stack ============ -->
      <rect
        x="60" y="140" width="880" height="336"
        rx="8" ry="8"
        fill="none"
        stroke="var(--dg-ink)"
        stroke-width="1"
        opacity="0.55"
      />

      <!-- Row 1: Management -->
      <rect x="60" y="140" width="880" height="52" fill="var(--dg-paper)" />
      <text x="88" y="168" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">VLAN</text>
      <text x="152" y="168" font-family="var(--font-sans)" font-size="13" font-weight="600"
            fill="var(--dg-ink)">Management</text>
      <text x="152" y="184" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em">hypervisors · switches · admin only</text>
      <rect x="800" y="156" width="120" height="20" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-muted)" stroke-width="0.8" />
      <text x="860" y="170" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.10em" text-anchor="middle">ISOLATED</text>

      <!-- Row 2: Trusted Clients -->
      <line x1="60" y1="192" x2="940" y2="192" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="192" width="880" height="52" fill="var(--dg-paper-2)" opacity="0.55" />
      <text x="88" y="220" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">VLAN</text>
      <text x="152" y="220" font-family="var(--font-sans)" font-size="13" font-weight="600"
            fill="var(--dg-ink)">Trusted Clients</text>
      <text x="152" y="236" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em">personal devices · laptops · phones</text>
      <rect x="800" y="208" width="120" height="20" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
      <text x="860" y="222" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-accent-strong)" letter-spacing="0.10em" text-anchor="middle">ALLOW → SERVERS</text>

      <!-- Row 3: Servers (Trusted) — FOCAL -->
      <line x1="60" y1="244" x2="940" y2="244" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="244" width="880" height="60"
            fill="var(--dg-accent-tint)" stroke="var(--dg-accent)" stroke-width="1.2" />
      <circle cx="72" cy="274" r="3" fill="var(--dg-accent)" />
      <text x="88" y="276" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-accent-strong)" letter-spacing="0.14em" font-weight="500">VLAN</text>
      <text x="152" y="276" font-family="var(--font-sans)" font-size="13" font-weight="600"
            fill="var(--dg-ink)">Servers (Trusted)</text>
      <text x="152" y="292" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">talos core · dev · prod · NAS · observability</text>
      <rect x="800" y="262" width="120" height="20" rx="3" ry="3"
            fill="var(--dg-accent)" opacity="0.92" />
      <text x="860" y="276" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-paper)" letter-spacing="0.10em" text-anchor="middle" font-weight="600">FOCAL</text>

      <!-- Row 4: Servers (Untrusted) -->
      <line x1="60" y1="304" x2="940" y2="304" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="304" width="880" height="52" fill="var(--dg-paper-2)" opacity="0.55" />
      <text x="88" y="332" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">VLAN</text>
      <text x="152" y="332" font-family="var(--font-sans)" font-size="13" font-weight="600"
            fill="var(--dg-ink)">Servers (Untrusted)</text>
      <text x="152" y="348" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em">game servers · direct port-forward path (bypasses K8s)</text>
      <rect x="800" y="320" width="120" height="20" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-muted)" stroke-width="0.8" stroke-dasharray="4,3" />
      <text x="860" y="334" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.10em" text-anchor="middle">DENY → SERVERS</text>

      <!-- Row 5: Guest -->
      <line x1="60" y1="356" x2="940" y2="356" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="356" width="880" height="52" fill="var(--dg-paper)" />
      <text x="88" y="384" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">VLAN</text>
      <text x="152" y="384" font-family="var(--font-sans)" font-size="13" font-weight="600"
            fill="var(--dg-ink)">Guest</text>
      <text x="152" y="400" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em">visitors · internet-only</text>
      <rect x="800" y="372" width="120" height="20" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-muted)" stroke-width="0.8" stroke-dasharray="4,3" />
      <text x="860" y="386" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.10em" text-anchor="middle">DENY → LAN</text>

      <!-- Row 6: IoT -->
      <line x1="60" y1="408" x2="940" y2="408" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="408" width="880" height="56" fill="var(--dg-paper-2)" opacity="0.55" />
      <text x="88" y="436" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">VLAN</text>
      <text x="152" y="436" font-family="var(--font-sans)" font-size="13" font-weight="600"
            fill="var(--dg-ink)">IoT</text>
      <text x="152" y="452" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.04em">smart-home devices · explicit exceptions only</text>
      <rect x="800" y="424" width="120" height="20" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-muted)" stroke-width="0.8" stroke-dasharray="4,3" />
      <text x="860" y="438" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.10em" text-anchor="middle">DENY + EXCEPT</text>

      <!-- ============ Legend ============ -->
      <line x1="60" y1="492" x2="940" y2="492" stroke="var(--dg-rule)" stroke-width="0.8" />
      <text x="60" y="516" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-muted)" letter-spacing="0.18em">LEGEND</text>

      <rect x="180" y="506" width="24" height="16" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-accent)" stroke-width="0.8" />
      <text x="216" y="518" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">allow</text>

      <rect x="300" y="506" width="24" height="16" rx="3" ry="3"
            fill="transparent" stroke="var(--dg-muted)" stroke-width="0.8" stroke-dasharray="4,3" />
      <text x="336" y="518" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">deny (firewall)</text>

      <rect x="480" y="506" width="24" height="16" rx="3" ry="3"
            fill="var(--dg-accent)" opacity="0.92" />
      <text x="516" y="518" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">focal VLAN</text>

      <text x="940" y="516" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="end">
        POLICY: posture, not addresses
      </text>
    </svg>
  `,
})
export class NetworkTopologyDiagram {}
