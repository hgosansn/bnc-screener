import { describe, expect, it } from 'vitest';
import {
    DATA_MODEL,
    cleanTradeData,
    aggregate,
    splitQuoteSymbol,
} from './TradeData';

describe('Sanity', () => {
    it('should run tests', () => {
        expect(true).toBe(true);
    });

    it('should map trades', () => {
        const trades = [
            {
                s: 'BTCUSDT',
                E: 1628400000000,
                p: '0',
            },
        ];
        const newTrades = [
            {
                s: 'BTCUSDT',
                E: 1628400000001,
                p: '0',
            },
        ];

        const aggregated = aggregate(trades, newTrades);

        expect(aggregated.length).toBe(1);
        expect(aggregated[0].E).toBe(1628400000001);
    });

    it('should clean trade data', () => {
        const trade = {
            s: 'BTCUSDT',
            E: 1628400000000,
            p: '0',
        };

        const cleaned = cleanTradeData(trade);

        expect(cleaned.sp).toBe('BTC/USDT');
    });

    it('should split quote symbol', () => {
        const symbol = 'BTCUSDT';

        const split = splitQuoteSymbol(symbol);

        expect(split.base).toBe('BTC');
        expect(split.quote).toBe('USDT');
    });
});
