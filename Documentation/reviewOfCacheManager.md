## Review of CacheManager.ts

**Location**: `src/utils/CacheManager.ts`

**Functionality**:
- Manages application-wide cache coordination
- Provides cache synchronization across tabs
- Implements advanced cache strategies

**How the User or Site Triggers the Service**:
- Automatic cache invalidation
- Cross-tab synchronization
- Manual cache operations

**Virtual Data Types**:
- `CacheManagerConfig` interface:
  ```typescript
  {
    stores: CacheStore[]
    syncEnabled: boolean
    persistenceMode: 'local' | 'session' | 'memory'
    cleanupInterval: number
    maxAge: Record<string, number>
  }
  ```
- `CacheOperation` interface:
  ```typescript
  {
    type: 'set' | 'delete' | 'clear'
    store: string
    key?: string
    value?: any
    metadata: CacheMetadata
    timestamp: number
  }
  ```

**What Components or Services it Will Trigger**:
- Coordinates with DataCache
- Updates LocalStorage
- Emits cache events
- Manages BroadcastChannel

**Performance Features**:
- Implements cache preloading
- Uses worker for cleanup
- Optimizes storage usage
