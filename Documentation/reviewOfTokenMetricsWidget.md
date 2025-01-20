## Review of TokenMetricsWidget.vue

**Location**: `src/components/TokenMetricsWidget.vue`

**Functionality**:
- Displays condensed token metrics in widget format
- Provides quick-view statistics
- Supports mini-chart visualization

**How the User or Site Triggers the Component**:
- Dashboard widget placement
- Token selection
- Auto-refresh intervals

**Virtual Data Types**:
- `WidgetConfig` interface:
  ```typescript
  {
    token: TokenReference
    metrics: string[]
    refreshInterval: number
    chartEnabled: boolean
    displayMode: WidgetDisplayMode
    size: WidgetSize
  }
  ```
- `WidgetData` interface:
  ```typescript
  {
    currentPrice: number
    priceChange: PriceChangeData
    volume: number
    miniChartData: DataPoint[]
    lastUpdate: Date
    status: WidgetStatus
  }
  ```

**What Components or Services it Will Trigger**:
- Uses TokenService for data
- Integrates mini-chart component
- Updates parent dashboard
- Manages refresh cycles

**Performance Features**:
- Implements lightweight rendering
- Uses data snapshots
- Optimizes refresh logic
