import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Hardware topology — nested architecture diagram, three horizontal tiers
 * of physical hosts. Focal tier is the bare-metal prod band — the real
 * production hardware. Hypervisors and edge/storage are supporting tiers.
 *
 * Authored to the diagram-design skill spec: 4px grid, Geist sans for
 * host names, Geist Mono for technical sublabels, one focal tier, bottom
 * legend strip, ≤9 host nodes visible.
 */
@Component({
  selector: 'app-hardware-topology-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 1000 468"
      role="img"
      aria-labelledby="hw-title hw-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="hw-title">Hardware topology</title>
      <desc id="hw-desc">
        Three tiers of physical hosts — bare-metal prod (focal), Proxmox
        hypervisors, and edge plus storage. Each tier is independently
        sized for its role; bare-metal prod carries the production Talos
        control plane.
      </desc>

      <!-- ============ Outer container hairline ============ -->
      <rect
        x="60" y="32" width="880" height="340"
        rx="8" ry="8"
        fill="none"
        stroke="var(--dg-ink)"
        stroke-width="1"
        opacity="0.55"
      />

      <!-- ============ T1 — bare-metal prod (FOCAL) ============ -->
      <rect
        x="60" y="32" width="880" height="108"
        rx="8" ry="8"
        fill="var(--dg-accent-tint)"
        stroke="var(--dg-accent)"
        stroke-width="1.2"
      />
      <circle cx="72" cy="72" r="3" fill="var(--dg-accent)" />

      <text x="88" y="76" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-accent-strong)" letter-spacing="0.14em" font-weight="500">T1</text>
      <text x="88" y="100" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Bare-metal prod</text>
      <text x="88" y="120" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-muted)" letter-spacing="0.04em">talos-prod · control plane</text>

      <!-- Host nodes: ed-n1, ed-n2, ed-n3 -->
      <g>
        <rect x="440" y="60" width="140" height="52" rx="6" ry="6"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="1" />
        <text x="510" y="84" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">ed-n1</text>
        <text x="510" y="100" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">HP EliteDesk</text>

        <rect x="600" y="60" width="140" height="52" rx="6" ry="6"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="1" />
        <text x="670" y="84" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">ed-n2</text>
        <text x="670" y="100" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">HP EliteDesk</text>

        <rect x="760" y="60" width="140" height="52" rx="6" ry="6"
              fill="var(--dg-paper)" stroke="var(--dg-accent)" stroke-width="1" />
        <text x="830" y="84" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">ed-n3</text>
        <text x="830" y="100" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">HP EliteDesk</text>
      </g>

      <!-- ============ T2 — Hypervisors ============ -->
      <line x1="60" y1="140" x2="940" y2="140" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="140" width="880" height="108" fill="var(--dg-paper-2)" opacity="0.55" />

      <text x="88" y="184" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">T2</text>
      <text x="88" y="208" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Hypervisors</text>
      <text x="88" y="228" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-soft)" letter-spacing="0.04em">talos-core + talos-dev VMs</text>

      <g>
        <rect x="440" y="168" width="140" height="52" rx="6" ry="6"
              fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.85" />
        <text x="510" y="192" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">hx90</text>
        <text x="510" y="208" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">Minisforum HX90</text>

        <rect x="600" y="168" width="140" height="52" rx="6" ry="6"
              fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.85" />
        <text x="670" y="192" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">bd-n1</text>
        <text x="670" y="208" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">Minisforum BD795i</text>

        <rect x="760" y="168" width="140" height="52" rx="6" ry="6"
              fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.85" />
        <text x="830" y="192" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">bd-n2</text>
        <text x="830" y="208" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">Minisforum BD795i</text>
      </g>

      <!-- ============ T3 — Edge + storage ============ -->
      <line x1="60" y1="248" x2="940" y2="248" stroke="var(--dg-rule)" stroke-width="1" />
      <rect x="60" y="248" width="880" height="124" fill="var(--dg-paper)" />

      <text x="88" y="292" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" letter-spacing="0.14em">T3</text>
      <text x="88" y="316" font-family="var(--font-sans)" font-size="16" font-weight="600"
            fill="var(--dg-ink)">Edge + storage</text>
      <text x="88" y="336" font-family="var(--font-mono)" font-size="10"
            fill="var(--dg-soft)" letter-spacing="0.04em">DNS primary · edge LB · NAS ×2</text>

      <g>
        <rect x="360" y="280" width="124" height="52" rx="6" ry="6"
              fill="var(--dg-paper-2)" stroke="var(--dg-muted)" stroke-width="0.8" />
        <text x="422" y="304" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">rpi-n1</text>
        <text x="422" y="320" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">RPi 5 · DNS</text>

        <rect x="500" y="280" width="124" height="52" rx="6" ry="6"
              fill="var(--dg-paper-2)" stroke="var(--dg-muted)" stroke-width="0.8" />
        <text x="562" y="304" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">rpi-n2</text>
        <text x="562" y="320" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">RPi 5 · edge LB</text>

        <rect x="660" y="280" width="124" height="52" rx="6" ry="6"
              fill="var(--dg-paper-2)" stroke="var(--dg-muted)" stroke-width="0.8" />
        <text x="722" y="304" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">cm-nas</text>
        <text x="722" y="320" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">TrueNAS</text>

        <rect x="800" y="280" width="124" height="52" rx="6" ry="6"
              fill="var(--dg-paper-2)" stroke="var(--dg-muted)" stroke-width="0.8" />
        <text x="862" y="304" font-family="var(--font-sans)" font-size="12" font-weight="600"
              fill="var(--dg-ink)" text-anchor="middle">jb-nas</text>
        <text x="862" y="320" font-family="var(--font-mono)" font-size="9"
              fill="var(--dg-soft)" text-anchor="middle">TrueNAS</text>
      </g>

      <!-- ============ Legend ============ -->
      <line x1="60" y1="404" x2="940" y2="404" stroke="var(--dg-rule)" stroke-width="0.8" />
      <text x="60" y="428" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-muted)" letter-spacing="0.18em">LEGEND</text>

      <rect x="220" y="418" width="24" height="16" rx="3" ry="3"
            fill="var(--dg-accent-tint)" stroke="var(--dg-accent)" stroke-width="1" />
      <text x="256" y="430" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">focal tier — production</text>

      <rect x="500" y="418" width="24" height="16" rx="3" ry="3"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.7" />
      <text x="536" y="430" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">supporting tier</text>

      <text x="940" y="428" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="end">
        HARDWARE: redundancy by tier, not by host
      </text>
    </svg>
  `,
})
export class HardwareTopologyDiagram {}
