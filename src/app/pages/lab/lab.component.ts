import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  KcPageMarketing,
  KcPageHero,
  KcPageSection,
  KcPageBand,
  KcPageFooterCta,
} from '@kian.coffee/beans';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { MetricComponent } from '../../shared/ui/metric.component';
import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { PlatformStackDiagram } from './diagrams/platform-stack.diagram';
import { GitOpsFlowDiagram } from './diagrams/gitops-flow.diagram';
import { HardwareTopologyDiagram } from './diagrams/hardware-topology.diagram';
import { NetworkTopologyDiagram } from './diagrams/network-topology.diagram';
import { HaRedundancyDiagram } from './diagrams/ha-redundancy.diagram';
import { LAB_STATS, LAB_STACK, LAB_PRINCIPLES } from '../../content/lab';
import { LAB_HOST_GROUPS, LAB_HOST_COUNT } from '../../content/lab.generated';

@Component({
  selector: 'app-lab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RevealDirective,
    EyebrowComponent,
    MetricComponent,
    ChipComponent,
    LinkArrowComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
    KcPageBand,
    KcPageFooterCta,
    PlatformStackDiagram,
    GitOpsFlowDiagram,
    HardwareTopologyDiagram,
    NetworkTopologyDiagram,
    HaRedundancyDiagram,
  ],
  template: `
    <kc-page-marketing>
      <kc-page-hero>
        <app-eyebrow label="/lab" index="03" />
        <h1
          appReveal
          class="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
        >
          The rack under the desk,<br />
          <span class="text-accent">run like a cloud provider.</span>
        </h1>
        <p appReveal class="max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
          Three Talos Kubernetes clusters — core, dev, and prod — with a
          fourth prod cluster planned for a second AZ. Every cluster runs
          a 3-node etcd quorum. Three Technitium DNS instances sit behind
          a keepalived VIP. The edge is split into internal and public
          Envoy Gateways. Declarative from the metal up, delivered by
          GitOps, observed by a self-hosted LGTM stack. This site is
          served from it.
        </p>
      </kc-page-hero>

      <!-- STATUS CALLOUT — secondary AZ offline during site move -->
      <section class="kc-container kc-container--md pb-4 relative z-10">
        <div
          appReveal
          role="status"
          class="flex items-start gap-4 rounded-xl border border-accent/50 bg-accent/5 p-5 dark:border-accent/40 dark:bg-accent/10"
        >
          <span aria-hidden="true" class="mt-0.5 text-accent">●</span>
          <div class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            <strong class="text-ink-900 dark:text-foam">The secondary AZ is offline.</strong>
            Hardware is mid-move between sites, so production is running
            single-AZ until it's back. Stats, diagrams, and principles
            below describe the current state alongside the multi-AZ plan.
          </div>
        </div>
      </section>

      <kc-page-band variant="metric">
        @for (stat of stats; track stat.label) {
          <app-metric [value]="stat.value" [label]="stat.label" />
        }
      </kc-page-band>

      <kc-page-section
        anchor="directions"
        title="Architecture directions."
        kicker="Four things the lab is designed around"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="How it's designed" index="01" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Four design principles run through the lab. The rest of the page
          shows how each one is wired up.
        </p>
        <div appReveal class="grid gap-6 md:grid-cols-2">
          @for (principle of principles; track principle.title) {
            <article class="rounded-xl border border-crema/80 bg-cream-100/40 p-6 dark:border-roast-700 dark:bg-roast-900/40">
              <h3 class="font-display text-xl text-ink-900 dark:text-foam mb-3">{{ principle.title }}</h3>
              <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
                {{ principle.body }}
              </p>
            </article>
          }
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="stack"
        title="Five layers, one focal plane."
        kicker="Infrastructure → workloads"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="Diagram 01" index="02" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Five layers between bare metal and a running pod. Every one of them
          is boring, which is the point. Adding a new app on top barely touches
          the stack below.
        </p>
        <div appReveal class="diagram-frame">
          <app-platform-stack-diagram />
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="delivery"
        title="How a commit becomes a pod."
        kicker="GitOps end-to-end"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="Diagram 02" index="03" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Every app ships the same way. Push to main; CI builds and publishes
          an image; a dispatch event tells the homelab repo to bump the tag;
          ArgoCD reconciles; Talos rolls. Prod promotions go through an
          auto-generated PR that a human still has to merge.
        </p>
        <div appReveal class="diagram-frame">
          <app-gitops-flow-diagram />
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="hardware"
        title="What runs where, physically."
        kicker="Three tiers · one production line today"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="Diagram 03" index="04" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Three tiers of physical compute. Production runs directly on
          bare-metal EliteDesks, so there's no hypervisor in the critical
          path. The Proxmox hosts carry the core and dev clusters as VMs.
          Edge services (DNS, load balancer) and storage run on Raspberry
          Pis and TrueNAS boxes. The second AZ's bare-metal tier will
          mirror this tier once the hardware move completes.
        </p>
        <div appReveal class="diagram-frame">
          <app-hardware-topology-diagram />
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="network"
        title="Six VLANs, one firewall."
        kicker="Segmentation by trust tier"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="Diagram 04" index="05" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Web traffic arrives only through an outbound-only Cloudflare Tunnel;
          there are no inbound port forwards for any HTTP service. Six VLANs
          segment by trust tier. The firewall denies between tiers by default,
          with explicit allows where they're required (Trusted Clients →
          Servers, plus a few IoT exceptions).
        </p>
        <div appReveal class="diagram-frame">
          <app-network-topology-diagram />
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="ha"
        title="What's replicated, what isn't (yet)."
        kicker="Redundant today vs. single-instance today"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="Diagram 05" index="06" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Reliability work is never done. Left column is what's already
          redundant; right column is what still runs as a single instance,
          and the next step queued up for each one.
        </p>
        <div appReveal class="diagram-frame">
          <app-ha-redundancy-diagram />
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="nodes"
        title="The hosts, dynamically generated from the homelab's inventory."
        [kicker]="hostCountKicker"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="The roster" index="07" />
        <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
          Bare-metal Talos nodes are configured declaratively via
          <span class="font-mono">talosctl</span>, so they appear in the
          cluster topology above but not in this host roster. The roster below
          is dynamically generated from the homelab's source-of-truth
          inventory — it reflects whatever is currently deployed.
        </p>

        <div appReveal class="grid gap-6 md:grid-cols-2">
          @for (group of hostGroups; track group.id) {
            <article class="rounded-xl border border-crema/80 bg-cream-100/40 p-6 dark:border-roast-700 dark:bg-roast-900/40">
              <div class="flex items-baseline justify-between gap-4 mb-3">
                <h3 class="font-display text-xl text-ink-900 dark:text-foam">{{ group.label }}</h3>
                <span class="label-sm text-ink-700 dark:text-taupe">{{ group.hosts.length }}× {{ group.id }}</span>
              </div>
              <p class="font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe mb-4">
                {{ group.description }}
              </p>
              <ul class="flex flex-col gap-1 font-mono text-[12px] text-ink-700 dark:text-taupe">
                @for (host of group.hosts; track host.hostname) {
                  <li class="border-t border-crema/60 pt-1.5 first:border-0 first:pt-0 dark:border-roast-800">
                    <span class="text-ink-900 dark:text-foam">{{ host.hostname }}</span>
                  </li>
                }
              </ul>
            </article>
          }
        </div>
      </kc-page-section>

      <kc-page-section
        anchor="stack-breakdown"
        title="The stack, in words."
        kicker="Full named-service inventory"
        headRule
      >
        <app-eyebrow slot="eyebrow" label="Named tools" index="08" />
        <div class="grid gap-10 md:grid-cols-2">
          @for (group of stack; track group.heading) {
            <div appReveal class="flex flex-col gap-3">
              <h3 class="font-display text-xl text-ink-900 dark:text-foam">{{ group.heading }}</h3>
              <p class="font-sans text-sm leading-relaxed text-ink-700 dark:text-taupe max-w-prose">
                {{ group.note }}
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                @for (item of group.items; track item) {
                  <app-chip>{{ item }}</app-chip>
                }
              </div>
            </div>
          }
        </div>
      </kc-page-section>

      <kc-page-footer-cta>
        <div slot="prose" appReveal class="max-w-xl flex flex-col gap-4">
          <app-eyebrow label="Keep reading" index="09" />
          <h2 class="font-display text-3xl md:text-4xl leading-tight tracking-tight text-ink-900 dark:text-foam">
            The homelab repo is public on GitHub.
          </h2>
          <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            Every K8s manifest, ArgoCD Application, and GitOps workflow that
            ships a deploy lives there.
          </p>
        </div>
        <ng-container slot="arrows">
          <app-link-arrow href="https://github.com/TechGardenCode/homelab" [external]="true">
            github.com/TechGardenCode/homelab
          </app-link-arrow>
          <a routerLink="/projects" class="link-flourish label text-ink-700 dark:text-taupe">
            or the side projects →
          </a>
        </ng-container>
      </kc-page-footer-cta>
    </kc-page-marketing>
  `,
})
export class LabComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly stats = LAB_STATS;
  readonly stack = LAB_STACK;
  readonly principles = LAB_PRINCIPLES;
  readonly hostGroups = LAB_HOST_GROUPS;
  readonly hostCountKicker = `${LAB_HOST_COUNT} Ansible-managed hosts`;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Lab',
      description:
        'The homelab — three Talos Kubernetes clusters on Proxmox hypervisors and bare-metal EliteDesks, delivered by GitOps, observed by a self-hosted LGTM stack. This site is served from it.',
      path: '/lab',
    });
  }
}
