import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { MetricComponent } from '../../shared/ui/metric.component';
import { ChipComponent } from '../../shared/ui/chip.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SectionComponent } from '../../shared/ui/section.component';
import { SeoService } from '../../shared/seo/seo.service';
import { PlatformStackDiagram } from './diagrams/platform-stack.diagram';
import { GitOpsFlowDiagram } from './diagrams/gitops-flow.diagram';
import { LAB_STATS, LAB_STACK } from '../../content/lab';
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
    SectionComponent,
    PlatformStackDiagram,
    GitOpsFlowDiagram,
  ],
  template: `
    <!-- HERO -->
    <section class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10 pt-20 md:pt-28 pb-8">
      <app-eyebrow label="/lab" index="03" />
      <h1
        appReveal
        class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
      >
        [/LAB HEADLINE]<br />
        <span class="text-accent">[emphasis phrase in accent color].</span>
      </h1>
      <p appReveal class="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        Three Talos Kubernetes clusters — core, dev, and prod — running on Proxmox
        hypervisors and bare-metal EliteDesks. Declarative from the metal up,
        delivered by GitOps, observed by a self-hosted LGTM stack. This site is
        served from it.
      </p>
    </section>

    <!-- METRIC BAND -->
    <section class="relative z-10 border-y border-crema/70 bg-cream-100/40 dark:border-roast-700 dark:bg-roast-900/40">
      <div class="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 md:px-10 py-14 md:grid-cols-3">
        @for (stat of stats; track stat.label) {
          <app-metric [value]="stat.value" [label]="stat.label" />
        }
      </div>
    </section>

    <!-- DIAGRAM 01 — PLATFORM STACK -->
    <app-section
      anchor="stack"
      eyebrow="Diagram 01"
      title="Five layers, one focal plane."
      index="01"
      kicker="Infrastructure → workloads"
    >
      <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
        [DIAGRAM 01 BLURB — 1–2 sentences framing what the stack shows. The
        diagram itself does most of the work; this is the caption.]
      </p>
      <div appReveal class="diagram-frame">
        <app-platform-stack-diagram />
      </div>
    </app-section>

    <!-- DIAGRAM 02 — GITOPS FLOW -->
    <app-section
      anchor="delivery"
      eyebrow="Diagram 02"
      title="How a commit becomes a pod."
      index="02"
      kicker="GitOps end-to-end"
    >
      <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
        Every app ships the same way. Push to main; GitHub Actions builds and
        publishes an image; a repository_dispatch tells the homelab repo to bump
        the tag; ArgoCD reconciles; Talos rolls. Prod promotions go through an
        auto-generated PR that a human still has to merge.
      </p>
      <div appReveal class="diagram-frame">
        <app-gitops-flow-diagram />
      </div>
    </app-section>

    <!-- NODE INVENTORY -->
    <app-section
      anchor="nodes"
      eyebrow="The roster"
      title="The hosts, sourced from Ansible inventory at build time."
      index="03"
      [kicker]="hostCountKicker"
    >
      <p appReveal class="mb-10 max-w-3xl font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
        Bare-metal Talos nodes are configured via <span class="font-mono">talosctl</span>
        rather than Ansible, so they show up in the clusters above but not below.
        This table is regenerated from
        <span class="font-mono">ansible/inventory/hosts.yml</span> on every build.
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
                <li class="flex items-center justify-between border-t border-crema/60 pt-1.5 first:border-0 first:pt-0 dark:border-roast-800">
                  <span class="text-ink-900 dark:text-foam">{{ host.hostname }}</span>
                  @if (host.address) {
                    <span class="tabular text-ink-500 dark:text-taupe-dim">{{ host.address }}</span>
                  }
                </li>
              }
            </ul>
          </article>
        }
      </div>
    </app-section>

    <!-- STACK BREAKDOWN -->
    <app-section
      anchor="stack-breakdown"
      eyebrow="Named tools"
      title="The stack, in words."
      index="04"
      kicker="Full named-service inventory"
    >
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
    </app-section>

    <!-- CTA OUT -->
    <section class="relative z-10">
      <div class="mx-auto w-full max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <div appReveal class="flex flex-col gap-8 border-t border-crema/70 pt-16 md:flex-row md:items-end md:justify-between dark:border-roast-700">
          <div class="max-w-xl flex flex-col gap-4">
            <app-eyebrow label="Keep reading" index="05" />
            <h2 class="font-display text-3xl md:text-4xl leading-tight tracking-tight text-ink-900 dark:text-foam">
              The lab is public on GitHub.
            </h2>
            <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
              Runbooks, ADRs, network topology, and the IaC that builds everything
              all live in the repo.
            </p>
          </div>
          <div class="flex flex-col items-start gap-3 md:items-end">
            <app-link-arrow href="https://github.com/TechGardenCode/kian.sh" [external]="true">
              github.com/TechGardenCode/kian.sh
            </app-link-arrow>
            <a routerLink="/projects" class="link-flourish label text-ink-700 dark:text-taupe">
              or the side projects →
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LabComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly stats = LAB_STATS;
  readonly stack = LAB_STACK;
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
