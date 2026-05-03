import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="relative z-10 border-t border-crema/70 bg-cream-50/60 dark:border-roast-700 dark:bg-roast-950/60">
      <div class="kc-container grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div class="flex flex-col gap-3 max-w-md">
          <span class="label text-ink-700 dark:text-taupe">kian.coffee</span>
          <p class="font-sans text-[15px] leading-relaxed text-ink-700 dark:text-taupe">
            Served from a Talos cluster on Proxmox in my basement, delivered
            by ArgoCD. HTTPS all the way. No trackers. No popups. Just pages
            built with intention.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <span class="label text-ink-700 dark:text-taupe">Site</span>
          <ul class="flex flex-col gap-2 font-sans text-sm text-ink-700 dark:text-taupe">
            <li><a routerLink="/work" class="link-flourish">Work</a></li>
            <li><a routerLink="/projects" class="link-flourish">Projects</a></li>
            <li><a routerLink="/lab" class="link-flourish">Lab</a></li>
          </ul>
        </div>

        <div class="flex flex-col gap-3">
          <span class="label text-ink-700 dark:text-taupe">Elsewhere</span>
          <ul class="flex flex-col gap-2 font-sans text-sm text-ink-700 dark:text-taupe">
            <li>
              <a href="https://github.com/TechGardenCode" target="_blank" rel="noopener noreferrer" class="link-flourish">GitHub ↗</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/kian-alikhani-20b656100" target="_blank" rel="noopener noreferrer" class="link-flourish">LinkedIn ↗</a>
            </li>
            <li>
              <a routerLink="/contact" class="link-flourish">Email →</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-crema/70 dark:border-roast-700">
        <div class="kc-container flex items-center justify-between py-5 label-sm text-ink-700 dark:text-taupe">
          <span>&copy; {{ year }} Kian Alikhani</span>
          <span>Built with Angular · Tailwind · intention</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
