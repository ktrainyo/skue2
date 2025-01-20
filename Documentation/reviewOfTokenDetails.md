## Review of TokenDetails.vue

**Location**: `src/components/TokenDetails.vue`

**Functionality**:
- Shows comprehensive token details and metrics
- Displays trading information and statistics
- Provides detailed token analysis

**How the User or Site Triggers the Component**:
- Token selection
- Route navigation
- Data refresh requests

**Virtual Data Types**:
- `DetailedTokenInfo` interface:
  ```typescript
  {
    token: TokenBaseInfo
    trading: TradingMetrics
    holders: HolderInfo
    transfers: TransferData[]
    analytics: TokenAnalytics
    network: NetworkData
  }
  ```
- `DisplayConfig` interface:
  ```typescript
  {
    activeTab: string
    refreshInterval: number
    showExtended: boolean
    dataFilters: FilterConfig[]
    chartOptions: ChartSettings
  }
  ```

**What Components or Services it Will Trigger**:
- Uses TokenService
- Integrates analytics charts
- Updates transaction list
- Manages data subscriptions

**Performance Features**:
- Implements tab lazy loading
- Uses data pagination
- Optimizes chart updates
