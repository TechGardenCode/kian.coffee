import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ChipComponent } from '../../shared/ui/chip.component';
import { BlogApiService } from '../../shared/blog/blog-api.service';
import type { PostSummary } from '../../shared/blog/blog.types';

@Component({
  selector: 'app-blog-post-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, ChipComponent],
  template: `
    <article class="group flex flex-col gap-5 border-t border-crema/70 pt-8 dark:border-roast-700">
      @if (coverUrl(); as src) {
        <a
          [routerLink]="['/blog', post().slug]"
          class="block overflow-hidden rounded-card border border-crema/70 dark:border-roast-700"
        >
          <img
            [src]="src"
            alt=""
            loading="lazy"
            class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </a>
      }

      <div class="flex flex-col gap-3">
        <h3 class="font-display text-2xl leading-tight text-ink-900 dark:text-foam">
          <a [routerLink]="['/blog', post().slug]" class="link-flourish">
            {{ post().title }}
          </a>
        </h3>
        <p class="font-sans text-body-md leading-relaxed text-ink-700 dark:text-taupe">
          {{ post().description }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        @for (tag of post().tags; track tag) {
          <a [routerLink]="['/blog', 'tag', tag]" class="contents">
            <app-chip>{{ tag }}</app-chip>
          </a>
        }
      </div>

      <div class="label flex items-center gap-3 text-ink-500 dark:text-taupe-dim">
        @if (post().publishedAt; as published) {
          <time [attr.datetime]="published">{{ published | date: 'mediumDate' }}</time>
        }
        @if (post().readingMinutes) {
          <span aria-hidden="true">·</span>
          <span>{{ post().readingMinutes }} min read</span>
        }
      </div>
    </article>
  `,
})
export class BlogPostCardComponent {
  private readonly api = inject(BlogApiService);
  readonly post = input.required<PostSummary>();
  readonly coverUrl = computed(() => {
    const id = this.post().coverImageId;
    return id ? this.api.mediaUrl(id) : null;
  });
}
