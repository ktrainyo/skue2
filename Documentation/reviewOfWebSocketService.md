## Review of WebSocketService.ts

**Location**: `src/services/WebSocketService.ts`

**Functionality**:
- Manages WebSocket connections for real-time data
- Handles connection lifecycle and reconnection
- Provides message subscription system

**How the User or Site Triggers the Service**:
- Automatic connection on service initialization
- Manual connection management
- Subscription requests from components

**Virtual Data Types**:
- `WebSocketConfig` interface:
  ```typescript
  {
    url: string
    protocols: string[]
    reconnectAttempts: number
    reconnectInterval: number
    heartbeatInterval: number
  }
  ```
- `SocketSubscription` interface:
  ```typescript
  {
    channel: string
    callback: (data: any) => void
    filters?: MessageFilter[]
    active: boolean
  }
  ```

**What Components or Services it Will Trigger**:
- Emits connection state changes
- Triggers message handlers
- Updates connected services
- Manages subscription callbacks

**Error Handling**:
- Implements connection recovery
- Handles message parsing errors
- Manages subscription failures
- Provides connection diagnostics
