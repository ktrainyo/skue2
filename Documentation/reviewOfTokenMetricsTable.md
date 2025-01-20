## Review of TokenMetricsTable.vue

**Location**: `src/components/TokenMetricsTable.vue`

**Functionality**:
- Displays detailed token metrics in tabular format
- Provides sortable and filterable columns
- Shows historical metric comparisons

**How the User or Site Triggers the Component**:
- Metric selection changes
- Sort/filter operations
- Data refresh requests

**Virtual Data Types**:
- `MetricsTableData` interface:
  ```typescript
  {
    metrics: MetricRow[]
    columns: TableColumn[]
    filters: MetricFilter[]
    sortState: SortConfig[]
    selectedRows: string[]
    viewOptions: ViewConfig
  }
  ```
- `MetricRow` interface:
  ```typescript
  {
    id: string
    name: string
    category: string
    current: number
    previous: number
    change: number
    trend: TrendDirection
    importance: number
  }
  ```

**What Components or Services it Will Trigger**:
- Uses MetricsService
- Updates chart displays
- Manages data filtering
- Handles row selection

**Performance Features**:
- Implements virtual scrolling
- Uses column virtualization
- Optimizes sort operations
