// Enhanced cache service for reducing API calls and improving performance
import type { NewsletterData } from '../types';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
  hits: number;
  lastAccessed: number;
}

interface CacheStats {
  size: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
  keys: string[];
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0
  };
  
  // Cache newsletter data for 20 minutes (shorter than 30-min refresh)
  private NEWSLETTER_CACHE_TTL = 20 * 60 * 1000; // 20 minutes
  
  // Cache API responses for 5 minutes
  private API_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // Maximum cache size to prevent memory issues
  private MAX_CACHE_SIZE = 100;
  
  // LocalStorage key prefix
  private STORAGE_PREFIX = 'greybrain_cache_';

  constructor() {
    // Load cache from localStorage on initialization
    this.loadFromStorage();
    
    // Save to storage periodically
    setInterval(() => {
      this.saveToStorage();
    }, 2 * 60 * 1000); // Every 2 minutes
  }

  /**
   * Get cached newsletter data
   */
  getNewsletterData(): NewsletterData | null {
    return this.get('newsletter-data');
  }

  /**
   * Set newsletter data in cache
   */
  setNewsletterData(data: NewsletterData): void {
    this.set('newsletter-data', data, this.NEWSLETTER_CACHE_TTL);
  }

  /**
   * Generic get method with TTL check and hit tracking
   */
  private get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    if (now > item.timestamp + item.expiry) {
      this.cache.delete(key);
      this.removeFromStorage(key);
      this.stats.misses++;
      return null;
    }

    // Update hit statistics
    item.hits++;
    item.lastAccessed = now;
    this.stats.hits++;
    
    return item.data;
  }

  /**
   * Generic set method with LRU eviction
   */
  private set<T>(key: string, data: T, ttl: number = this.API_CACHE_TTL): void {
    const now = Date.now();
    
    // Evict if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE && !this.cache.has(key)) {
      this.evictLRU();
    }

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiry: ttl,
      hits: 0,
      lastAccessed: now
    };

    this.cache.set(key, cacheItem);
    this.stats.sets++;
    
    // Persist important data to localStorage
    if (key === 'newsletter-data' || ttl > 10 * 60 * 1000) { // 10+ minutes
      this.saveItemToStorage(key, cacheItem);
    }
  }

  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.timestamp + item.expiry) {
        this.cache.delete(key);
        this.removeFromStorage(key);
        this.stats.evictions++;
      }
    }
  }

  /**
   * Evict least recently used item
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let oldestAccess = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestAccess) {
        oldestAccess = item.lastAccessed;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey);
      this.removeFromStorage(lruKey);
      this.stats.evictions++;
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const cacheData = Object.fromEntries(this.cache);
      localStorage.setItem(this.STORAGE_PREFIX + 'main', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Save individual item to localStorage
   */
  private saveItemToStorage<T>(key: string, item: CacheItem<T>): void {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.warn(`Failed to save cache item ${key} to storage:`, error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      // Load main cache
      const mainCache = localStorage.getItem(this.STORAGE_PREFIX + 'main');
      if (mainCache) {
        const cacheData = JSON.parse(mainCache);
        this.cache = new Map(Object.entries(cacheData));
      }

      // Load individual important items
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_PREFIX) && key !== this.STORAGE_PREFIX + 'main'
      );
      
      for (const fullKey of keys) {
        const key = fullKey.replace(this.STORAGE_PREFIX, '');
        const item = localStorage.getItem(fullKey);
        if (item) {
          const cacheItem = JSON.parse(item);
          // Check if still valid
          const now = Date.now();
          if (now <= cacheItem.timestamp + cacheItem.expiry) {
            this.cache.set(key, cacheItem);
          } else {
            localStorage.removeItem(fullKey);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Remove item from localStorage
   */
  private removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (error) {
      console.warn(`Failed to remove cache item ${key} from storage:`, error);
    }
  }

  /**
   * Get enhanced cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: JSON.stringify(Object.fromEntries(this.cache)).length,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
    
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  /**
   * Prefetch and cache API data
   */
  async prefetch(key: string, fetchFunction: () => Promise<any>, ttl?: number): Promise<void> {
    try {
      const data = await fetchFunction();
      this.set(key, data, ttl);
    } catch (error) {
      console.warn(`Failed to prefetch data for key ${key}:`, error);
    }
  }
}

export const cacheService = new CacheService();

// Run cleanup every 10 minutes
setInterval(() => {
  cacheService.cleanup();
}, 10 * 60 * 1000);
