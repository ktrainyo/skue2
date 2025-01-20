## Review of TokenPairs.vue

**Location**: `src/components/TokenPairs.vue`

**Functionality**:
- Displays trading pairs for selected tokens
- Shows liquidity and volume information
- Provides pair comparison features

**How the User or Site Triggers the Component**:
- Automatic loading when token is selected
- Manual refresh by user
- Parent component updates

**Virtual Data and Props**:
- `pairData: TokenPairData` interface:
  ```typescript
  {
    base_token: TokenData
    quote_token: TokenData
    liquidity: number
    volume_24h: number
    price: number
    price_change: number
    trades_count: number
  }
  ```
- `displayConfig: PairDisplayConfig` - UI configuration
- `selectedPairs: string[]` - Active pair selection

**What Components or Services it Will Trigger**:
- Uses TradeService for pair data
- Calls ChartDisplay for price charts
- Updates TokenMetrics with pair stats

**Error Handling**:
- Validates pair data integrity
- Handles missing liquidity data
- Provides fallback displays
