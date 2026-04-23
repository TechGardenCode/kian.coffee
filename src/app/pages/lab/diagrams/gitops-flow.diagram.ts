import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * GitOps deployment flow — architecture type, authored to the diagram-design
 * skill's spec: 6 nodes (≤9 budget), 6 arrows (≤12), one focal node
 * (ArgoCD), one async dashed arrow. Semantic node treatments + CSS
 * custom properties for theming.
 *
 * Flow:
 *   Row 1:  push  →  GH Actions  →  ghcr.io
 *                        ↓
 *   Row 2:         dispatch  →  ArgoCD*  →  Talos prod
 *                                              ⇡ image pull (async)
 */
@Component({
  selector: 'app-gitops-flow-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 920 380"
      role="img"
      aria-labelledby="gitops-title gitops-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="gitops-title">GitOps deployment flow</title>
      <desc id="gitops-desc">
        A code push triggers GitHub Actions, which builds and publishes a
        container image to ghcr.io and dispatches an image-tag update to the
        homelab repo. ArgoCD notices the commit and syncs the Talos prod
        cluster, which pulls the new image.
      </desc>

      <!-- ============ Arrow markers — default (muted) + dashed-async ============ -->
      <defs>
        <marker id="arrow-muted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-muted)" />
        </marker>
        <marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-accent)" />
        </marker>
      </defs>

      <!-- ============ Arrows drawn BEFORE boxes so z-order keeps them behind nodes ============ -->

      <!-- 1. push → Actions -->
      <line x1="220" y1="84" x2="260" y2="84"
            stroke="var(--dg-muted)" stroke-width="1"
            marker-end="url(#arrow-muted)" />

      <!-- 2. Actions → ghcr.io   (label: BUILD) -->
      <line x1="428" y1="84" x2="468" y2="84"
            stroke="var(--dg-muted)" stroke-width="1"
            marker-end="url(#arrow-muted)" />
      <rect x="432" y="64" width="32" height="12" rx="2" ry="2" fill="var(--dg-paper-2)" />
      <text x="448" y="72" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="middle">BUILD</text>

      <!-- 3. Actions → dispatch (vertical down)  (label: DISPATCH) -->
      <line x1="348" y1="112" x2="348" y2="216"
            stroke="var(--dg-muted)" stroke-width="1"
            marker-end="url(#arrow-muted)" />
      <rect x="324" y="156" width="64" height="12" rx="2" ry="2" fill="var(--dg-paper-2)" />
      <text x="356" y="164" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="middle">DISPATCH</text>

      <!-- 4. dispatch → ArgoCD  (label: COMMIT) -->
      <line x1="428" y1="252" x2="468" y2="252"
            stroke="var(--dg-muted)" stroke-width="1"
            marker-end="url(#arrow-muted)" />
      <rect x="430" y="232" width="44" height="12" rx="2" ry="2" fill="var(--dg-paper-2)" />
      <text x="451" y="243" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="middle">COMMIT</text>

      <!-- 5. ArgoCD → Talos  (label: SYNC, accent) -->
      <line x1="636" y1="252" x2="676" y2="252"
            stroke="var(--dg-accent)" stroke-width="1.2"
            marker-end="url(#arrow-accent)" />
      <rect x="638" y="234" width="32" height="12" rx="2" ry="2" fill="var(--dg-paper-2)" />
      <text x="654" y="243" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-accent-strong)" letter-spacing="0.10em" text-anchor="middle">SYNC</text>

      <!-- 6. ghcr.io ⇢ Talos (dashed async image pull) -->
      <path d="M 636 100 Q 760 100 760 224"
            fill="none"
            stroke="var(--dg-muted)" stroke-width="1"
            stroke-dasharray="5,4"
            marker-end="url(#arrow-muted)" />
      <rect x="720" y="152" width="44" height="12" rx="2" ry="2" fill="var(--dg-paper-2)" />
      <text x="742" y="160" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="middle">PULL</text>

      <!-- ============ Nodes — Row 1 ============ -->

      <!-- push (input) -->
      <rect x="60" y="56" width="160" height="56" rx="6" ry="6"
            fill="var(--dg-paper-2)" stroke="var(--dg-soft)" stroke-width="1" />
      <rect x="68" y="62" width="32" height="12" rx="2" ry="2"
            fill="none" stroke="var(--dg-soft)" stroke-width="0.8" />
      <text x="84" y="71" font-family="var(--font-mono)" font-size="7"
            fill="var(--dg-soft)" letter-spacing="0.12em" text-anchor="middle">INPUT</text>
      <text x="140" y="92" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">Code push</text>
      <text x="140" y="106" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">main · any app repo</text>

      <!-- GitHub Actions (step / backend) -->
      <rect x="260" y="56" width="168" height="56" rx="6" ry="6"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="1" />
      <rect x="268" y="62" width="36" height="12" rx="2" ry="2"
            fill="none" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.45" />
      <text x="286" y="71" font-family="var(--font-mono)" font-size="7"
            fill="var(--dg-muted)" letter-spacing="0.12em" text-anchor="middle">STEP</text>
      <text x="344" y="92" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">GitHub Actions</text>
      <text x="344" y="106" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">deployment.yml</text>

      <!-- ghcr.io (store) -->
      <rect x="468" y="56" width="168" height="56" rx="6" ry="6"
            fill="var(--dg-paper-2)" stroke="var(--dg-muted)" stroke-width="1" />
      <rect x="476" y="62" width="36" height="12" rx="2" ry="2"
            fill="none" stroke="var(--dg-muted)" stroke-width="0.8" opacity="0.55" />
      <text x="494" y="71" font-family="var(--font-mono)" font-size="7"
            fill="var(--dg-muted)" letter-spacing="0.12em" text-anchor="middle">STORE</text>
      <text x="552" y="92" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">ghcr.io</text>
      <text x="552" y="106" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">image registry</text>

      <!-- ============ Nodes — Row 2 ============ -->

      <!-- dispatch (step) -->
      <rect x="260" y="224" width="168" height="56" rx="6" ry="6"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="1" />
      <rect x="268" y="230" width="36" height="12" rx="2" ry="2"
            fill="none" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.45" />
      <text x="286" y="239" font-family="var(--font-mono)" font-size="7"
            fill="var(--dg-muted)" letter-spacing="0.12em" text-anchor="middle">STEP</text>
      <text x="344" y="260" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">image-tag dispatch</text>
      <text x="344" y="274" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">→ homelab repo</text>

      <!-- ArgoCD (FOCAL) -->
      <rect x="468" y="224" width="168" height="56" rx="6" ry="6"
            fill="var(--dg-accent-tint)" stroke="var(--dg-accent)" stroke-width="1.2" />
      <rect x="476" y="230" width="36" height="12" rx="2" ry="2"
            fill="none" stroke="var(--dg-accent)" stroke-width="0.8" />
      <text x="494" y="239" font-family="var(--font-mono)" font-size="7"
            fill="var(--dg-accent-strong)" letter-spacing="0.12em" text-anchor="middle">FOCAL</text>
      <text x="552" y="260" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">ArgoCD</text>
      <text x="552" y="274" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">watches · reconciles</text>

      <!-- Talos prod (backend) -->
      <rect x="676" y="224" width="168" height="56" rx="6" ry="6"
            fill="var(--dg-paper)" stroke="var(--dg-ink)" stroke-width="1" />
      <rect x="684" y="230" width="36" height="12" rx="2" ry="2"
            fill="none" stroke="var(--dg-ink)" stroke-width="0.8" opacity="0.45" />
      <text x="702" y="239" font-family="var(--font-mono)" font-size="7"
            fill="var(--dg-muted)" letter-spacing="0.12em" text-anchor="middle">STEP</text>
      <text x="760" y="260" font-family="var(--font-sans)" font-size="12" font-weight="600"
            fill="var(--dg-ink)" text-anchor="middle">Talos prod</text>
      <text x="760" y="274" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-soft)" text-anchor="middle">3× bare-metal · rolling</text>

      <!-- ============ Legend strip ============ -->
      <line x1="60" y1="316" x2="860" y2="316"
            stroke="var(--dg-rule)" stroke-width="0.8" />
      <text x="60" y="340" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-muted)" letter-spacing="0.18em">LEGEND</text>

      <!-- focal -->
      <rect x="160" y="328" width="18" height="14" rx="3" ry="3"
            fill="var(--dg-accent-tint)" stroke="var(--dg-accent)" stroke-width="1" />
      <text x="186" y="340" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">focal</text>

      <!-- default flow arrow -->
      <line x1="244" y1="335" x2="276" y2="335"
            stroke="var(--dg-muted)" stroke-width="1"
            marker-end="url(#arrow-muted)" />
      <text x="284" y="340" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">flow</text>

      <!-- accent arrow -->
      <line x1="336" y1="335" x2="368" y2="335"
            stroke="var(--dg-accent)" stroke-width="1.2"
            marker-end="url(#arrow-accent)" />
      <text x="376" y="340" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">primary</text>

      <!-- dashed async -->
      <line x1="438" y1="335" x2="470" y2="335"
            stroke="var(--dg-muted)" stroke-width="1"
            stroke-dasharray="5,4"
            marker-end="url(#arrow-muted)" />
      <text x="478" y="340" font-family="var(--font-mono)" font-size="9"
            fill="var(--dg-muted)" letter-spacing="0.04em">async</text>

      <text x="860" y="340" font-family="var(--font-mono)" font-size="8"
            fill="var(--dg-soft)" letter-spacing="0.10em" text-anchor="end">
        SOURCE OF TRUTH: app CI + homelab GitOps repo
      </text>
    </svg>
  `,
})
export class GitOpsFlowDiagram {}
