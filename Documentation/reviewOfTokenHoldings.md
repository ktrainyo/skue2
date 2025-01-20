## Review of TokenHoldings.vue

**Location**: `src/components/TokenHoldings.vue`

**Functionality**:
- Displays user token holdings and balances
- Shows portfolio distribution
- Tracks holding performance

**How the User or Site Triggers the Component**:
- Wallet connection
- Portfolio page load
- Manual refresh

**Virtual Data Types**:
- `HoldingsData` interface:
  ```typescript
  {
    tokens: TokenBalance[]
    totalValue: number
    performance: PerformanceMetrics
    distribution: TokenDistribution[]
    lastSync: Date
    status: SyncStatus
  }
  ```
- `TokenBalance` interface:
  ```typescript
  {
    token: TokenData
    balance: number
    value_usd: number
    cost_basis?: number
    profit_loss?: ProfitLoss
    location: 'wallet' | 'stake' | 'pool'
  }
  ```

**What Components or Services it Will Trigger**:
- Uses WalletService
- Calls PriceService
- Updates portfolio stats
- Manages balance updates

**Performance Features**:
- Implements balance caching
- Uses lazy loading
- Optimizes refresh cycles
