## Review of WebSocketManager.ts

**Location**: `src/utils/WebSocketManager.ts`

**Functionality**:
- Manages all WebSocket connections and subscriptions
- Provides automatic reconnection handling
- Implements message queueing and delivery

**How the User or Site Triggers the Service**:
- Auto-connect on application start
- Manual connection requests
- Service subscription requests

**Virtual Data Types**:
- `WebSocketConfig` interface:
  ```typescript
  {
    url: string
    protocols?: string[]
    autoReconnect: boolean
    maxRetries: number
    retryInterval: number
    pingInterval?: number
  }
  ```
- `ConnectionState` interface:
  ```typescript
  {
    connected: boolean
    lastConnected: Date | null
    retryCount: number
    error?: Error
    subscriptions: Map<string, SubscriptionHandler>
    messageQueue: QueuedMessage[]
  }
  ```

**What Components or Services it Will Trigger**:
- Emits connection events
- Triggers message handlers
- Updates connection state
- Manages reconnection timers

**Performance Features**:
- Implements message buffering
- Uses connection pooling
- Optimizes reconnection logic
