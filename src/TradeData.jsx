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
    e: { active: false, type: "string", description: "Event type" },
    E: { active: false, type: "integer", description: "Event time" },
    s: { active: false, type: "string", description: "Symbol" },
    p: { active: false, type: "string", description: "Price change" },
    P: { active: true, type: "string", description: "Price change percent" },
    o: { active: false, type: "string", description: "Open price" },
    h: { active: false, type: "string", description: "High price" },
    l: { active: false, type: "string", description: "Low price" },
    c: { active: true, type: "string", description: "Last price" },
    w: { active: true, type: "string", description: "Weighted average price" },
    v: {
        active: false,
        type: "string",
        description: "Total traded base asset volume",
    },
    q: {
        active: false,
        type: "string",
        description: "Total traded quote asset volume",
    },
    O: { active: false, type: "integer", description: "Statistics open time" },
    C: { active: false, type: "integer", description: "Statistics close time" },
    F: { active: false, type: "integer", description: "First trade ID" },
    L: { active: false, type: "integer", description: "Last trade Id" },
    n: {
        active: false,
        type: "integer",
        description: "Total number of trades",
    },
};

const QUOTE_CURRENCIES = [
    "USDT",
    "GBP",
    "USDC",
    "USD",
    "EUR",
    "BTC",
    "ETH",
    "DAI",
	"TRY"
];




// BTCUSDT -> BTC/USDT
export const splitQuoteSymbol = (symbol) => {
	let quote = QUOTE_CURRENCIES.find((currency) => symbol.includes(currency));
	let base = symbol.replace(quote, "");
	return {
		quote,
		base,
	};
}

export function cleanTradeData(trade) {
	const { quote, base } = splitQuoteSymbol(trade.s);
    return {
        ...trade,
		sp: `${base}/${quote}`,
		quote,
		base,
        localDateString: new Date(trade.E).toString(), // Event time
		comparedToAvg: Math.floor((parseFloat(trade.c) / parseFloat(trade.w) -1) * 100), // Percentage below average
        p: parseFloat(trade.p).toPrecision(2), // Price change
        P: parseFloat(trade.P).toPrecision(2), // Price change percent
        c: parseFloat(trade.c).toPrecision(2), // Last price
        q: parseFloat(trade.q).toPrecision(2), // Total traded quote asset volume
        v: parseFloat(trade.v).toPrecision(2), // Total traded base asset volume
        w: parseFloat(trade.w).toPrecision(2), // Weighted average price
        o: parseFloat(trade.o).toPrecision(2), // Open price
        h: parseFloat(trade.h).toPrecision(2), // High price
        l: parseFloat(trade.l).toPrecision(2), // Low price
    };
}


export const customDataModel = {
	sp: { active: true, description: "Symbol/Quote" },
	comparedToAvg: { active: true, description: "Compared to average" },
	...DATA_MODEL
};

export function aggregate(prevTrades, eventTrades) {
    let displayed = prevTrades.reduce((acc, cur) => {
        acc[cur.s] = {
            ...cur,
            isNew: false,
        };
        return acc;
    }, {});

    let mappedNews =
        eventTrades?.reduce((acc, cur) => {
            acc[cur.s] = {
                ...cur,
                isNew: true,
            };
            return acc;
        }, {}) ?? {};

    Object.keys(mappedNews).forEach((newTradePair) => {
        if (displayed[newTradePair]) {
            // TODO AGGREGATE and display trend
            displayed[newTradePair] = {
                ...mappedNews[newTradePair],
                isNew: false,
            };
        } else {
            displayed[newTradePair] = {
                ...mappedNews[newTradePair],
                isNew: true,
            };
        }
    });
    return Object.values(displayed);
}
