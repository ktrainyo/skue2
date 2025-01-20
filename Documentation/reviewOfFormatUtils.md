## Review of FormatUtils.ts

**Location**: `src/utils/FormatUtils.ts`

**Functionality**:
- Provides data formatting utilities
- Handles number and currency formatting
- Implements string manipulation functions

**How the User or Site Triggers the Service**:
- Direct function calls
- Component formatting needs
- Display value processing

**Virtual Data Types**:
- `FormatConfig` interface:
  ```typescript
  {
    locale: string
    currency: string
    decimals: number
    notation: NumberNotation
    compact: boolean
    units: UnitConfig[]
  }
  ```
- `FormatResult` interface:
  ```typescript
  {
    formatted: string
    raw: number
    prefix?: string
    suffix?: string
    scale: number
    unit?: string
  }
  ```

**What Components or Services it Will Trigger**:
- Uses Intl formatters
- Manages format cache
- Emits format events

**Performance Features**:
- Implements formatter pooling
- Uses format caching
- Optimizes number processing
