import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { EyebrowComponent } from '../../shared/ui/eyebrow.component';
import { LinkArrowComponent } from '../../shared/ui/link-arrow.component';
import { SeoService } from '../../shared/seo/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EyebrowComponent, LinkArrowComponent],
  template: `
    <!--
      CONTACT PAGE
      Intent: an open, low-pressure "here's how to reach me" page. Not a pitch.
      Frame as: you read everything, you like hearing from curious people about
      specific things (homelab bugs, side projects, weird k8s edge cases, the
      best espresso machine under $X). Keep it human.
    -->
    <section class="relative z-10 mx-auto w-full max-w-4xl px-6 md:px-10 py-28 md:py-40">
      <app-eyebrow label="/contact" index="07" />

      <h1 class="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink-900 dark:text-foam">
        Say hello.
        <span class="block text-ink-700 dark:text-taupe">The door's genuinely open.</span>
      </h1>

      <p class="mt-8 max-w-xl font-sans text-lg leading-relaxed text-ink-700 dark:text-taupe">
        Every email gets read. Easiest paths in: you're chasing a weird K8s
        bug, you've got a homelab war story, you want to swap fantasy-series
        recs, or something on this site reminded you of something. Email's
        fastest. LinkedIn works too.
      </p>

      <div class="mt-14 grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-1.5">
            <span class="label text-ink-700 dark:text-taupe">email</span>
            <a
              href="mailto:me&#64;techgarden.gg"
              class="link-flourish font-display text-2xl text-ink-900 dark:text-foam"
            >
              me&#64;techgarden.gg
            </a>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="label text-ink-700 dark:text-taupe">linkedin</span>
            <a
              href="https://www.linkedin.com/in/kian-alikhani-20b656100"
              target="_blank"
              rel="noopener noreferrer"
              class="link-flourish font-display text-xl text-ink-900 dark:text-foam"
            >
              /in/kian-alikhani ↗
            </a>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="label text-ink-700 dark:text-taupe">github</span>
            <a
              href="https://github.com/TechGardenCode"
              target="_blank"
              rel="noopener noreferrer"
              class="link-flourish font-display text-xl text-ink-900 dark:text-foam"
            >
              /TechGardenCode ↗
            </a>
          </div>
        </div>

        <aside class="border-l border-crema/70 pl-8 dark:border-roast-700">
          <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            A one-paragraph intro beats a calendar link. Replies usually land
            within a day or two. If not, the lab's probably on fire and
            you'll get the story along with the response.
          </p>
          <div class="mt-8">
            <app-link-arrow href="/work">See the work first</app-link-arrow>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Contact',
      description: 'Get in touch — email, LinkedIn, GitHub.',
      path: '/contact',
    });
  }
}
