## Review of TokenMetricsChart.vue

**Location**: `src/components/TokenMetricsChart.vue`

**Functionality**:
- Renders customizable metrics charts
- Supports multiple chart types and metrics
- Provides interactive data exploration

**How the User or Site Triggers the Component**:
- Metric selection changes
- Timeframe updates
- Data refresh requests

**Virtual Data Types**:
- `MetricsChartConfig` interface:
  ```typescript
  {
    chartType: 'line' | 'bar' | 'area' | 'scatter'
    metrics: MetricDefinition[]
    timeRange: [Date, Date]
    aggregation: AggregationType
    compareWith?: string[]
  }
  ```
- `MetricDefinition` interface:
  ```typescript
  {
    id: string
    name: string
    color: string
    dataSource: string
    transform?: (data: any) => number
    visible: boolean
  }
  ```

**What Components or Services it Will Trigger**:
- Uses ChartJS for rendering
- Calls TokenService for data
- Updates parent components
- Manages data subscriptions

**Performance Features**:
- Implements data decimation
- Uses canvas optimization
- Supports dynamic loading
