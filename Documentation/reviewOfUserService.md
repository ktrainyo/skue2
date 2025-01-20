## Review of UserService.ts

**Location**: `src/services/UserService.ts`

**Functionality**:
- Manages user authentication and session
- Handles user preferences and settings
- Provides user data persistence

**How the User or Site Triggers the Service**:
- User login/logout actions
- Settings changes
- Automatic session refresh

**Virtual Data Types**:
- `UserProfile` interface:
  ```typescript
  {
    id: string
    email: string
    preferences: UserPreferences
    watchlist: string[]
    api_keys: ApiKeyConfig[]
    last_login: Date
  }
  ```
- `UserPreferences` interface:
  ```typescript
  {
    theme: 'light' | 'dark'
    currency: string
    notifications: NotificationSettings
    default_timeframe: string
  }
  ```

**What Components or Services it Will Trigger**:
- Interacts with Supabase auth
- Updates DatabaseService
- Manages local storage
- Emits user events

**Security Features**:
- Implements token refresh
- Sanitizes user input
- Encrypts sensitive data
- Manages session timeout
