import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE } from './site';

export interface SeoConfig {
  /** Page title — will be composed to "<title> · kian.coffee" by TitleStrategy.
   *  If omitted here, fall back to whatever the route's `title` set. */
  readonly title?: string;
  /** 1-sentence description used in <meta name="description">, OG, Twitter. */
  readonly description: string;
  /** Path for canonical URL. Must start with `/`. Absolute URL is composed. */
  readonly path: string;
  /** Override OG image path. Defaults to SITE.ogImage. */
  readonly ogImage?: string;
  /** `website` | `article` | `profile`. Defaults to `website`. */
  readonly ogType?: 'website' | 'article' | 'profile';
  /** Optional robots directive. Defaults to `index, follow`. */
  readonly robots?: string;
  /** Optional JSON-LD payload to embed. Caller is responsible for correctness. */
  readonly jsonLd?: Record<string, unknown>;
}

const JSON_LD_ELEMENT_ID = 'kc-json-ld';

/**
 * Centralizes Meta/Title + OG + Twitter + JSON-LD application. Call from
 * each page's ngOnInit so every route sets its own canonical + description
 * rather than inheriting a stale one from the last navigation.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  apply(config: SeoConfig): void {
    const canonical = absoluteUrl(config.path);
    const ogImage = absoluteUrl(config.ogImage ?? SITE.ogImage);
    const title = config.title ? `${config.title} · ${SITE.name}` : SITE.name;

    if (config.title) this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: config.robots ?? 'index, follow' });

    // Canonical link — Angular's Meta doesn't cover <link>, so write manually.
    this.setLink('canonical', canonical);

    // Open Graph
    this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.meta.updateTag({ property: 'og:locale', content: SITE.locale });
    this.meta.updateTag({ property: 'og:type', content: config.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: ogImage });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });
    if (SITE.twitter) {
      this.meta.updateTag({ name: 'twitter:creator', content: SITE.twitter });
    }

    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    } else {
      this.clearJsonLd();
    }
  }

  private setLink(rel: string, href: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(payload: Record<string, unknown>): void {
    const head = this.document.head;
    let script = head.querySelector<HTMLScriptElement>(`script#${JSON_LD_ELEMENT_ID}`);
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.id = JSON_LD_ELEMENT_ID;
      head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }

  private clearJsonLd(): void {
    const existing = this.document.head.querySelector(`script#${JSON_LD_ELEMENT_ID}`);
    if (existing) existing.remove();
  }
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE.url}${path === '/' ? '' : path}`;
}
