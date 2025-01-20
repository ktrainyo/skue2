## Review of TradeHistoryChart.vue

**Location**: `src/components/TradeHistoryChart.vue`

**Functionality**:
- Renders interactive trade history visualizations
- Supports multiple chart types (candlestick, line, area)
- Shows volume indicators and moving averages
- Provides time range selection

**Virtual Data and Props**:
- `tradeHistory: TradeHistoryData` interface:
  ```typescript
  {
    trades: Array<TradeEntry>
    timeRange: [Date, Date]
    interval: string
    indicators: IndicatorSettings[]
    chartType: 'candlestick' | 'line' | 'area'
  }
  ```
- `chartConfig: ChartConfig` - Chart display settings
- `loaded: boolean` - Chart loading state

**What Components or Services it Will Trigger**:
- Uses Chart.js or TradingView library
- Calls TradeService for data updates
- Emits chart interaction events

**Performance Features**:
- Implements data decimation
- Uses WebGL rendering
- Optimizes real-time updates
- Handles large datasets efficiently
