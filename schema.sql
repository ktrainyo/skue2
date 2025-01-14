-- Create or replace the token_overview view
CREATE OR REPLACE VIEW public.token_overview AS
WITH
  tokenstats AS (
    SELECT
      t.mint AS token,
      t.name AS title,
      tp.price AS priceusd,
      tp.price / (
        (
          SELECT
            sp.price
          FROM
            public.sol_price sp
          ORDER BY
            sp.updated_at DESC
          LIMIT 1
        )
      ) AS price,
      tp.liquidity,
      tp."marketCap" AS marketcap,
      tp.price * p."tokenSupply" AS fdv,
      GREATEST(tp."lastUpdated", p."lastUpdated") AS "timestamp"
    FROM
      tokens t
      JOIN token_prices tp ON t.mint = tp.token
      JOIN pools p ON t.mint = p."tokenAddress"
  ),
  tradestats AS (
    SELECT
      tt.token,
      COUNT(*) AS txns,
      SUM(tt.volume) AS volume,
      COUNT(DISTINCT tt.wallet) AS makers,
      COUNT(
        CASE
          WHEN tt.type = 'buy' THEN 1
          ELSE NULL
        END
      ) AS buys,
      COUNT(
        CASE
          WHEN tt.type = 'sell' THEN 1
          ELSE NULL
        END
      ) AS sells,
      SUM(
        CASE
          WHEN tt.type = 'buy' THEN tt.volume
          ELSE 0
        END
      ) AS buy_volume,
      SUM(
        CASE
          WHEN tt.type = 'sell' THEN tt.volume
          ELSE 0
        END
      ) AS sell_volume,
      COUNT(
        DISTINCT CASE
          WHEN tt.type = 'buy' THEN tt.wallet
          ELSE NULL
        END
      ) AS buyers,
      COUNT(
        DISTINCT CASE
          WHEN tt.type = 'sell' THEN tt.wallet
          ELSE NULL
        END
      ) AS sellers,
      MAX(TO_TIMESTAMP(tt."time"::DOUBLE PRECISION)) AS "timestamp"
    FROM
      token_trades tt
    GROUP BY
      tt.token
  ),
  percentage_change AS (
    SELECT
      tp.token,
      (
        tp.price - LAG(tp.price) OVER (
          PARTITION BY
            tp.token
          ORDER BY
            tp."lastUpdated" DESC
        )
      ) / LAG(tp.price) OVER (
        PARTITION BY
          tp.token
        ORDER BY
          tp."lastUpdated" DESC
      ) * 100::NUMERIC AS percentage_change,
      tp."lastUpdated"
    FROM
      token_prices tp
  ),
  timeframe_changes AS (
    SELECT
      percentage_change.token,
      MAX(
        CASE
          WHEN percentage_change."lastUpdated" >= (NOW() - INTERVAL '5 minutes') THEN percentage_change.percentage_change
          ELSE NULL
        END
      ) AS "5M_percentage",
      MAX(
        CASE
          WHEN percentage_change."lastUpdated" >= (NOW() - INTERVAL '10 minutes') THEN percentage_change.percentage_change
          ELSE NULL
        END
      ) AS "10M_percentage",
      MAX(
        CASE
          WHEN percentage_change."lastUpdated" >= (NOW() - INTERVAL '15 minutes') THEN percentage_change.percentage_change
          ELSE NULL
        END
      ) AS "15M_percentage",
      MAX(
        CASE
          WHEN percentage_change."lastUpdated" >= (NOW() - INTERVAL '30 minutes') THEN percentage_change.percentage_change
          ELSE NULL
        END
      ) AS "30M_percentage"
    FROM
      percentage_change
    GROUP BY
      percentage_change.token
  )
SELECT
  ts.token,
  ts.title,
  ts.priceusd,
  ts.price,
  ts.liquidity,
  ts.fdv,
  ts.marketcap,
  tr.txns,
  tr.volume,
  tr.buyers + tr.sellers AS makers, -- Calculate makers as the total of buyers and sellers
  tr.buys,
  tr.sells,
  tr.buy_volume,
  tr.sell_volume,
  tr.buyers,
  tr.sellers,
  tf."5M_percentage",
  tf."10M_percentage",
  tf."15M_percentage",
  tf."30M_percentage",
  GREATEST(
    ts."timestamp"::TIMESTAMP WITH TIME ZONE,
    tr."timestamp"
  ) AS "timestamp"
FROM
  tokenstats ts
  JOIN tradestats tr ON ts.token = tr.token
  JOIN timeframe_changes tf ON ts.token = tf.token;
