## Review of TokenSearchInput.vue

**Location**: `src/components/TokenSearchInput.vue`

**Functionality**:
- Provides token search functionality with autocomplete
- Supports address and symbol search
- Implements debounced search
- Displays token metadata in suggestions

**How the User or Site Triggers the Component**:
- User input in search field
- Programmatic value updates
- Parent component triggers

**Virtual Data and Props**:
- `searchQuery: string` - Current search input
- `suggestions: TokenSuggestion[]` interface:
  ```typescript
  {
    address: string
    symbol: string
    name: string
    icon?: string
    verified: boolean
  }
  ```
- `isLoading: boolean` - Search state indicator
- `selectedToken: TokenData | null` - Currently selected token

**What Components or Services it Will Trigger**:
- Uses TokenService for token lookup
- Integrates with PrimeVue AutoComplete
- Emits selection events
- Updates URL parameters

**Error Handling**:
- Validates token addresses
- Handles network errors
- Provides feedback for invalid inputs
- Manages loading states

**Other Information**:
- Implements keyboard navigation
- Supports custom rendering of suggestions
- Provides search history
- Implements local caching
