// ...existing code...

export class CacheUtils {
  // ...existing caching logic from TokenService...

  getCachedData(key: string) {
    // ...return cached data if available...
  }

  setCachedData(key: string, value: any, ttl?: number) {
    // ...store data with optional TTL...
  }

  invalidateCache(key: string) {
    // ...remove cache entry...
  }
}
