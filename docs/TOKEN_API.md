1. First Buyers API
   Endpoint: /first-buyers/{token}
   Method: GET

Server: http://192.168.50.226:8082

Arguments:

Path Parameters:
token (required): The token address.
Details:

Fetches the first 100 buyers of a token since the API started recording data.
This data is stored in the first_buyers table.
Front-End Logic:
Warn the user if the token already has first buyers stored in the database before calling this endpoint. 2. Latest Tokens API
Endpoint: /tokens/latest
Method: GET

Server: http://192.168.50.226:8082

Arguments:

Query Parameters:
page (optional): Specifies the page number of results (default: 1). Valid range is 1-10.
Details:

Fetches the 100 latest tokens from SolanaTracker.
Inserts the data into the following tables:
tokens
pools
token_price_changes
events
risks
Updates existing data in the pools, token_price_changes, and events tables if the token already exists. For tokens and risks, only NULL values are updated with non-NULL values. 3. Multi-Token Price API
Endpoint: /price/multi
Method: GET

Server: http://192.168.50.226:8082

Arguments:

Query Parameters:
tokens (required): Comma-separated list of token addresses.
Details:

Fetches price and related data for multiple tokens in a single API call.
Designed for efficient batch processing of token price data. 4. Token Chart Data API
Endpoint: /chart/{token}
Method: GET

Server: http://192.168.50.226:8082

Arguments:

Path Parameters:
token (required): The token address.
Query Parameters:
type (optional): Time interval (e.g., 5m, 1h, 1d). Defaults to 5m.
time_from (optional): Start time (Unix timestamp in seconds). Defaults to 24 hours ago.
time_to (optional): End time (Unix timestamp in seconds). Defaults to the current time.
Details:

Designed to retrieve OCLHV (Open, Close, Low, High, Volume) chart data for tokens.
Supports dynamic time intervals and date ranges. 5. Single Token Price API
Endpoint: /price/{token}
Method: GET

Server: http://192.168.50.226:8082

Arguments:

Path Parameters:
token (required): The token address.
Details:

Fetches current price and liquidity data for a single token.
Designed for quick price lookups. 6. Token Trades API
Endpoint: /trades/{token}
Method: GET

Server: http://192.168.50.226:8082

Arguments:

Path Parameters:
token (required): The token address.
Details:

Retrieves the latest trades for a token across all pools.
Designed for real-time trade updates.
Summary of Server and Parameters
Endpoint URL Method Required Parameters Optional Parameters
First Buyers /first-buyers/{token} GET token None
Latest Tokens /tokens/latest GET None page
Multi-Token Price /price/multi GET tokens None
Token Chart Data /chart/{token} GET token type, time_from, time_to
Single Token Price /price/{token} GET token None
Token Trades /trades/{token} GET token None
