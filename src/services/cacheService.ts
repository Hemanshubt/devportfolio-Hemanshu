/**
 * Cache Service
 * 
 * Manages localStorage caching for blog posts with TTL (Time To Live) support.
 * Handles localStorage errors gracefully to ensure the application continues
 * functioning even when caching is unavailable.
 */

export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheService {
  get<T>(key: string): CachedData<T> | null;
  set<T>(key: string, data: T, ttl: number): void;
  isValid<T>(cachedData: CachedData<T>): boolean;
  clear(key: string): void;
}

class CacheServiceImpl implements CacheService {
  /**
   * Retrieves cached data from localStorage
   * @param key - The cache key
   * @returns Cached data with metadata, or null if not found or invalid
   */
  get<T>(key: string): CachedData<T> | null {
    try {
      const item = localStorage.getItem(key);
      
      if (!item) {
        return null;
      }

      const parsed = JSON.parse(item) as CachedData<T>;
      
      // Validate structure
      if (!parsed || typeof parsed !== 'object' || !('data' in parsed) || !('timestamp' in parsed) || !('ttl' in parsed)) {
        console.warn(`[CacheService] Invalid cache structure for key: ${key}`);
        this.clear(key);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error(`[CacheService] Error reading from cache (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Stores data in localStorage with timestamp and TTL
   * @param key - The cache key
   * @param data - The data to cache
   * @param ttl - Time to live in milliseconds
   */
  set<T>(key: string, data: T, ttl: number): void {
    try {
      const cachedData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      const serialized = JSON.stringify(cachedData);
      localStorage.setItem(key, serialized);
    } catch (error) {
      // Handle quota exceeded or other localStorage errors
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn(`[CacheService] localStorage quota exceeded. Cache not saved for key: ${key}`);
      } else {
        console.error(`[CacheService] Error writing to cache (key: ${key}):`, error);
      }
      // Don't throw - allow application to continue without caching
    }
  }

  /**
   * Checks if cached data is still valid based on TTL
   * @param cachedData - The cached data with metadata
   * @returns true if cache is still valid, false if expired
   */
  isValid<T>(cachedData: CachedData<T>): boolean {
    const now = Date.now();
    const age = now - cachedData.timestamp;
    return age < cachedData.ttl;
  }

  /**
   * Removes cached data from localStorage
   * @param key - The cache key to clear
   */
  clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[CacheService] Error clearing cache (key: ${key}):`, error);
      // Don't throw - allow application to continue
    }
  }
}

// Export singleton instance
export const cacheService: CacheService = new CacheServiceImpl();
