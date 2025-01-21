CREATE OR REPLACE FUNCTION public.analyze_and_copy_tokens() RETURNS void AS $$ BEGIN -- Step 1: Select qualified tokens
    WITH qualified_tokens AS (
        SELECT t.id AS token_id,
            t.mint_address_new,
            t.name,
            t.symbol,
            t.uri,
            t.decimals,
            t.image,
            t.description,
            t.has_file_metadata,
            t.twitter,
            t.telegram,
            t.website,
            t.show_name,
            t.created_at,
            t.updated_at,
            t.processed
        FROM new_token_data t
            JOIN new_token_pools p ON t.id = p.token_id
            JOIN new_token_risks r ON t.id = r.token_id
        WHERE r.overall_risk_score < 4
            AND p.usd_liquidity > 12000
            AND t.twitter IS NOT NULL
            AND t.website IS NOT NULL
            AND t.processed = FALSE
    ),
    -- Step 2: Insert qualified tokens into qualified_new_token_data
    inserted_tokens AS (
        INSERT INTO qualified_new_token_data (
                mint_address_new,
                name,
                symbol,
                uri,
                decimals,
                image,
                description,
                has_file_metadata,
                twitter,
                telegram,
                website,
                show_name,
                created_at,
                updated_at,
                processed
            )
        SELECT mint_address_new,
            name,
            symbol,
            uri,
            decimals,
            image,
            description,
            has_file_metadata,
            twitter,
            telegram,
            website,
            show_name,
            created_at,
            updated_at,
            TRUE
        FROM qualified_tokens
        RETURNING id,
            mint_address_new
    ) -- Step 3: Copy qualified pools
INSERT INTO qualified_new_token_pools (
        token_id,
        pool_id,
        quote_liquidity,
        usd_liquidity,
        quote_price,
        usd_price,
        token_supply,
        lp_burn,
        market_cap_quote,
        market_cap_usd,
        freeze_authority,
        mint_authority,
        quote_token,
        market,
        curve_percentage,
        curve_address,
        last_updated,
        created_at,
        deployer,
        buys,
        total_txns,
        volume,
        sells,
        open_time
    )
SELECT it.id,
    p.pool_id,
    p.quote_liquidity,
    p.usd_liquidity,
    p.quote_price,
    p.usd_price,
    p.token_supply,
    p.lp_burn,
    p.market_cap_quote,
    p.market_cap_usd,
    p.freeze_authority,
    p.mint_authority,
    p.quote_token,
    p.market,
    p.curve_percentage,
    p.curve_address,
    p.last_updated,
    p.created_at,
    p.deployer,
    p.buys,
    p.total_txns,
    p.volume,
    p.sells,
    p.open_time
FROM new_token_pools p
    JOIN qualified_tokens qt ON p.token_id = qt.token_id
    JOIN inserted_tokens it ON qt.mint_address_new = it.mint_address_new;
-- Step 4: Copy qualified events
INSERT INTO qualified_new_token_events (
        token_id,
        interval,
        price_change_percentage
    )
SELECT it.id,
    e.interval,
    e.price_change_percentage
FROM new_token_events e
    JOIN qualified_tokens qt ON e.token_id = qt.token_id
    JOIN inserted_tokens it ON qt.mint_address_new = it.mint_address_new;
-- Step 5: Copy qualified risks
INSERT INTO qualified_new_token_risks (
        token_id,
        rugged,
        risk_name,
        risk_description,
        risk_level,
        risk_score,
        overall_risk_score
    )
SELECT it.id,
    r.rugged,
    r.risk_name,
    r.risk_description,
    r.risk_level,
    r.risk_score,
    r.overall_risk_score
FROM new_token_risks r
    JOIN qualified_tokens qt ON r.token_id = qt.token_id
    JOIN inserted_tokens it ON qt.mint_address_new = it.mint_address_new;
-- Step 6: Mark tokens as processed
UPDATE new_token_data
SET processed = TRUE
WHERE id IN (
        SELECT token_id
        FROM qualified_tokens
    );
-- Debugging output
RAISE NOTICE 'Tokens processed: %',
(
    SELECT COUNT(*)
    FROM qualified_tokens
);
RETURN;
END;
$$ LANGUAGE plpgsql;
