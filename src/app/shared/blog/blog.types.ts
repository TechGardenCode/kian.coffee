/**
 * Shape of `PostSummaryDto` from kian-coffee-blog. Matches the Java record
 * field-for-field; `bodyMd`/`bodyHtml` are intentionally absent so the list
 * endpoint stays cheap.
 */
export interface PostSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly status: 'draft' | 'published' | 'archived' | string;
  readonly publishedAt: string | null;
  readonly readingMinutes: number | null;
  readonly coverImageId: string | null;
  readonly updatedAt: string;
}

/** Full post detail — `PostDto` from the backend. */
export interface Post extends PostSummary {
  readonly bodyMd: string;
  readonly bodyHtml: string;
  readonly createdAt: string;
}

/**
 * Spring Data `Page<T>` envelope. Only the fields the reader UI consumes
 * are listed; the rest of the response is ignored.
 */
export interface PostListResponse {
  readonly content: readonly PostSummary[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly number: number;
  readonly size: number;
  readonly first: boolean;
  readonly last: boolean;
}

export interface ListOptions {
  readonly tag?: string;
  readonly page?: number;
  readonly size?: number;
}
