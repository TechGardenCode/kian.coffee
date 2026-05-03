import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  KcPageDoc,
  KcPageSection,
  type KcPageDocSection,
} from '@kian.coffee/beans';
import { SeoService } from '../../shared/seo/seo.service';
import { BeansFoundationsComponent } from './sections/foundations.component';
import { BeansComponentsComponent } from './sections/components.component';
import { BeansBehaviorsComponent } from './sections/behaviors.component';
import { BeansTemplatesComponent } from './sections/templates.component';
import { BeansAuditComponent } from './sections/audit.component';
import { BeansIntroComponent } from './sections/intro.component';

const SECTIONS: readonly KcPageDocSection[] = [
  { id: 'intro', label: 'Intro' },
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
    RouterLink,
    KcPageDoc,
    KcPageSection,
    BeansIntroComponent,
    BeansFoundationsComponent,
    BeansComponentsComponent,
    BeansBehaviorsComponent,
    BeansTemplatesComponent,
    BeansAuditComponent,
  ],
  template: `
    <kc-page-doc [sections]="sections" #doc="kcPageDoc">
      <aside slot="nav" class="hidden lg:block" aria-label="Section navigation">
        <div class="flex flex-col gap-4 lg:sticky lg:top-12 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto py-12">
          <p class="label text-ink-500 dark:text-taupe-dim">Design system</p>

          <ol class="m-0 flex list-none flex-col gap-1 border-l border-ink-900/10 p-0 dark:border-foam/10">
            @for (s of sections; track s.id) {
              <li class="block" [class.pl-3]="s.depth === 2">
                <a
                  [routerLink]="[]"
                  [fragment]="s.id"
                  class="-ml-px block border-l border-transparent px-3 py-2 font-sans text-sm leading-snug text-ink-700 no-underline transition-colors hover:text-ink-900 dark:text-taupe dark:hover:text-foam"
                  [class.!border-accent]="doc.activeId() === s.id"
                  [class.!text-accent]="doc.activeId() === s.id"
                  [class.font-medium]="doc.activeId() === s.id"
                >{{ s.label }}</a>
              </li>
            }
          </ol>
        </div>
      </aside>

      <kc-page-section anchor="intro" title="Beans" kicker="@kian.coffee/beans">
        <app-beans-intro />
      </kc-page-section>

      <kc-page-section anchor="foundations" title="Foundations" kicker="Tokens & primitives">
        <app-beans-foundations />
      </kc-page-section>

      <kc-page-section anchor="components" title="Components" kicker="Forms tier">
        <app-beans-components />
      </kc-page-section>

      <kc-page-section anchor="behaviors" title="Behaviors" kicker="Interaction primitives">
        <app-beans-behaviors />
      </kc-page-section>

      <kc-page-section anchor="templates" title="Templates" kicker="Page substrates">
        <app-beans-templates />
      </kc-page-section>

      <kc-page-section anchor="audit" title="Audit" kicker="What's stable, what isn't">
        <app-beans-audit />
      </kc-page-section>
    </kc-page-doc>
  `,
})
export class BeansComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections = SECTIONS;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Beans — design system',
      description:
        'The kian.coffee design system: tokens, components, behaviors, and page templates. The substrate every page on this site is built from.',
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
