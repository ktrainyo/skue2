## Review of TokenTableList.vue

**Location**: `src/components/TokenTableList.vue`

**Functionality**:
- Displays a table of tokens with various columns such as Auto Update, Frequency, Name, Price USD, Market Cap, Liquidity, and Address.
- Allows users to toggle auto-update for each token and set the frequency of updates.
- Provides clickable links to show token overview.

**How the User or Site Triggers the Component**:
- The component is used within other Vue components or pages, such as `TokenApiTester.vue`.
- Users interact with the table by toggling switches, selecting frequencies, and clicking links.

**What Components or Services it Will Trigger**:
- Emits `tokenSelected` event to parent components when a token link is clicked.
- Calls `fetchTokenChartData` and `fetchTokenPriceAtTimestamp` from `tokenService` for auto-update functionality.

**What Data it Will Touch and What it Does with the Data**:
- Fetches token data from the `token_overview` table in Supabase.
- Updates the token data in the table based on user interactions (e.g., toggling auto-update, changing frequency).
- Formats and displays token data such as price, market cap, and liquidity.

**Virtual Data and Props**:
- `tokens: Array<TokenData>` - Array of token objects containing market data
- `autoUpdateFrequencies: Array<{label: string, value: number}>` - Available update intervals
- `activeLoops: Map<string, NodeJS.Timeout>` - Tracks active update loops by token address
- `tableLoading: boolean` - Controls table loading state

**Methods and Event Handlers**:
- `handleAutoUpdateToggle(token: TokenData)` - Manages token auto-update state
- `updateTokenData(token: TokenData)` - Fetches and updates specific token data
- `formatCurrency(value: number)` - Formats numerical values to USD currency
- `onTokenClick(token: TokenData)` - Handles token selection events

**Dependencies**:
- PrimeVue Components: DataTable, Column, InputSwitch, Dropdown
- TokenService for data fetching
- Supabase for database interactions

**Error Handling**:
- Implements try-catch blocks for API calls
- Gracefully handles failed updates with console logging
- Cleans up update loops on component unmount

**Performance Considerations**:
- Uses lazy loading for table data
- Implements debounced updates
- Clears intervals when components are destroyed

**Other Information**:
- Uses PrimeVue components for the table, select dropdown, and toggle switch.
- Implements pagination and lazy loading for efficient data handling.
- Handles polling for auto-updating token data at specified intervals.
