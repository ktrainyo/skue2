## Review of TokenMetadata.vue

**Location**: `src/components/TokenMetadata.vue`

**Functionality**:
- Displays detailed token metadata information
- Shows social and development metrics
- Provides verification status

**How the User or Site Triggers the Component**:
- Token selection
- Metadata refresh requests
- Verification checks

**Virtual Data Types**:
- `MetadataInfo` interface:
  ```typescript
  {
    token_address: string
    name: string
    symbol: string
    decimals: number
    verified: boolean
    socials: SocialLinks[]
    development: DevMetrics
    contracts: ContractInfo[]
  }
  ```
- `VerificationData` interface:
  ```typescript
  {
    status: VerificationStatus
    audits: AuditInfo[]
    team: TeamMember[]
    dates: ImportantDates
    badges: VerificationBadge[]
  }
  ```

**What Components or Services it Will Trigger**:
- Calls MetadataService
- Updates verification status
- Manages metadata cache
- Triggers refresh events

**Performance Features**:
- Implements metadata caching
- Uses lazy verification
- Optimizes badge rendering
