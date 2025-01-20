## Review of TokenSummary.vue

**Location**: `src/components/TokenSummary.vue`

**Functionality**:
- Displays condensed token summary information
- Shows key performance indicators
- Provides quick action buttons

**How the User or Site Triggers the Component**:
- Token selection
- Dashboard placement
- Automatic updates

**Virtual Data Types**:
- `SummaryData` interface:
  ```typescript
  {
    token: TokenBasicInfo
    price: PriceSnapshot
    performance: PerformanceIndicators
    supply: TokenSupply
    actions: QuickAction[]
    lastUpdate: Date
  }
  ```
- `TokenSupply` interface:
  ```typescript
  {
    total: number
    circulating: number
    burned: number
    locked: number
    distribution: SupplyBreakdown[]
  }
  ```

**What Components or Services it Will Trigger**:
- Uses TokenService
- Updates price displays
- Manages action handlers
- Triggers data refresh

**Performance Features**:
- Implements data caching
- Uses computed properties
- Optimizes re-renders
