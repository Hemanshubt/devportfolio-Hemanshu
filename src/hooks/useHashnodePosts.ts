/**
 * useHashnodePosts Hook
 * 
 * Custom React hook for fetching and caching Hashnode blog posts.
 * Manages loading, error, and data states with automatic caching.
 */

import { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import { hashnodeService } from '../services/hashnodeService';
import { cacheService } from '../services/cacheService';
import { filterValidBlogPosts } from '../utils/validators';

const CACHE_KEY = 'hashnode_blog_posts';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const HASHNODE_HOST = 'hemanshubtc.hashnode.dev';

export interface UseHashnodePostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => void;
  loadingMore: boolean;
}

/**
 * Custom hook to fetch and cache Hashnode blog posts
 * @param initialLimit - Initial number of posts to fetch (default: 10)
 * @returns Object containing posts array, loading state, error state, and pagination info
 */
export function useHashnodePosts(initialLimit: number = 10): UseHashnodePostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        // Check cache first
        const cachedData = cacheService.get<BlogPost[]>(CACHE_KEY);
        
        if (cachedData && cacheService.isValid(cachedData)) {
          // Use cached data
          if (isMounted) {
            setPosts(cachedData.data);
            setLoading(false);
          }
          return;
        }

        // Cache miss or expired - fetch from API
        const result = await hashnodeService.fetchBlogPosts(HASHNODE_HOST, initialLimit);
        
        // Validate and filter posts
        const validPosts = filterValidBlogPosts(result.posts);

        if (isMounted) {
          setPosts(validPosts);
          setHasNextPage(result.hasNextPage);
          setEndCursor(result.endCursor);
          setLoading(false);
          
          // Update cache with valid posts
          if (validPosts.length > 0) {
            cacheService.set(CACHE_KEY, validPosts, CACHE_TTL);
          }
        }
      } catch (err) {
        // Handle errors gracefully
        const errorObj = err instanceof Error ? err : new Error('Failed to fetch blog posts');
        
        if (isMounted) {
          setError(errorObj);
          setLoading(false);
          setPosts([]); // Return empty array on error
        }
        
        console.error('[useHashnodePosts] Error fetching blog posts:', errorObj);
      }
    }

    fetchPosts();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [initialLimit]); // Re-fetch if limit changes

  const loadMore = async () => {
    if (!hasNextPage || loadingMore || !endCursor) return;

    setLoadingMore(true);
    try {
      const result = await hashnodeService.fetchBlogPosts(HASHNODE_HOST, initialLimit, endCursor);
      const validPosts = filterValidBlogPosts(result.posts);
      
      setPosts(prev => [...prev, ...validPosts]);
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    } catch (err) {
      console.error('[useHashnodePosts] Error loading more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    posts,
    loading,
    error,
    hasNextPage,
    loadMore,
    loadingMore,
  };
}
