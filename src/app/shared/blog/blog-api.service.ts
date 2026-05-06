import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BLOG_API_BASE } from './blog-api.token';
import { ListOptions, Post, PostListResponse } from './blog.types';

/**
 * Read client for the kian-coffee-blog API. Phase 2 covers the public
 * surfaces only (list + bySlug). Admin/write methods land in phase 3.
 */
@Injectable({ providedIn: 'root' })
export class BlogApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(BLOG_API_BASE);

  list(opts: ListOptions = {}): Observable<PostListResponse> {
    let params = new HttpParams();
    if (opts.tag) params = params.set('tag', opts.tag);
    if (opts.page !== undefined) params = params.set('page', String(opts.page));
    if (opts.size !== undefined) params = params.set('size', String(opts.size));
    return this.http.get<PostListResponse>(`${this.base}/api/posts`, { params });
  }

  bySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.base}/api/posts/${encodeURIComponent(slug)}`);
  }

  /**
   * Builds an absolute URL for a `coverImageId` reference. SSR uses the
   * in-cluster API base, browser uses same-origin (`/api/media/<id>`).
   */
  mediaUrl(coverImageId: string): string {
    return `${this.base}/api/media/${encodeURIComponent(coverImageId)}`;
  }
}
