// https://docs.cdp.coinbase.com/exchange/reference/exchangerestapi_getproducts
// id - string
// base_currency - string
// quote_currency - string
// quote_increment - string Min order price (a.k.a. price increment)
// base_increment - string
// display_name - string
// min_market_funds - string
// margin_enabled - boolean
// post_only - boolean
// limit_only - boolean
// cancel_only - boolean
// status - string
// Possible values: [online, offline, internal, delisted] - status_message - string
// trading_disabled - boolean
// fx_stablecoin - boolean
// max_slippage_percentage - string
// auction_mode - boolean
// high_bid_limit_percentage - string - Percentage to calculate highest price for limit buy order (Stable coin trading pair only)

export async function fetchAllProducts() {
    const url = 'https://api.exchange.coinbase.com/products';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error(`Error fetching products: ${error}`);
        return [];
    }
}

export function productMap(products) {
    return products.reduce((acc, product) => {
        acc[`${product.quote_currency}`] = product;
        return acc;
    }, {});
}

export async function fetchProductMap() {
    const products = await fetchAllProducts();
    return productMap(products);
}

fetchAllProducts().then((products) => {
    console.log(Object.keys(productMap(products)));
});
