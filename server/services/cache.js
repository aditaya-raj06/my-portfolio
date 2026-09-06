/**
 * In-Memory TTL Cache Service
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  set(key, data, ttlSeconds = 600) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { data, expiresAt });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new MemoryCache();
