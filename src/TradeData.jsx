// "e": "1hTicker",    // Event type
// "E": 1672515782136, // Event time
// "s": "BNBBTC",      // Symbol
// "p": "0.0015",      // Price change
// "P": "250.00",      // Price change percent
// "o": "0.0010",      // Open price
// "h": "0.0025",      // High price
// "l": "0.0010",      // Low price
// "c": "0.0025",      // Last price
// "w": "0.0018",      // Weighted average price
// "v": "10000",       // Total traded base asset volume
// "q": "18",          // Total traded quote asset volume
// "O": 0,             // Statistics open time
// "C": 1675216573749, // Statistics close time
// "F": 0,             // First trade ID
// "L": 18150,         // Last trade Id
// "n": 18151          // Total number of trades

export const DATA_MODEL = {
    e: { active: false, type: 'string', description: 'Event type' },
    E: { active: false, type: 'integer', description: 'Event time' },
    s: { active: false, type: 'string', description: 'Symbol' },
    p: { active: false, type: 'string', description: 'Price change' },
    vol: { active: true, type: 'string', description: 'Volatility' },
    P: { active: true, type: 'string', description: 'Price change percent' },
    o: { active: false, type: 'string', description: 'Open price' },
    h: { active: false, type: 'string', description: 'High price' },
    l: { active: false, type: 'string', description: 'Low price' },
    c: { active: true, type: 'string', description: 'Last price' },
    w: { active: false, type: 'string', description: 'Weighted average price' },
    v: {
        active: false,
        type: 'string',
        description: 'Traded volume',
    },
    q: {
        active: true,
        type: 'string',
        description: 'Traded volume',
    },
    O: { active: false, type: 'integer', description: 'Statistics open time' },
    C: { active: false, type: 'integer', description: 'Statistics close time' },
    F: { active: false, type: 'integer', description: 'First trade ID' },
    L: { active: false, type: 'integer', description: 'Last trade Id' },
    n: {
        active: false,
        type: 'integer',
        description: 'Total number of trades',
    },
};

const QUOTE_CURRENCIES = [
    'USDT',
    'GBP',
    'USDC',
    'USD',
    'EUR',
    'BTC',
    'ETH',
    'DAI',
    'TRY',
];

const MAX_TRADES = 100;

export const splitQuoteSymbol = (symbol) => {
    let quote = QUOTE_CURRENCIES.find((currency) => symbol.includes(currency));
    let base = symbol.replace(quote, '');
    return {
        quote,
        base,
    };
};

export function cleanTradeData(trade) {
    const { quote, base } = splitQuoteSymbol(trade.s);
    return {
        ...trade,
        sp: `${base}/${quote}`,
        quote,
        base,
        localDateString: new Date(trade.E).toString(), // Event time
        comparedToAvg: Math.floor(
            (parseFloat(trade.c) / parseFloat(trade.w) - 1) * 100,
        ), // Percentage below average
        tradeUrl: `https://www.binance.com/fr/trade/${base}_${quote}?type=cross`,
        // Trim trailing zeros
        v: Math.floor(trade.v), // Total traded base asset volume
        P: parseFloat(trade.P),
        p: parseFloat(trade.p),
        w: parseFloat(trade.w),
        q: Math.floor(parseFloat(trade.q)),
        c: parseFloat(trade.c),
    };
}

export const customDataModel = {
    sp: { active: true, description: 'Symbol/Quote' },
    comparedToAvg: { active: false, description: 'Compared to average' },
    ...DATA_MODEL,
};

function volatilityCalculation(trade) {
    let vol = 0;
    if (trade.h && trade.l) {
        vol = (
            ((parseFloat(trade.h) - parseFloat(trade.l)) /
                parseFloat(trade.l)) *
            100
        ).toFixed(2);
    }
    return vol;
}

/**
 * Collapses the previous tickers with the new tickers
 * Calculates differences between two tickers
 * Makes extra calculations to get custom values
 * @param {*} prevTrades
 * @param {*} eventTrades
 * @returns
 */
export function aggregate(prevTrades, eventTrades) {
    let displayed = prevTrades.reduce((acc, cur) => {
        acc[cur.s] = {
            ...cur,
        };
        return acc;
    }, {});

    let mappedNews =
        eventTrades?.reduce((acc, cur) => {
            acc[cur.s] = {
                ...cur,
            };
            return acc;
        }, {}) ?? {};

    const allTradePairs = { ...displayed, ...mappedNews };

    return Object.values(
        Object.keys(allTradePairs).reduce((prev, tradePair) => {
            prev[tradePair] = {
                ...allTradePairs[tradePair],
                isNew: !!mappedNews[tradePair],
            };
            return prev;
        }, {}),
    ).map((trade) => {
        trade.vol = volatilityCalculation(trade);
        trade.diff = trade.P;
        return trade;
    });
}

export const sortingFunction = (sort) => (a, b) => {
    if (!sort) {
        return 0;
    }
    return Object.keys(sort)
        .map((key) => {
            if (sort[key] === 'asc') {
                return a[key] > b[key] ? 1 : -1;
            } else if (sort[key] === 'desc') {
                return a[key] > b[key] ? -1 : 1;
            }
            return 0;
        })
        .reduce((acc, cur) => acc + cur, 0);
};

/**
 * Method called on recieving new trades, it filters, parses, maps the data to display
 * @param {*} prevTrades
 * @param {*} eventTrades
 * @param {*} filter
 * @returns Trading pairs to display
 */
export const newTradesCallback = (prevTrades, eventTrades, filter, sort) => {
    return aggregate(prevTrades, eventTrades)
        .filter((eve) => {
            if (!filter) {
                return true;
            }
            if (eve.vol < 1) {
                return false;
            }
            return eve.s?.includes(filter);
        })
        .sort(sortingFunction(sort))
        .map((trade) => cleanTradeData(trade))
        .slice(0, MAX_TRADES);
};
