export interface TokenData {
  token: {
    name: string; // Token name
    symbol: string; // Token symbol
    image: string; // Token image URL
    decimals: number; // Number of decimals
    uri: string; // Token URI
    mint: string; // Mint address
    hasFileMetaData: boolean; // Indicates if the token has file metadata
    description: string; // Token description
    createdOn?: string; // Token creation date (optional)
    showName?: boolean; // Indicates if the token name should be shown (optional)
    twitter?: string; // Twitter handle (optional)
    telegram?: string; // Telegram handle (optional)
    website?: string; // Website URL (optional)
  };
  pools: TokenPool[]; // Array of token pools
  events: Record<string, TokenEvent>; // Record of token events
  risk: TokenRisk; // Token risk information
}

export interface TokenPool {
  poolId: string; // Pool ID
  liquidity: {
    quote: number; // Liquidity in quote token
    usd: number; // Liquidity in USD
  };
  price: {
    quote: number; // Price in quote token
    usd: number; // Price in USD
  };
  tokenSupply: number; // Token supply
  lpBurn: number; // LP burn amount
  marketCap: {
    quote: number; // Market cap in quote token
    usd: number; // Market cap in USD
  };
  security?: {
    freezeAuthority: string | null; // Freeze authority (optional)
    mintAuthority: string | null; // Mint authority (optional)
  };
  quoteToken: string; // Quote token
  market: string; // Market
  curvePercentage?: number; // Curve percentage (optional)
  curve: string; // Curve
  lastUpdated: number; // Last updated timestamp
  createdAt: number; // Created at timestamp
  deployer: string; // Deployer address
  txns: {
    buys: number; // Number of buy transactions
    total: number; // Total number of transactions
    volume: number; // Transaction volume
    sells: number; // Number of sell transactions
  };
  openTime?: number; // Open time (optional)
}

export interface TokenEvent {
  priceChangePercentage: number; // Price change percentage
}

export interface TokenRisk {
  rugged: boolean; // Indicates if the token is rugged
  risks: {
    riskName: string; // Risk name
    riskDescription: string; // Risk description
    riskLevel: string; // Risk level
    riskScore: number; // Risk score
  }[];
  overallRiskScore: number; // Overall risk score
}
