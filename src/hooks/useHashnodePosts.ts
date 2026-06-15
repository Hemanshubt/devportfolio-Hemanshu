/**
 * useHashnodePosts Hook
 *
 * Custom React hook for fetching and caching Hashnode blog posts via RSS feed.
 * The Hashnode GraphQL API now requires a paid Pro plan; the RSS feed is free.
 */

import { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import { rssService, CACHE_KEY, CACHE_TTL } from '../services/rssService';
import { cacheService } from '../services/cacheService';
import { filterValidBlogPosts } from '../utils/validators';

export interface UseHashnodePostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => void;
  loadingMore: boolean;
}

/**
 * Custom hook to fetch and cache Hashnode blog posts via RSS
 * @param initialLimit - Max number of posts to show initially (default: 50)
 */
export function useHashnodePosts(initialLimit: number = 50): UseHashnodePostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        // Check cache first
        const cachedData = cacheService.get<BlogPost[]>(CACHE_KEY);
        if (cachedData && cacheService.isValid(cachedData)) {
          if (isMounted) {
            setPosts(cachedData.data.slice(0, initialLimit));
            setLoading(false);
          }
          return;
        }

        // Fetch all posts from RSS (RSS returns everything at once, no pagination)
        // Request up to 50 posts so client-side pagination has content
        const fetched = await rssService.fetchBlogPosts(50);
        const valid = filterValidBlogPosts(fetched);

        if (isMounted) {
          setPosts(valid.slice(0, initialLimit));
          setLoading(false);

          if (valid.length > 0) {
            cacheService.set(CACHE_KEY, valid, CACHE_TTL);
          }
        }
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Failed to fetch blog posts');
        if (isMounted) {
          setError(errorObj);
          setLoading(false);
          setPosts([]);
        }
        console.error('[useHashnodePosts] Error fetching RSS blog posts:', errorObj);
      }
    }

    fetchPosts();
    return () => { isMounted = false; };
  }, [initialLimit]);

  return {
    posts,
    loading,
    error,
    // RSS loads all posts at once — no server-side pagination
    hasNextPage: false,
    loadMore: () => {},
    loadingMore: false,
  };
}
