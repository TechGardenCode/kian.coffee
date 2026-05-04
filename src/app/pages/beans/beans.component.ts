import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  KcPageMarketing,
  KcPageHero,
  KcPageSection,
  KcPageAnchorNav,
  type KcPageAnchorNavSection,
} from '@kian.coffee/beans';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { SeoService } from '../../shared/seo/seo.service';
import { BeansFoundationsComponent } from './sections/foundations.component';
import { BeansComponentsComponent } from './sections/components.component';
import { BeansBehaviorsComponent } from './sections/behaviors.component';
import { BeansTemplatesComponent } from './sections/templates.component';
import { BeansAuditComponent } from './sections/audit.component';
import { BeansIntroComponent } from './sections/intro.component';

const SECTIONS: readonly KcPageAnchorNavSection[] = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'palette', label: 'Palette', depth: 2 },
  { id: 'color', label: 'Color', depth: 2 },
  { id: 'typography', label: 'Typography', depth: 2 },
  { id: 'type-scale', label: 'Type scale', depth: 2 },
  { id: 'spacing', label: 'Spacing', depth: 2 },
  { id: 'radii', label: 'Radii', depth: 2 },
  { id: 'elevation', label: 'Elevation', depth: 2 },
  { id: 'components', label: 'Components' },
  { id: 'behaviors', label: 'Behaviors' },
  { id: 'templates', label: 'Templates' },
  { id: 'audit', label: 'Audit' },
];

@Component({
  selector: 'app-beans',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RevealDirective,
    EyebrowComponent,
    KcPageMarketing,
    KcPageHero,
    KcPageSection,
    KcPageAnchorNav,
    BeansIntroComponent,
    BeansFoundationsComponent,
    BeansComponentsComponent,
    BeansBehaviorsComponent,
    BeansTemplatesComponent,
    BeansAuditComponent,
  ],
  template: `
    <kc-page-marketing>
      <kc-page-anchor-nav slot="anchor-nav" [sections]="sections" heading="Design system" />

      <kc-page-hero>
        <app-eyebrow label="/beans" index="05" />
        <h1
          appReveal
          class="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam"
        >
          Single origin.<br />
          <span class="text-accent">Roasted light or dark.</span>
        </h1>
        <app-beans-intro />
      </kc-page-hero>

      <kc-page-section anchor="foundations" title="Foundations" kicker="Tokens, color, type, scale">
        <app-beans-foundations />
      </kc-page-section>

      <kc-page-section anchor="components" title="Components" kicker="Forms">
        <app-beans-components />
      </kc-page-section>

      <kc-page-section anchor="behaviors" title="Behaviors" kicker="Small interaction patterns">
        <app-beans-behaviors />
      </kc-page-section>

      <kc-page-section anchor="templates" title="Templates" kicker="Page shells">
        <app-beans-templates />
      </kc-page-section>

      <kc-page-section anchor="audit" title="Audit" kicker="What's stable, what isn't">
        <app-beans-audit />
      </kc-page-section>
    </kc-page-marketing>
  `,
})
export class BeansComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections = SECTIONS;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Beans — design system',
      description:
        'The kian.coffee design system. Tokens, components, behaviors, and page templates. What every page on this site is built from.',
      path: '/beans',
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        name: 'kian.coffee design system',
        about: 'Design tokens, components, and page templates',
      },
    });
  }
}
