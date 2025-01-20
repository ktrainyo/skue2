## Review of TimeUtils.ts

**Location**: `src/utils/TimeUtils.ts`

**Functionality**:
- Provides time manipulation utilities
- Handles timezone conversions
- Implements time range calculations

**How the User or Site Triggers the Service**:
- Direct utility function calls
- Time conversion requests
- Range calculations

**Virtual Data Types**:
- `TimeConfig` interface:
  ```typescript
  {
    timezone: string
    format: string
    locale: string
    weekStart: number
    calendar: CalendarType
    relative: boolean
  }
  ```
- `TimeRange` interface:
  ```typescript
  {
    start: Date
    end: Date
    duration: number
    unit: TimeUnit
    label: string
    inclusive: boolean
  }
  ```

**What Components or Services it Will Trigger**:
- Uses date-fns library
- Manages timezone database
- Emits time events

**Performance Features**:
- Implements time caching
- Uses efficient calculations
- Optimizes timezone handling
