import { BlogPost } from '../types/blog';
import { BookOpen } from 'lucide-react';
import { cacheService } from './cacheService';

export const CACHE_KEY = 'hashnode_blog_posts_rss';
export const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const RSS_ENDPOINT = '/api/hashnode-rss';

const MAX_TAGS = 4;

/**
 * Safely extract text content from an XML element by tag name
 */
function getText(doc: Document | Element, tag: string): string {
  const el = doc instanceof Document
    ? doc.querySelector(tag)
    : (doc as Element).querySelector(tag);
  return el?.textContent?.trim() ?? '';
}

/**
 * Extract all text values for a given tag (e.g. <category>)
 */
function getAllText(parent: Element, tag: string): string[] {
  return Array.from(parent.querySelectorAll(tag))
    .map(el => el.textContent?.trim() ?? '')
    .filter(Boolean);
}

/**
 * Get the enclosure (cover image) URL from an RSS item
 */
function getEnclosureUrl(item: Element): string | undefined {
  // Try <coverImage> tag first (Hashnode RSS custom tag)
  const coverImage = item.querySelector('coverImage')?.textContent?.trim();
  if (coverImage) return coverImage;

  // Try <cover_image> tag
  const cover_image = item.querySelector('cover_image')?.textContent?.trim();
  if (cover_image) return cover_image;

  // Try standard <enclosure>
  const enclosure = item.querySelector('enclosure');
  const url = enclosure?.getAttribute('url');
  // Skip empty/placeholder enclosures
  return url && url.length > 0 ? url : undefined;
}

/**
 * Transform an RSS <item> element into a BlogPost object
 */
function transformRSSItem(item: Element, index: number): BlogPost {
  const title = getText(item, 'title');
  const description = getText(item, 'description');
  const link = getText(item, 'link') || item.querySelector('guid')?.textContent?.trim() || '#';
  const pubDate = getText(item, 'pubDate');
  const categories = getAllText(item, 'category').slice(0, MAX_TAGS);

  // Derive slug from the URL (last path segment)
  const urlParts = link.split('/');
  const slug = urlParts[urlParts.length - 1] || `post-${index}`;

  // Derive a unique id from slug
  const id = slug;

  const coverImage = getEnclosureUrl(item);

  // Format ISO date from RSS pubDate (e.g. "Thu, 18 Jan 2024 12:53:58 GMT")
  let publishedAt = new Date().toISOString();
  if (pubDate) {
    try {
      publishedAt = new Date(pubDate).toISOString();
    } catch {
      // keep default
    }
  }

  return {
    id,
    type: 'blog-post',
    slug,
    title,
    description,
    tags: categories.length > 0 ? categories : ['DevOps'],
    icon: BookOpen,
    color: index % 2 === 0 ? 'primary' : 'secondary',
    highlights: categories.slice(0, 3),
    github: '#',
    url: link,
    coverImage,
    publishedAt,
  };
}

/**
 * Parse an RSS XML string and return an array of BlogPost objects
 */
function parseRSS(xml: string, limit?: number): BlogPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  // Check for parse errors
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    console.error('[RSSService] XML parse error:', parserError.textContent);
    return [];
  }

  const items = Array.from(doc.querySelectorAll('item'));
  const sliced = limit ? items.slice(0, limit) : items;
  return sliced.map((item, i) => transformRSSItem(item, i));
}

/**
 * Fetch blog posts from the Hashnode RSS feed
 * @param limit  Max posts to return (default: 10)
 * @returns Array of BlogPost objects, or [] on failure
 */
export async function fetchBlogPostsFromRSS(limit: number = 10): Promise<BlogPost[]> {
  try {
    const response = await fetch(RSS_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
    });

    if (!response.ok) {
      console.warn(`[RSSService] RSS fetch failed (status ${response.status})`);
      return [];
    }

    const contentType = response.headers.get('content-type') ?? '';
    // If blocked by Vercel or returning HTML, bail gracefully
    if (contentType.includes('text/html')) {
      console.warn('[RSSService] Received HTML instead of XML (possibly rate-limited)');
      return [];
    }

    const xml = await response.text();
    const posts = parseRSS(xml, limit);
    console.log(`[RSSService] Fetched ${posts.length} posts from RSS feed`);
    return posts;
  } catch (error) {
    console.error('[RSSService] Error fetching RSS feed:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug from the RSS feed (or cache)
 * @param slug - The slug of the post
 * @returns The blog post, or null if not found
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const cachedData = cacheService.get<BlogPost[]>(CACHE_KEY);
    let posts: BlogPost[] = [];

    if (cachedData && cacheService.isValid(cachedData)) {
      posts = cachedData.data;
    } else {
      posts = await fetchBlogPostsFromRSS(50);
      if (posts.length > 0) {
        cacheService.set(CACHE_KEY, posts, CACHE_TTL);
      }
    }

    const post = posts.find(p => p.slug === slug);
    return post ?? null;
  } catch (error) {
    console.error('[RSSService] Error fetching blog post by slug:', error);
    return null;
  }
}

export const rssService = {
  fetchBlogPosts: fetchBlogPostsFromRSS,
  fetchBlogPostBySlug,
};
