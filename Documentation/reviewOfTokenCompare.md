## Review of TokenCompare.vue

**Location**: `src/components/TokenCompare.vue`

**Functionality**:
- Provides side-by-side token comparison
- Shows comparative metrics and charts
- Highlights key differences

**How the User or Site Triggers the Component**:
- Token pair selection
- Metric type changes
- Time range updates

**Virtual Data Types**:
- `ComparisonConfig` interface:
  ```typescript
  {
    baseToken: TokenReference
    compareTokens: TokenReference[]
    metrics: ComparisonMetric[]
    timeframe: TimeRange
    displayMode: 'chart' | 'table' | 'grid'
    highlightDifferences: boolean
  }
  ```
- `ComparisonResult` interface:
  ```typescript
  {
    differences: MetricDifference[]
    correlations: CorrelationData[]
    performanceMetrics: RelativePerformance[]
    trendAnalysis: TrendData[]
  }
  ```

**What Components or Services it Will Trigger**:
- Uses TokenMetricsChart
- Calls TokenService for data
- Updates parent components
- Manages comparison state

**Performance Features**:
- Implements data memoization
- Uses parallel data fetching
- Optimizes chart renders
