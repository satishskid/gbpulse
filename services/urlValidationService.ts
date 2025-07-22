// URL validation and link checker service to fix broken links
import type { NewsletterSectionData } from '../types';

interface URLValidationResult {
  isValid: boolean;
  status?: number;
  error?: string;
  redirectUrl?: string;
  responseTime?: number;
}

export class URLValidationService {
  private static readonly VALIDATION_CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private static readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private static readonly USER_AGENT = 'GreyBrain AI Pulse Bot 1.0';

  /**
   * Validate a single URL with caching
   */
  static async validateURL(url: string): Promise<URLValidationResult> {
    // Check cache first
    const cacheKey = `url-validation-${url}`;
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.performValidation(url);
    
    // Cache the result
    this.setCachedResult(cacheKey, result);
    
    return result;
  }

  /**
   * Validate multiple URLs in parallel with rate limiting
   */
  static async validateURLs(urls: string[], maxConcurrent: number = 5): Promise<Map<string, URLValidationResult>> {
    const results = new Map<string, URLValidationResult>();
    
    // Process URLs in batches to avoid overwhelming servers
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      const batch = urls.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (url) => {
        try {
          const result = await this.validateURL(url);
          return { url, result };
        } catch (error) {
          return { 
            url, 
            result: { 
              isValid: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            } 
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          const { url, result } = promiseResult.value;
          results.set(url, result);
        }
      });

      // Small delay between batches
      if (i + maxConcurrent < urls.length) {
        await this.sleep(500);
      }
    }

    return results;
  }

  /**
   * Fix common URL issues
   */
  static fixURL(url: string): string {
    let fixed = url.trim();

    // Add protocol if missing
    if (!/^https?:\/\//i.test(fixed)) {
      fixed = 'https://' + fixed;
    }

    // Fix common domain issues
    fixed = fixed
      .replace(/twitter\.com/g, 'x.com') // Twitter -> X
      .replace(/www\.x\.com/g, 'x.com') // Remove www for X
      .replace(/m\.youtube\.com/g, 'youtube.com') // Mobile YouTube
      .replace(/youtu\.be\//g, 'youtube.com/watch?v='); // YouTube short URLs

    // Remove tracking parameters
    try {
      const urlObj = new URL(fixed);
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
      paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
      fixed = urlObj.toString();
    } catch (error) {
      // If URL parsing fails, return original
      console.warn('Failed to parse URL for cleanup:', fixed);
    }

    return fixed;
  }

  /**
   * Suggest alternative URLs for broken links
   */
  static async suggestAlternatives(originalUrl: string): Promise<string[]> {
    const suggestions: string[] = [];
    
    try {
      const urlObj = new URL(originalUrl);
      const domain = urlObj.hostname;

      // Common alternative patterns
      if (domain.includes('twitter.com')) {
        suggestions.push(originalUrl.replace('twitter.com', 'x.com'));
      }

      if (domain.includes('x.com')) {
        suggestions.push(originalUrl.replace('x.com', 'twitter.com'));
      }

      // Try with/without www
      if (domain.startsWith('www.')) {
        suggestions.push(originalUrl.replace('www.', ''));
      } else {
        suggestions.push(originalUrl.replace('://', '://www.'));
      }

      // Try http instead of https (less secure but might work)
      if (originalUrl.startsWith('https://')) {
        suggestions.push(originalUrl.replace('https://', 'http://'));
      }

    } catch (error) {
      console.warn('Failed to generate URL alternatives:', error);
    }

    return suggestions;
  }

  /**
   * Validate all URLs in newsletter data
   */
  static async validateNewsletterUrls(newsletter: NewsletterSectionData[]): Promise<void> {
    try {
      const allUrls = newsletter.flatMap(section => 
        section.items.map(item => item.sourceUrl)
      );
      
      console.log(`🔍 Validating ${allUrls.length} URLs in newsletter...`);
      
      // Validate URLs in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < allUrls.length; i += batchSize) {
        const batch = allUrls.slice(i, i + batchSize);
        await Promise.all(batch.map(url => this.validateURL(url)));
      }
      
      console.log('✅ Newsletter URL validation completed');
    } catch (error) {
      console.error('❌ Error validating newsletter URLs:', error);
    }
  }

  private static async performValidation(url: string): Promise<URLValidationResult> {
    const startTime = Date.now();
    
    try {
      // Fix common URL issues first
      const fixedUrl = this.fixURL(url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      const response = await fetch(fixedUrl, {
        method: 'HEAD', // Use HEAD to check without downloading content
        signal: controller.signal,
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow'
      });

      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;

      return {
        isValid: response.ok,
        status: response.status,
        responseTime,
        redirectUrl: response.url !== fixedUrl ? response.url : undefined
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        return {
          isValid: false,
          error: error.name === 'AbortError' ? 'Request timeout' : error.message,
          responseTime
        };
      }
      
      return {
        isValid: false,
        error: 'Unknown error occurred',
        responseTime
      };
    }
  }

  private static getCachedResult(key: string): URLValidationResult | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > this.VALIDATION_CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      return null;
    }
  }

  private static setCachedResult(key: string, result: URLValidationResult): void {
    try {
      const cacheData = {
        data: result,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache URL validation result:', error);
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get validation statistics
   */
  static getValidationStats(): {
    cacheSize: number;
    cacheKeys: string[];
  } {
    const cacheKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('url-validation-'));
    
    return {
      cacheSize: cacheKeys.length,
      cacheKeys
    };
  }

  /**
   * Clear validation cache
   */
  static clearValidationCache(): void {
    const cacheKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('url-validation-'));
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
  }
}
