// Enhanced API service with retry logic, circuit breaker, and better error handling
export class APIRetryService {
  private static readonly DEFAULT_RETRY_ATTEMPTS = 3;
  private static readonly DEFAULT_RETRY_DELAY = 1000; // 1 second
  private static readonly MAX_RETRY_DELAY = 10000; // 10 seconds
  
  // Circuit breaker state for each API
  private static circuitBreakers = new Map<string, {
    failures: number;
    lastFailure: number;
    isOpen: boolean;
  }>();

  /**
   * Retry wrapper for API calls with exponential backoff
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    serviceName: string,
    maxAttempts: number = this.DEFAULT_RETRY_ATTEMPTS
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Check circuit breaker
        if (this.isCircuitBreakerOpen(serviceName)) {
          throw new Error(`Service ${serviceName} is temporarily unavailable (circuit breaker open)`);
        }

        const result = await operation();
        
        // Reset circuit breaker on success
        this.resetCircuitBreaker(serviceName);
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Update circuit breaker
        this.recordFailure(serviceName);
        
        console.warn(`Attempt ${attempt}/${maxAttempts} failed for ${serviceName}:`, error);
        
        if (attempt === maxAttempts) {
          break;
        }
        
        // Exponential backoff with jitter
        const delay = Math.min(
          this.DEFAULT_RETRY_DELAY * Math.pow(2, attempt - 1) + Math.random() * 1000,
          this.MAX_RETRY_DELAY
        );
        
        await this.sleep(delay);
      }
    }
    
    throw new Error(`Failed after ${maxAttempts} attempts: ${lastError.message}`);
  }

  /**
   * Timeout wrapper for API calls
   */
  static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 30000,
    serviceName: string = 'API'
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${serviceName} timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Combined retry + timeout wrapper
   */
  static async execute<T>(
    operation: () => Promise<T>,
    options: {
      serviceName: string;
      maxAttempts?: number;
      timeoutMs?: number;
    }
  ): Promise<T> {
    const { serviceName, maxAttempts = 3, timeoutMs = 30000 } = options;
    
    return this.retryWithBackoff(
      () => this.withTimeout(operation(), timeoutMs, serviceName),
      serviceName,
      maxAttempts
    );
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static isCircuitBreakerOpen(serviceName: string): boolean {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) return false;
    
    const now = Date.now();
    const timeSinceLastFailure = now - breaker.lastFailure;
    
    // Auto-reset circuit breaker after 5 minutes
    if (timeSinceLastFailure > 5 * 60 * 1000) {
      this.resetCircuitBreaker(serviceName);
      return false;
    }
    
    // Open circuit after 5 failures in short period
    return breaker.failures >= 5 && breaker.isOpen;
  }

  private static recordFailure(serviceName: string): void {
    const existing = this.circuitBreakers.get(serviceName) || {
      failures: 0,
      lastFailure: 0,
      isOpen: false
    };
    
    existing.failures++;
    existing.lastFailure = Date.now();
    existing.isOpen = existing.failures >= 5;
    
    this.circuitBreakers.set(serviceName, existing);
  }

  private static resetCircuitBreaker(serviceName: string): void {
    this.circuitBreakers.set(serviceName, {
      failures: 0,
      lastFailure: 0,
      isOpen: false
    });
  }

  /**
   * Get circuit breaker status for monitoring
   */
  static getCircuitBreakerStatus() {
    const status: Record<string, any> = {};
    for (const [service, breaker] of this.circuitBreakers.entries()) {
      status[service] = {
        ...breaker,
        timeSinceLastFailure: Date.now() - breaker.lastFailure
      };
    }
    return status;
  }
}
