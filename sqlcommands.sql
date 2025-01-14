-- Create token_holders table
CREATE TABLE IF NOT EXISTS token_holders (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT,
  "wallet" TEXT,
  "holder" TEXT,
  "amount" NUMERIC,
  "percentage" NUMERIC,
  "value" JSONB,
  "createdOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create token_ath table
CREATE TABLE IF NOT EXISTS token_ath (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT,
  "highest_price" NUMERIC,
  "timestamp" BIGINT,
  "createdOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create search_results table
CREATE TABLE IF NOT EXISTS search_results (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "symbol" TEXT,
  "mint" TEXT,
  "image" TEXT,
  "decimals" INTEGER,
  "quoteToken" TEXT,
  "hasSocials" BOOLEAN,
  "poolAddress" TEXT,
  "liquidityUsd" NUMERIC,
  "marketCapUsd" NUMERIC,
  "lpBurn" INTEGER,
  "market" TEXT,
  "freezeAuthority" TEXT,
  "mintAuthority" TEXT,
  "deployer" TEXT,
  "createdAt" BIGINT,
  "status" TEXT,
  "lastUpdated" BIGINT,
  "buys" INTEGER,
  "sells" INTEGER,
  "totalTransactions" INTEGER,
  "price" NUMERIC -- Add price column
);

-- Create token_prices table
CREATE TABLE IF NOT EXISTS token_prices (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT,
  "price" NUMERIC,
  "priceQuote" NUMERIC,
  "liquidity" NUMERIC,
  "marketCap" NUMERIC,
  "lastUpdated" TIMESTAMP
);

-- Create token_price_history table
CREATE TABLE IF NOT EXISTS token_price_history (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT,
  "current" NUMERIC,
  "3d" NUMERIC,
  "5d" NUMERIC,
  "7d" NUMERIC,
  "14d" NUMERIC,
  "30d" NUMERIC,
  "lastUpdated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create token_price_at_timestamp table
-- Create token_trades table
CREATE TABLE IF NOT EXISTS token_trades (
  "id" SERIAL PRIMARY KEY,
  "tx" TEXT,
  "token" TEXT,
  "amount" NUMERIC,
  "priceUsd" NUMERIC,
  "volume" NUMERIC,
  "type" TEXT,
  "wallet" TEXT,
  "time" BIGINT,
  "program" TEXT,
  "pools" JSONB,
  "createdOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS token_price_at_timestamp (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT,
  "price" NUMERIC,
  "timestamp" BIGINT,
  "timestamp_unix" BIGINT,
  "pool" TEXT,
  "error" TEXT,
  "createdOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
