## Review of AlertService.ts

**Location**: `src/services/AlertService.ts`

**Functionality**:
- Manages price and metric alerts
- Handles alert notifications
- Provides alert configuration

**How the User or Site Triggers the Service**:
- User alert creation
- Automatic alert checks
- System-triggered alerts

**Virtual Data Types**:
- `AlertConfig` interface:
  ```typescript
  {
    id: string
    type: AlertType
    conditions: AlertCondition[]
    target: string
    notification: NotificationConfig
    active: boolean
    lastTriggered?: Date
  }
  ```
- `AlertCondition` interface:
  ```typescript
  {
    metric: string
    operator: 'gt' | 'lt' | 'eq' | 'change'
    value: number
    timeframe?: number
    cooldown: number
  }
  ```

**What Components or Services it Will Trigger**:
- Uses NotificationService
- Updates UserService
- Interacts with WebSocket service
- Manages alert states

**Error Handling**:
- Validates alert conditions
- Handles missed checks
- Manages notification failures
- Provides alert logging
