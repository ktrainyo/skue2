## Review of TokenLiquidity.vue

**Location**: `src/components/TokenLiquidity.vue`

**Functionality**:
- Displays token liquidity information and metrics
- Shows pool distribution and depth
- Provides liquidity trend analysis

**How the User or Site Triggers the Component**:
- Liquidity data requests
- Pool selection changes
- Time period updates

**Virtual Data Types**:
- `LiquidityData` interface:
  ```typescript
  {
    total_liquidity: number
    pool_distribution: PoolData[]
    depth_chart: DepthPoint[]
    historical: LiquidityHistory[]
    metrics: LiquidityMetrics
    lastUpdate: Date
  }
  ```
- `PoolData` interface:
  ```typescript
  {
    pool_address: string
    pair_token: TokenReference
    liquidity_usd: number
    share: number
    volume_24h: number
    fee_tier: number
  }
  ```
- `DepthPoint` interface:
  ```typescript
  {
    price: number
    buy_depth: number
    sell_depth: number
    cumulative: number
    volume: number
  }
  ```

**What Components or Services it Will Trigger**:
- Uses ChartDisplay component
- Calls LiquidityService
- Updates pool statistics
- Manages WebSocket feeds

**Performance Features**:
- Implements data streaming
- Uses WebGL rendering
- Optimizes depth calculations
